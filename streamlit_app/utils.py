import streamlit as st
import pandas as pd
import numpy as np

# --- Estilos ---
def load_style():
    """Aplica estilos CSS customizados."""
    st.markdown("""
        <style>
        .stTabs [data-baseweb="tab-list"] {
            gap: 24px;
        }

        .stTabs [data-baseweb="tab"] {
            height: 50px;
            white-space: nowrap;
            background-color: #f0f2f6;
            border-radius: 8px;
            padding: 10px 20px;
            border: 1px solid #e0e0e0;
        }

        .stTabs [aria-selected="true"] {
            background-color: #ffe0b2; /* Cor mais clara para aba ativa */
            color: #ff9800; /* Cor de destaque para aba ativa */
            font-weight: bold;
        }
        
        /* Estilo para a caixa de status de fadiga (score) */
        .score-box {
            padding: 5px 15px;
            border-radius: 8px;
            width: 200px;
            text-align: center;
            color: white;
            font-weight: bold;
        }

        </style>
    """, unsafe_allow_html=True)


# --- Dados Históricos (Mock) ---
@st.cache_data
def load_historical_data():
    """Gera um DataFrame mock para tendências históricas."""
    data = {
        'Dia': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        'Score': np.random.randint(40, 95, 7)
    }
    df = pd.DataFrame(data).set_index('Dia')
    return df


# --- Renderização de Componentes ---
def render_header(score_fadiga_display):
    """Renderiza o título e o score de fadiga."""
    cor_score = "#FFA07A" if score_fadiga_display >= 70 else "#A2E2A6"
    
    st.markdown("<h1 style='color: #4B4B4B;'>HARMONY AI: Assistente de Prevenção de Burnout</h1>", unsafe_allow_html=True)
    st.markdown(f"""
        <div class='score-box' style='background-color: {cor_score};'>
            Score de Fadiga Atual: <b>{score_fadiga_display:.0f}</b>
        </div>
    """, unsafe_allow_html=True)
    st.divider()