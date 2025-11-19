import streamlit as st
import cv2
import time
import os
import numpy as np # Adicionado para uso em dados mock

# Importações corrigidas
from detection_logic import process_frame, initialize_holistic_model, initialize_global_vars, safe_play_sound
from utils import load_style, load_historical_data, render_header # Render_header foi adicionado ao utils.py
from google import genai 

# --- 0. CONFIGURAÇÃO DE ESTADO ---
if 'global_vars' not in st.session_state:
    st.session_state.global_vars = initialize_global_vars()
if 'gemini_history' not in st.session_state:
    st.session_state.gemini_history = []
if 'alerta_counter' not in st.session_state:
    st.session_state.alerta_counter = 0
if 'alerta_ativo' not in st.session_state:
    st.session_state.alerta_ativo = False
    
# --- 1. CONFIGURAÇÃO E ESTILO ---
st.set_page_config(layout="wide", page_title="AuraMind - Assistente de Burnout")
load_style() 

# --- 2. TRATAMENTO DA CHAVE DE API ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or st.secrets.get("GEMINI_API_KEY")

client = None
if not GEMINI_API_KEY:
    # Apenas avisa, não para (para permitir a visualização da UI e do vídeo)
    st.warning("⚠️ Chave GEMINI_API_KEY não encontrada. O Chatbot Aura não funcionará.")
    client = None
else:
    try:
        # CORREÇÃO: Removido 'timeout=120' para evitar o erro.
        client = genai.Client(api_key=GEMINI_API_KEY) 
    except Exception as e:
        st.error(f"Erro ao inicializar o Gemini. O chatbot não funcionará. Detalhe: {e}")
        client = None

# Inicializa o modelo Holistic do MediaPipe
holistic_model = initialize_holistic_model()

# --- 3. FUNÇÕES MODULARIZADAS DE RENDERIZAÇÃO ---

def get_aura_response(prompt_usuario, metricas_atuais):
    if not client:
        return "Desculpe, a conexão com a Aura (Gemini) falhou. Verifique sua chave de API."

    contexto_ia = f"""
    Você é a Aura, uma assistente de bem-estar empática e especialista em prevenção de burnout.
    Sua resposta deve ser acolhedora, breve e focada em ações imediatas (pausas, alongamentos).
    Seu score de fadiga atual é {metricas_atuais['score_fadiga']}.
    
    A pergunta do usuário é: '{prompt_usuario}'
    """

    # Formata o histórico da sessão
    model_history = [
        {'role': 'user', 'parts': [{'text': h['content']}]} if h['role'] == 'user' else 
        {'role': 'model', 'parts': [{'text': h['content']}]} 
        for h in st.session_state.gemini_history
    ]
    
    try:
        # Constrói o conteúdo da requisição
        contents = model_history + [{"role": "user", "parts": [{"text": contexto_ia + "\n\n" + prompt_usuario}]}]
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents
        )
        return response.text
    except Exception as e:
        return f"Erro na API do Gemini: {e}"


def render_aura_chat(col_aura, alerta_placeholder):
    """Renderiza a seção do chatbot na coluna direita."""
    with col_aura:
        st.subheader("Aura: Seu Terapeuta Amigo")
        
        # Alerta da Aura (Placeholder)
        
        st.markdown("---")
        st.markdown("### Aura Chat")
        chat_container = st.container(height=350)
        
        with chat_container:
            for message in st.session_state.gemini_history:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])

        if prompt := st.chat_input("Pergunte algo a Aura...", key="chat_input"):
            st.session_state.gemini_history.append({"role": "user", "content": prompt})
            
            # Exibe a mensagem do usuário imediatamente
            with chat_container:
                with st.chat_message("user"):
                    st.markdown(prompt)

            # Gera a resposta
            with st.spinner("Aura está pensando..."):
                metricas_atuais = st.session_state.global_vars
                response = get_aura_response(prompt, metricas_atuais)
            
            # Exibe a resposta e atualiza o histórico
            with chat_container:
                with st.chat_message("assistant"):
                    st.markdown(response)
            st.session_state.gemini_history.append({"role": "assistant", "content": response})

