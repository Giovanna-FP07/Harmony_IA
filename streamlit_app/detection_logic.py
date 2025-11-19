import cv2
import time
import numpy as np
import mediapipe as mp
import simpleaudio as sa # Importado para safe_play_sound

# Inicializa MediaPipe Drawing (necessário para desenhar os pontos)
mp_drawing = mp.solutions.drawing_utils
mp_holistic = mp.solutions.holistic


# -----------------------------
# FUNÇÕES DE INICIALIZAÇÃO
# -----------------------------
def initialize_holistic_model():
    """Inicializa e retorna o modelo Holistic do MediaPipe."""
    return mp_holistic.Holistic(
        static_image_mode=False,
        model_complexity=1,
        refine_face_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )


def initialize_global_vars():
    """
    Inicializa todas as variáveis globais de estado da sessão.
    TODOS os campos lidos em app.py devem estar aqui para evitar KeyError.
    """
    return {
        # Métricas de Detecção (Corrigido o KeyError)
        'score_fadiga': 50,
        'Inclinacao': 0.0,
        'Tensaofac': 'Baixa',
        'PiscadasPM': 0,
        'TempoFoco': 0,
        'Bocejos': 0,

        # Configurações
        'limite_alerta': 75,
        
        # Estado do Alerta
        'alerta_sono': False,
        'alerta_bocejo': 0, # Timestamp
        'inicio_foco': time.time() # Para calcular o TempoFoco
    }


def safe_play_sound():
    """Tenta tocar um som de alerta (pode exigir arquivo .wav)."""
    try:
        # Substitua 'caminho/para/seu/alerta.wav' pelo caminho real do seu arquivo de som
        # Se você não tem um arquivo .wav, pode comentar esta linha para evitar erros
        # wave_obj = sa.WaveObject.from_wave_file("caminho/para/seu/alerta.wav")
        # play_obj = wave_obj.play()
        # play_obj.wait_done()
        pass
    except Exception as e:
        # print(f"Erro ao tocar som (pode ser ignorado): {e}")
        pass


# -----------------------------
# LÓGICA DE PROCESSAMENTO (Exemplo Simples)
# -----------------------------

def process_frame(frame, holistic_model, metricas_atuais):
    """
    Processa um único frame do vídeo para detectar fadiga.
    NOTA: A lógica completa de cálculo de Inclinacao, Tensaofac, etc. não está incluída
    aqui, mas o desenho e o retorno dos dados são cruciais.
    """
    
    # 1. Pré-processamento
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame_rgb.flags.writeable = False
    
    # 2. Processamento MediaPipe
    results = holistic_model.process(frame_rgb)
    frame.flags.writeable = True
    frame = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR)

    # 3. Desenho dos Landmarks (CORRIGIDO: Garante que os pontos apareçam)
    if results.face_landmarks:
        mp_drawing.draw_landmarks(
            frame, 
            results.face_landmarks, 
            mp_holistic.FACEMESH_CONTOURS,
            landmark_drawing_spec=mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
            connection_drawing_spec=mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
        )

    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            frame, 
            results.pose_landmarks, 
            mp_holistic.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2),
            connection_drawing_spec=mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
        )
        
    # 4. Lógica de Métrica (Apenas para demonstração e atualização)
    
    # Simula a atualização das métricas
    metricas_atuais['score_fadiga'] = min(metricas_atuais['score_fadiga'] + np.random.randint(-1, 2), 95)
    metricas_atuais['Inclinacao'] = np.random.uniform(-5.0, 5.0) # Valor de exemplo
    metricas_atuais['Tensaofac'] = 'Média' if metricas_atuais['score_fadiga'] > 60 else 'Baixa'
    metricas_atuais['TempoFoco'] = int(time.time() - metricas_atuais['inicio_foco'])
    
    # 5. Retorna o frame DESENHADO e as métricas atualizadas
    return frame, metricas_atuais