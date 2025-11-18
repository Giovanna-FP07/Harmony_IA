'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Bot, Droplets, Video, ToyBrick, Power } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const ZoomIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#2D8CFF"/>
        <path d="M16.5 7.5L13.5 12L16.5 16.5H13.5L10.5 12L13.5 7.5H16.5Z" fill="white"/>
        <path d="M10.5 7.5L7.5 12L10.5 16.5H7.5L4.5 12L7.5 7.5H10.5Z" fill="white"/>
    </svg>
);

const MeetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#00897B"/>
        <path d="M12.75 16.5H6.75V7.5H12.75C14.0454 7.5 15.2868 8.02678 16.2272 8.96715C17.1675 9.90751 17.6943 11.1489 17.6943 12.4443C17.6943 13.7397 17.1675 14.9811 16.2272 15.9214C15.2868 16.8618 14.0454 17.3886 12.75 17.3886V16.5Z" fill="white" stroke="#00897B" strokeWidth="1.5"/>
        <path d="M8.25 9H9.75V15H8.25V9Z" fill="#00897B"/>
    </svg>
);

const TeamsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="4" fill="#4F52B2"/>
        <path d="M12.375 7.5H16.5V9.75H14.25V12.75H16.5V15H14.25V16.5H12.375V7.5Z" fill="white"/>
        <path d="M9 7.5H11.25V16.5H9V7.5Z" fill="white"/>
        <path d="M6 9.75H8.25V13.5H6V9.75Z" fill="white"/>
    </svg>
);

type AnalysisData = {
    ear: number;
    mar: number;
    piscadas: number;
    bocejos: number;
    inclinacaoOmbro: number;
    tempoSono: number;
};

// Debounce function
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };
};