def render_status_info(mapping_placeholder, integracao_placeholder):
    """Renderiza a seção de Status/Info na coluna esquerda (conteúdo estático)."""
    # Conteúdo que é atualizado no loop será injetado aqui (mapping_placeholder)
    
    st.markdown("---")
    st.subheader("O Que é Burnout?")
    st.markdown("""
    É um estado de esgotamento físico e mental causado pelo estresse crônico no trabalho. A Aura ajuda a identificar os sinais antes que se agravem.
    * *Exaustão* emocional e física.
    * *Sentimento de ceticismo* ou distanciamento do trabalho.
    * *Sensação de ineficácia* e falta de realização.
    """)
    
    with integracao_placeholder.container():
        st.markdown("""
        <div style='background-color: #E6F7E6; padding: 10px; border-radius: 8px; margin-top: 15px;'>
            *🟢 Integração com WhatsApp*
            <br>Receba alertas e dicas diretamente.
        </div>
        """, unsafe_allow_html=True)
        st.button("Integrar Agora", key="wa_integrar", use_container_width=True)


# --- 4. LAYOUT PRINCIPAL E HEADERS ---
score_fadiga_display = st.session_state.global_vars['score_fadiga']
render_header(score_fadiga_display)


# --- 5. ESTRUTURA DE ABAS ---
tab1, tab2, tab3 = st.tabs(["⭐ Meu Status Atual", "📈 Tendências e Histórico", "⚙️ Guia e Configurações"])

