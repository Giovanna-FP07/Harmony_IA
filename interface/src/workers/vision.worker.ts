/// <reference lib="webworker" />

import { FaceLandmarker, FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

let faceLandmarker: FaceLandmarker;
let poseLandmarker: PoseLandmarker;
let isReady = false;

// --- Variáveis de estado para a lógica de detecção (traduzido do Python) ---
let dormindo = 0; // 0 = acordado, 1 = olhos fechados
let contagem_piscadas = 0;
let bocejos = 0;
let tInicialOlhosFechados = 0; // Timestamp (ms) do início do fechamento do olho
let tInicialBocaAberta = 0;   // Timestamp (ms) do início da abertura da boca para bocejo

// --- Constantes de limiar (traduzido do Python) ---
const BOCEJO_TEMPO_MS = 2000; // 2 segundos para contar como bocejo (ajustado de 3.0s)
const EAR_LIMIAR = 0.28; // Limiar para detecção de olho fechado (ajustado para 3D)
const MAR_LIMIAR = 0.2; // Limiar para detecção de boca aberta
const TEMPO_SONO_ALERTA_S = 1.5; // 1.5 segundos para alerta de sono

// Função para calcular a distância euclidiana 3D entre dois pontos
const calculoDistancia = (p1: any, p2: any) => Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2)
);

// Função para calcular o Eye Aspect Ratio (EAR) 3D
const calculoEar = (landmarks: any[]) => {
    try {
        const p1_dir = landmarks[160], p5_dir = landmarks[158];
        const p2_dir = landmarks[144], p4_dir = landmarks[153];
        const p3_dir = landmarks[33],  p6_dir = landmarks[133];
        
        const p1_esq = landmarks[385], p5_esq = landmarks[387];
        const p2_esq = landmarks[380], p4_esq = landmarks[373];
        const p3_esq = landmarks[263], p6_esq = landmarks[362];

        const earDir = (calculoDistancia(p1_dir, p2_dir) + calculoDistancia(p5_dir, p4_dir)) / (2 * calculoDistancia(p3_dir, p6_dir));
        const earEsq = (calculoDistancia(p1_esq, p2_esq) + calculoDistancia(p5_esq, p4_esq)) / (2 * calculoDistancia(p3_esq, p6_esq));

        return (earEsq + earDir) / 2;
    } catch {
        return 0.0;
    }
};

// Função para calcular o Mouth Aspect Ratio (MAR) 3D
const calculoMar = (landmarks: any[]) => {
   try {
        const p1 = landmarks[82], p2 = landmarks[87];
        const p3 = landmarks[13],  p4 = landmarks[14];
        const p5 = landmarks[312], p6 = landmarks[317];
        const p7 = landmarks[78],  p8 = landmarks[308];
       
        return (calculoDistancia(p1,p2) + calculoDistancia(p3,p4) + calculoDistancia(p5,p6)) / (2 * calculoDistancia(p7,p8));
   } catch {
       return 0.0;
   }
};


async function createLandmarkers() {
    try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
        
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`, delegate: 'GPU' },
            outputFaceBlendshapes: false, runningMode: "IMAGE", numFaces: 1,
        });
        
        poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, delegate: 'GPU' },
            runningMode: "IMAGE", numPoses: 1,
        });

        isReady = true;
        self.postMessage({ type: 'modelsLoaded' });

    } catch (error) {
        console.error("Error creating landmarkers:", error);
        try {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");

            faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`, delegate: 'CPU' },
                outputFaceBlendshapes: false, runningMode: "IMAGE", numFaces: 1,
            });

            poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`, delegate: 'CPU' },
                runningMode: "IMAGE", numPoses: 1,
            });

            isReady = true;
            self.postMessage({ type: 'modelsLoaded' });
        } catch (cpuError) {
             self.postMessage({ type: 'error', data: `Não foi possível carregar os modelos de IA: ${(cpuError as Error).message}` });
        }
    }
}


self.onmessage = async (event) => {
    const { type } = event.data;

    if (type === 'init') {
        await createLandmarkers();
    } else if (type === 'predict') {
        if (!isReady) return;

        const { imageData } = event.data;
        const now = performance.now();

        // Detecção de face
        const faceResults = faceLandmarker.detect(imageData);
        
        let ear = 0, mar = 0, tempoSono = 0;
        
        if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
            const landmarks = faceResults.faceLandmarks[0];
            ear = calculoEar(landmarks);
            mar = calculoMar(landmarks);

            // --- Lógica de Bocejo (do script Python) ---
            if (mar >= MAR_LIMIAR) {
                if (tInicialBocaAberta === 0) {
                    tInicialBocaAberta = now;
                } else if ((now - tInicialBocaAberta) >= BOCEJO_TEMPO_MS) {
                    bocejos += 1;
                    self.postMessage({ type: 'fatigueAlert' }); // Envia alerta de bocejo
                    tInicialBocaAberta = 0; // Reseta para não contar o mesmo bocejo várias vezes
                }
            } else {
                tInicialBocaAberta = 0; // Reseta se a boca fechar
            }
            
            // --- Lógica de Piscada e Sonolência (do script Python) ---
            if (ear < EAR_LIMIAR && mar < MAR_LIMIAR) { // Olhos fechados e boca fechada (para não contar bocejo como sono)
                if (dormindo === 0) { // Se o olho acabou de fechar
                    tInicialOlhosFechados = now;
                    dormindo = 1;
                    contagem_piscadas += 1; // Conta como uma piscada
                }
            } else { // Olho está aberto ou boca está aberta
                if (dormindo === 1) { // Se o olho acabou de abrir
                    dormindo = 0;
                    // O tempo de início é resetado apenas quando o olho abre
                }
            }

             // Calcula o tempo de sono se os olhos estiverem fechados
             if (dormindo === 1 && tInicialOlhosFechados > 0) {
                tempoSono = (now - tInicialOlhosFechados) / 1000;
             } else {
                tempoSono = 0;
                tInicialOlhosFechados = 0; // Garante que o tempo resete ao abrir os olhos
             }

            
            // Envia alerta de sono se o tempo exceder o limiar
            if (tempoSono >= TEMPO_SONO_ALERTA_S) {
                self.postMessage({ type: 'fatigueAlert' });
            }
        }

        // --- Detecção de Pose ---
        let inclinacao = 0;
        const poseResults = poseLandmarker.detect(imageData);
        if (poseResults.landmarks && poseResults.landmarks.length > 0) {
            const landmarks = poseResults.landmarks[0];
            const ombroEsq = landmarks[11];
            const ombroDir = landmarks[12];
            if (ombroEsq && ombroDir) {
                const dx = ombroDir.x - ombroEsq.x;
                const dy = ombroDir.y - ombroEsq.y;
                inclinacao = Math.atan2(dy, dx) * (180 / Math.PI);
            }
        }
        
        self.postMessage({ 
            type: 'analysisResult', 
            data: {
                analysis: {
                    ear, 
                    mar, 
                    piscadas: contagem_piscadas, 
                    bocejos, 
                    inclinacaoOmbro: inclinacao, 
                    tempoSono
                },
            }
        });
    }
};

    