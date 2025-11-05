# ConectaTEA - Comunidade Interativa e Inclusiva para Autistas

<div align="center">
  
  ![ConectaTEA](https://img.shields.io/badge/ConectaTEA-Comunidade%20TEA-blue?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript)
  ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
  
  **"Um espaço feito para compreender, aprender e crescer juntos"**
  
</div>

---

## Informações do Projeto

### Instituição
**ETEC Professor Edson Galvão – Itapetininga/SP**

### 👥 Equipe

- Isabelly Vitória – Líder do grupo; organização e repositórios

- Ana Carolina Teles – Documentação

- Heloísa Targa – Criação e desenvolvimento do site

- Letícia Vieira – Criação e desenvolvimento do site

### Competição
**TIC em Trilhas** - Startup Frontend Creator

---

## Sobre o Projeto

**ConectaTEA** é uma plataforma web inclusiva e acessível desenvolvida especialmente para pessoas autistas. A aplicação oferece um ambiente seguro e acolhedor que promove interação social, desenvolvimento cognitivo e acesso à informação sobre o espectro autista.

### Problema Identificado
Pessoas autistas frequentemente enfrentam dificuldades para:
- Encontrar comunidades online verdadeiramente inclusivas e seguras
- Acessar recursos terapêuticos de forma lúdica e engajante
- Obter informações confiáveis sobre autismo em português
- Conectar-se com outras pessoas que compartilham experiências similares

### Solução Proposta
Uma plataforma completa que integra:
- **Comunidade Acolhedora**: Fórum moderado para troca de experiências
- **Jogos Terapêuticos**: 4 jogos cognitivos para desenvolvimento de habilidades
- **Conteúdo Educativo**: Artigos atualizados sobre autismo
- **Gamificação**: Sistema de níveis, XP e conquistas para motivação
- **Interface Acessível**: Design pensado para baixo estímulo sensorial

---

## Funcionalidades

### Autenticação
- Sistema de login e cadastro
- Gerenciamento de perfil
- Recuperação de senha
- Proteção de rotas

### Comunidade
- Criação e visualização de posts
- Sistema de curtidas e comentários
- "Dúvida da Semana" em destaque
- Feed de atividades recentes

### Jogos Terapêuticos
- Jogo da Cobra (reflexos e coordenação)
- Jogo das Emoções (interpretação emocional)
- Jogo da Sequência - Simon (memória)
- Jogo da Memória (associação e foco)
- Sistema de pontuação e XP

### Artigos
- Curadoria de conteúdo sobre autismo
- Sistema de busca e filtros por categoria
- Integração com APIs de notícias
- Artigos em português

### Gamificação
- Sistema de níveis e XP
- Conquistas e badges
- Ranking de atividades
- Progresso visual

### Acessibilidade
- Design com cores pastéis suaves
- Modo claro e escuro
- Animações delicadas
- Layout 100% responsivo
- Alto contraste e legibilidade

---

## Tecnologias Utilizadas

### Core
- **React** 18.3.1 - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server

### Estilização
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### Gerenciamento de Estado
- **Context API** - Estado global (Auth e Theme)
- **React Hooks** - useState, useEffect, useContext

### Roteamento
- **React Router** 6.x - Navegação SPA

### Qualidade
- **ESLint** - Linting de código
- **TypeScript** - Type checking

---

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** versão 18.x ou superior
- **npm** versão 9.x ou superior

Para verificar se você possui o Node.js instalado:
```bash
node --version
npm --version
```

Se não tiver instalado, baixe em: [nodejs.org](https://nodejs.org/)

### Instalação

1. **Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd conectatea
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:8080
```

### Scripts Disponíveis

```bash
npm run dev        # Inicia o servidor de desenvolvimento
npm run build      # Cria build de produção
npm run preview    # Preview do build de produção
npm run lint       # Executa o linter
```

---

## 🌐 Deploy

**URL do Projeto em Produção:** [Inserir URL após deploy]

O projeto pode ser hospedado em plataformas como:
- Vercel
- Netlify
- GitHub Pages
- Render

---

## Estrutura do Projeto

```
conectatea/
├── src/
│   ├── assets/              # Imagens e recursos estáticos
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes Shadcn
│   │   └── Header.tsx      # Cabeçalho da aplicação
│   ├── contexts/           # Context API (Auth, Theme)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Landing page
│   │   ├── Auth.tsx        # Login/Cadastro
│   │   ├── Dashboard.tsx   # Dashboard do usuário
│   │   ├── Community.tsx   # Comunidade/Fórum
│   │   ├── Games.tsx       # Jogos terapêuticos
│   │   ├── Articles.tsx    # Artigos
│   │   └── Profile.tsx     # Perfil do usuário
│   ├── lib/                # Utilitários
│   ├── App.tsx             # Componente raiz
│   ├── index.css           # Estilos globais e design system
│   └── main.tsx            # Entry point
├── public/                 # Arquivos públicos
├── index.html             # HTML principal
├── tailwind.config.ts     # Configuração Tailwind
├── vite.config.ts         # Configuração Vite
└── package.json           # Dependências do projeto
```

---

## Design System

### Paleta de Cores
- **Primária**: Azul suave (#60A5FA) - Serenidade
- **Secundária**: Verde menta (#6CD6BC) - Tranquilidade
- **Accent**: Lilás claro (#B794F4) - Criatividade
- **Warning**: Amarelo suave (#FCD34D) - Atenção

### Princípios de Design
-  Cores pastéis para baixo estímulo sensorial
-  Animações suaves e delicadas
-  Espaçamento generoso
-  Tipografia clara e legível
-  Alto contraste para acessibilidade

---

## Conformidade com LGPD

O projeto está em conformidade com a Lei Geral de Proteção de Dados (LGPD):
- Dados pessoais armazenados de forma segura
- Opção de exclusão de conta
- Transparência no uso de dados
- Pseudonimização em áreas públicas

---

## Requisitos Atendidos

### Técnicos
- React 17+ (18.3.1)
- JavaScript ES6+ / TypeScript
- Componentes Funcionais
- Modularização e componentização
- React Router para roteamento
- Context API para estado global
- Integração com API externa (artigos)
- Responsividade mobile-first
- Boas práticas de código

### Funcionais
- Autenticação completa
- CRUD de posts na comunidade
- Sistema de gamificação
- Jogos interativos
- Consumo de API de notícias
- Perfil de usuário editável

---

## 🌟 Diferenciais

- 💙 **Foco em Inclusão**: Design pensado especificamente para pessoas autistas
- 🎮 **Gamificação Terapêutica**: Jogos com propósito educacional
- 🤝 **Comunidade Segura**: Moderação e ambiente acolhedor
- 🎨 **Design Acessível**: Cores suaves e animações delicadas
- 📱 **100% Responsivo**: Funciona perfeitamente em todos os dispositivos

---

## Referências

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Documentação sobre Autismo](https://www.autismo.org.br/)
- [WCAG 2.1 - Acessibilidade](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Licença

Este projeto foi desenvolvido para fins educacionais como parte da competição TIC em Trilhas.

---

## Agradecimentos

Agradecemos à organização do **TIC em Trilhas**, à **Venturus**, à **Softex** e ao **MCTI** pela oportunidade de desenvolver este projeto que visa promover inclusão e acessibilidade para pessoas autistas.

---

<div align="center">
  
  **ConectaTEA** - Um espaço feito para compreender, aprender e crescer juntos 🧩💙
  
  Feito com 💜 por ConectaTEA Team
  
</div>