# --- Lógica da ABA 1 (Status Atual) ---
with tab1:
    col_status_info, col_video, col_aura = st.columns([1.5, 3.5, 2.5])
    
    # Placeholders para conteúdo dinâmico na COLUNA ESQUERDA
    mapping_placeholder = col_status_info.empty()
    integracao_placeholder = col_status_info.empty()
    
    # Renderiza o conteúdo estático/semi-estático da coluna esquerda
    render_status_info(mapping_placeholder, integracao_placeholder)
    
    # Placeholders para conteúdo dinâmico na COLUNA CENTRAL e DIREITA
    video_placeholder = col_video.empty()
    metricas_placeholder = col_video.empty() 
    alerta_placeholder = col_aura.empty() 

    # Renderiza a UI do Chatbot
    render_aura_chat(col_aura, alerta_placeholder)
    
    cap = cv2.VideoCapture(0)

    # --- LOOP DE VÍDEO E DETECÇÃO (TEMPO REAL) ---
    if cap.isOpened():
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            
            # Processa o frame e atualiza as métricas globais
            processed_frame, metricas_atuais = process_frame(frame, holistic_model, st.session_state.global_vars)
            
            # Alerta Sonoro
            if metricas_atuais.get('alerta_sono') or (metricas_atuais.get('alerta_bocejo') and time.time() - metricas_atuais['alerta_bocejo'] < 1.5):
                safe_play_sound()

            processed_frame_rgb = cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB)
            
            score = metricas_atuais['score_fadiga']
            
            # CORREÇÃO: Garante que as chaves existem antes de ler
            inclinacao = metricas_atuais.get('Inclinacao', 0.0) 
            tensao_fac = metricas_atuais.get('Tensaofac', 'N/A')
            
            status_fisico = "TENSÃO FÍSICA ALTA" if score >= 70 else "Status Estável"
            cor_fundo_status = "#D68A9A" if score >= 70 else "#A2E2A6"
            
            # 1. Exibir o Frame Processado
            # CORREÇÃO: use_container_width (remove aviso de depreciação)
            video_placeholder.image(processed_frame_rgb, channels="RGB", use_container_width=True, caption="Video Feed (Mapeamento Ativo)")
            
            # 2. Atualizar o Painel de Mapeamento/Status (COLUNA ESQUERDA)
            # CORREÇÃO: KeyError resolvido pelo initialize_global_vars e get()
            with mapping_placeholder.container():
                st.subheader("Mapeamento Corporal 3D")
                st.markdown(f"""
                <div style='background-color: #FFFFFF; border: 1px solid #EEEEEE; padding: 20px; border-radius: 8px; text-align: center;'>
                    <span style='color: {cor_fundo_status}; font-weight: bold;'>{status_fisico}</span>
                    <br>
                    <small>Inclinacão do Ombro: {inclinacao:.1f}º | Tensão Facial: {tensao_fac}</small>
                </div>
                """, unsafe_allow_html=True)
            
            # 3. Atualizar Micro-Indicadores (COLUNA CENTRAL)
            with metricas_placeholder.container():
                st.markdown("### Micro-Indicadores")
                col_micro_1, col_micro_2 = st.columns(2)
                col_micro_1.markdown(f"*Tensão Facial:* {metricas_atuais.get('Tensaofac', 'N/A')}")
                col_micro_2.markdown(f"*Piscadas/min:* {metricas_atuais.get('PiscadasPM', 0)}") 
                col_micro_1.markdown(f"*Tempo de Foco:* {metricas_atuais.get('TempoFoco', 0)}s")
                col_micro_2.markdown(f"*Contagem Bocejos:* {metricas_atuais.get('Bocejos', 0)}")

                st.markdown("---")
                st.markdown("### Foco vs. Pausas")
                st.info("Gráfico de distribuição da atividade (Em desenvolvimento)")
            
            # 4. Gerenciamento do Alerta
            limite = st.session_state.global_vars['limite_alerta']
            alerta_necessario = score >= limite
            
            # Garante que o placeholder do alerta esteja limpo se o alerta não for necessário
            if not alerta_necessario and st.session_state.alerta_ativo:
                st.session_state.alerta_ativo = False
                alerta_placeholder.empty()

            if alerta_necessario:
                
                if not st.session_state.alerta_ativo:
                    st.session_state.alerta_ativo = True

                # Definimos as chaves FIXAS AQUI DENTRO, onde o botão será renderizado.
                key_pausar = "pausar_agora_fixa" 
                key_nao = "agora_nao_fixa"
                key_nao_bem = "nao_bem_fixa"

                with alerta_placeholder.container():
                    st.markdown(f"""
                    <div style='background-color: #FFFACD; border: 2px solid #FFA07A; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 10px;'>
                        <span style='font-size: 20px; font-weight: bold; color: #4B4B4B;'>Pausa Rápida Necessária!</span>
                        <br>
                        Seu *Índice de Cansaço Mental está em {score:.0f}*.
                        <br>
                        Permita que eu te guie em um exercício simples de respiração.
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # O botão DEVE ESTAR AQUI DENTRO DO container()
                    if st.button("Sim, Me Guie Agora!", key=key_pausar, use_container_width=True):
                        st.session_state.global_vars['score_fadiga'] = 50 
                        st.session_state.alerta_ativo = False
                        st.rerun() 
                    
                    st.button("Lembro Depois (Daqui a 15 min)", key=key_nao, use_container_width=True)
                    
                    if st.button("Não, Estou Bem Agora.", key=key_nao_bem, use_container_width=True):
                        st.session_state.alerta_ativo = False
                        alerta_placeholder.empty()
            
            # Se o alerta não for necessário, o bloco "if alerta_necessario" é pulado, 
            # e o alerta_placeholder já foi limpo no início do bloco.

            time.sleep(0.02)
    
    cap.release()
    cv2.destroyAllWindows()


# --- 6. ABA 2: TENDÊNCIAS E HISTÓRICO ---
with tab2:
    st.header("Análise de Padrões e Histórico")
    
    try:
        df_tendencia = load_historical_data()
        st.subheader("Evolução da Fadiga na Semana")
        st.line_chart(df_tendencia, y='Score', color="#FFA07A")
    except Exception as e:
        st.warning(f"Erro ao carregar dados históricos: {e}. Verifique o arquivo utils.py.")
    
    st.markdown("---")
    
    col_hist, col_terapia = st.columns([1, 1])
    
    with col_hist:
        st.subheader("Histórico de Interações da Aura")
        st.info("Resumo de aceites vs. recusas de pausas. (Em desenvolvimento)")
    
    with col_terapia:
        st.subheader("Tipos de Terapia Complementar")
        st.markdown("* 💚 *Equoterapia:* Terapia com cavalos.")
        st.markdown("* 🎨 *Arterapia:* Uso de expressões artísticas.")
        st.markdown("* 🎶 *Musicoterapia:* Uso de sons e ritmos.")
        st.markdown("* 🧘 *Meditação:* Técnicas para treinar a mente.")


# --- 7. ABA 3: GUIA E CONFIGURAÇÕES ---
with tab3:
    st.header("Guia e Configurações")
    
    st.subheader("Ajustes da IA")
    st.slider("Sensibilidade da Detecção Facial", 0, 100, 70, key="sens_facial", help="Ajusta o limiar de detecção facial.")
    
    alerta_limite = st.slider("Limite de Alerta do Cansaço", 50, 90, 75, key="limite_alerta_slider", help="Pontuação que aciona o alerta visual da Aura (Padrão 75).")
    
    st.session_state.global_vars['limite_alerta'] = alerta_limite
    
    st.markdown("---")
    st.subheader("Biblioteca de Bem-Estar")
    col_re, col_video, col_musica = st.columns(3)
    with col_re: st.button("🍃 Exercícios de Respiração", use_container_width=True)
    with col_video: st.button("▶️ Vídeos de Alongamento", use_container_width=True)
    with col_musica: st.button("🎶 Músicas Relaxantes", use_container_width=True)