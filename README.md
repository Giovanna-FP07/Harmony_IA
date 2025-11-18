# 🌐 HARMONY AI – Inteligência e Empatia no Futuro do Trabalho

O **Harmony AI** é um projeto ambicioso que visa redefinir o futuro do trabalho, combatendo o estresse digital e a exclusão tecnológica. Ele une inteligência artificial, acessibilidade, bem-estar e aprendizado contínuo em uma plataforma que **compreende, cuida e guia o trabalhador**.

Este repositório contém o **Protótipo Funcional** do Harmony AI, focado na detecção precoce de fadiga (**Módulo MindAI**) e na interface de suporte conversacional com o chatbot **Aura**.

---

## 1. Visão Geral do Protótipo

Nosso protótipo implementa dois pilares centrais do sistema Harmony AI:

* **Módulo MindAI (Visão Computacional):** Analisa expressões faciais e postura em tempo real para identificar sinais de estresse e fadiga (prevenção de burnout).
* **Interface do Chatbot Aura:** Fornece suporte emocional, recomendações automáticas de pausas guiadas e interage com o usuário com base na pontuação de fadiga.

---

## 2. Módulo MindAI: Detecção de Fadiga e Sono

Este módulo é o coração da detecção de bem-estar e baseia-se no pilar de **Psicologia do Trabalho e Saúde Mental** do projeto.

| Aspecto | Tecnologias Utilizadas | Função no Protótipo |
| :--- | :--- | :--- |
| **Análise de Posição** | **MediaPipe (Google)** | Biblioteca essencial para a análise de vídeo em tempo real, permitindo a detecção precisa de **pontos faciais e de pose**. |
| **Lógica de Fadiga** | **MediaPipe, Genkit** | Utilizado para processar os dados da pose e pontos faciais para calcular a **Pontuação de Fadiga** (ex: contagem de bocejos, inclinação da cabeça). |
| **Integração com IA** | **Genkit (Google)** | Orquestra a comunicação entre a pontuação de fadiga e a resposta do Chatbot Aura, facilitando a lógica de intervenção do sistema. |

---

## 3. Interface Base para o Chatbot Aura (Frontend & Backend)

A interface do usuário é a ponte entre a inteligência artificial (MindAI) e o trabalhador. Ela é construída com um *stack* moderno, focado em performance e experiência do desenvolvedor.

### Stack de Desenvolvimento

| Tecnologia | Função Essencial | Pilar do Projeto |
| :--- | :--- | :--- |
| **TypeScript** | Linguagem principal para segurança e organização do código (tipos estáticos). | Segurança e Ética Digital |
| **Next.js** | Framework React para construção da interface de usuário, roteamento e otimização. | Design Universal |
| **React** | Biblioteca fundamental para a criação de componentes de UI. | - |
| **Tailwind CSS** | Estilização rápida, consistente e utilitária (Utility-first CSS). | - |
| **ShadCN UI** | Base de componentes (botões, cards) para um design limpo e acessível. | Acessibilidade e Design Universal |
| **Genkit (Google)** | Gerencia a IA conversacional da **Aura** e a lógica de intervenção. | Inteligência Artificial e ML |

---

## 4. Considerações sobre o Protótipo e Próximos Passos

Esta seção detalha o escopo atual do protótipo, focando na funcionalidade e no *design*.

### Testes de Interface (Streamlit)

Inicialmente, a interface foi desenvolvida e testada utilizando a biblioteca **Streamlit**. Embora o Streamlit tenha sido rápido para prototipagem inicial e validação da lógica do **MindAI** (visão computacional), optamos por migrar para **Next.js/React** para criar uma experiência de usuário mais rica, escalável e com *design* profissional.

### Uso do Firebase e Escopo Atual

É importante notar que o projeto atual concentra **100% da sua funcionalidade** no código de **Visão Computacional** e na lógica do **Genkit/Aura**.

O uso do **Firebase** neste momento é estritamente para o "enfeite" e estrutura da interface (autenticação de *mockup*, *design* de tela, etc.). Ele não está sendo utilizado para armazenamento de dados, segurança ou funções de *backend* complexas de produção. O foco é a **demonstração do *core* do MindAI e da interação com a Aura.**

---
## 5. Alinhamento com os Objetivos do Projeto

Este protótipo atende diretamente a diversos **objetivos específicos** do Harmony AI:

* ✅ **Identificar sinais precoces de burnout e estresse** por meio do reconhecimento facial e de pose (Módulo MindAI).
* ✅ **Fornecer suporte emocional e psicológico digital** com as recomendações automáticas e pausas guiadas da Aura.
* ✅ **Garantir acessibilidade universal** através da interface web responsiva e *mobile-first*.

---

## 6. Como Rodar o Protótipo

Siga os passos abaixo para executar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    ```

2.  **Instale as dependências:**
    ```bash
    cd [NOME_DO_DIRETORIO]
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    * Crie um arquivo `.env.local`.
    * Adicione as chaves de API necessárias para o **Firebase** e o **Genkit** (Google AI).

4.  **Inicie a aplicação:**
    ```bash
    npm run dev
    ```

> O aplicativo estará disponível em **https://prototipo-interface-harmony-ia-e-au.vercel.app/**.