export function BodyMapCard() {
    const { toast } = useToast();
    const [view, setView] = useState<'camera' | '3d'>('camera');
    const [analysis, setAnalysis] = useState<AnalysisData>({ ear: 0, mar: 0, piscadas: 0, bocejos: 0, inclinacaoOmbro: 0, tempoSono: 0 });
    
    // --- Câmera e MediaPipe ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isModelsLoading, setIsModelsLoading] = useState(true);
    const requestRef = useRef(0);
    const workerRef = useRef<Worker>();
    const [isCameraActive, setIsCameraActive] = useState(false);
    
    // --- Alerta Sonoro ---
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // --- Visualização 3D ---
    const mountRef = useRef<HTMLDivElement>(null);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const playAlertSound = useCallback(debounce(() => {
        audioRef.current?.play().catch(error => console.error("Audio playback failed:", error));
    }, 10000), []);


    // --- Inicializa o Worker e o Áudio ---
    useEffect(() => {
        workerRef.current = new Worker(new URL('../../workers/vision.worker.ts', import.meta.url));

        if (typeof Audio !== "undefined") {
            audioRef.current = new Audio('/alert.mp3');
        }
        
        workerRef.current.onmessage = (event) => {
            const { type, data } = event.data;
            if (type === 'modelsLoaded') {
                setIsModelsLoading(false);
            } else if (type === 'analysisResult') {
                setAnalysis(data.analysis);
            } else if (type === 'fatigueAlert') {
                playAlertSound();
            } else if (type === 'error') {
                 toast({ variant: 'destructive', title: 'Erro no Worker', description: data });
            }
        };

        workerRef.current.postMessage({ type: 'init' });

        return () => {
            workerRef.current?.terminate();
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            cancelAnimationFrame(requestRef.current);
        }
    }, [toast, playAlertSound]);
    
    const toggleCamera = async () => {
      if (isCameraActive) {
          setIsCameraActive(false);
          cancelAnimationFrame(requestRef.current);
          if (videoRef.current?.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach(track => track.stop());
              videoRef.current.srcObject = null;
          }
          setHasCameraPermission(null);
      } else {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
              setHasCameraPermission(true);
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                  videoRef.current.play();
                  setIsCameraActive(true);
              }
          } catch (error) {
              setHasCameraPermission(false);
              toast({
                  variant: 'destructive',
                  title: 'Acesso à Câmera Negado',
                  description: 'Por favor, habilite a permissão da câmera para usar este recurso.',
              });
          }
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const predictWebcam = () => {
        const video = videoRef.current;
        if(video && video.readyState >= 3 && workerRef.current && !isModelsLoading && isCameraActive) {
            const offscreen = new OffscreenCanvas(video.videoWidth, video.videoHeight);
            const ctx = offscreen.getContext('2d');
            if(ctx) {
                ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
                workerRef.current?.postMessage({ type: 'predict', imageData }, [imageData.data.buffer]);
            }
        }
        requestRef.current = requestAnimationFrame(predictWebcam);
    }
    
    useEffect(() => {
        if (isCameraActive && hasCameraPermission && !isModelsLoading) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isCameraActive, hasCameraPermission, isModelsLoading, predictWebcam]);
    
    useEffect(() => {
        if (view !== '3d' || !mountRef.current || typeof window === 'undefined') return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        scene.background = null;
        const camera = new THREE.PerspectiveCamera(50, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 4);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 3;
        controls.maxPolarAngle = 2 * Math.PI / 3;
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);
        
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

        const head = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), bodyMaterial);
        head.position.y = 1.5;
        scene.add(head);

        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMaterial);
        leftEye.position.set(-0.35, 1.7, 0.85);
        head.add(leftEye);

        const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMaterial);
        rightEye.position.set(0.35, 1.7, 0.85);
        head.add(rightEye);

        const animate = () => {
            requestAnimationFrame(animate);

            head.rotation.y += 0.005;

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                // Check if the renderer's DOM element is still a child before removing
                if (currentMount.contains(renderer.domElement)) {
                    currentMount.removeChild(renderer.domElement);
                }
            }
        };
    }, [view]);

    const handleChatClick = () => {
      window.dispatchEvent(new CustomEvent('toggle-chat-drawer'));
    };

    const renderAnalysisView = () => (
        <div className="relative w-full aspect-video bg-muted/30 rounded-md overflow-hidden border flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover block absolute inset-0" autoPlay muted playsInline />
            
            {isCameraActive && hasCameraPermission && (
                <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <div className="bg-black/50 text-white text-xs rounded p-2 pointer-events-auto">
                        <p>EAR: {analysis.ear.toFixed(2)} (Olhos)</p>
                        <p>MAR: {analysis.mar.toFixed(2)} (Boca)</p>
                        <p>Piscadas: {analysis.piscadas}</p>
                        <p>Bocejos: {analysis.bocejos}</p>
                        <p>Incl. Ombro: {analysis.inclinacaoOmbro.toFixed(2)}°</p>
                        <p>Tempo Olhos Fechados: {analysis.tempoSono.toFixed(2)}s</p>
                    </div>
                </div>
            )}
            
            {!isCameraActive && (
                <div className="text-center p-4">
                    <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">A câmera está desligada</p>
                </div>
            )}

            {isCameraActive && hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <Alert variant="destructive" className="m-4 max-w-sm">
                        <AlertTitle>Câmera Necessária</AlertTitle>
                        <AlertDescription>
                            Permita o acesso à câmera para análise de fadiga.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {isCameraActive && isModelsLoading && hasCameraPermission && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                     <div className="text-white text-center p-4 bg-black/70 rounded-lg">
                        <p>Carregando modelos de IA...</p>
                     </div>
                 </div>
            )}
        </div>
    );

    const render3DView = () => (
        <div className="relative w-full aspect-video bg-muted/30 rounded-md overflow-hidden border flex items-center justify-center">
             <div className="absolute inset-0" ref={mountRef} />
             <p className="z-10 text-xs text-muted-foreground self-end mb-2">Arraste para girar o modelo</p>
        </div>
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Droplets className="h-6 w-6" /> Mapa Corporal</CardTitle>
                        <CardDescription className="pt-2">Visualize sinais de fadiga em tempo real.</CardDescription>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                          onClick={toggleCamera}
                          variant={isCameraActive ? 'destructive' : 'outline'}
                          size="sm"
                          disabled={view !== 'camera'}
                        >
                          <Power className="h-6 w-6 mr-2" />
                          {isCameraActive ? 'Desligar' : 'Ligar Câmera'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div>
                        <Tabs value={view} onValueChange={(v) => setView(v as 'camera' | '3d')} className="w-full">
                            <div className="flex justify-center mb-4">
                                <TabsList>
                                    <TabsTrigger value="camera"><Video className="h-6 w-6 mr-2"/>Análise</TabsTrigger>
                                    <TabsTrigger value="3d"><ToyBrick className="h-6 w-6 mr-2"/>3D</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="camera" className="mt-0">
                                {renderAnalysisView()}
                            </TabsContent>
                            <TabsContent value="3d" className="mt-0">
                                {render3DView()}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Bot className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">O que é Burnout?</h4>
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <p>É um estado de esgotamento físico e mental causado pelo estresse crônico no trabalho. A Aura ajuda a identificar os sinais antes que se agravem.</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Exaustão emocional e física.</li>
                                            <li>Sentimento de ceticismo ou distanciamento do trabalho.</li>
                                            <li>Sensação de ineficácia e falta de realização.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={handleChatClick} variant="outline" size="sm" className="w-full">Conversar com a Aura</Button>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <h4 className="font-semibold">Integração com Reuniões</h4>
                            <p className="text-sm text-muted-foreground">Receba alertas de fadiga e sugestões diretamente em suas reuniões online.</p>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href="https://www.zoom.com/" target="_blank" rel="noopener noreferrer">
                                        <ZoomIcon className="mr-2 h-6 w-6" /> Zoom
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                     <Link href="https://meet.google.com/" target="_blank" rel="noopener noreferrer">
                                        <MeetIcon className="mr-2 h-6 w-6" /> Meet
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href="https://www.microsoft.com/pt-br/microsoft-teams/online-meetings" target="_blank" rel="noopener noreferrer">
                                        <TeamsIcon className="mr-2 h-6 w-6" /> Teams
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

    