export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  content?: string;
}

const ARTICLE_POOL = [
  {
    title: "Avanços no diagnóstico precoce do TEA",
    description: "Novas tecnologias e métodos estão tornando possível identificar sinais de autismo em crianças cada vez mais cedo, permitindo intervenções mais eficazes.",
    url: "https://www.autismspeaks.org/early-signs-autism",
    source: "Autism Speaks",
    category: "Diagnóstico",
    content: "O diagnóstico precoce do Transtorno do Espectro Autista (TEA) é fundamental para garantir intervenções eficazes. Pesquisas recentes mostram que é possível identificar sinais de autismo em bebês de apenas 12 meses. Entre os sinais precoces estão: falta de contato visual, ausência de resposta ao nome, atraso na fala e comportamentos repetitivos. A detecção precoce permite que famílias iniciem terapias comportamentais e educacionais que podem fazer diferença significativa no desenvolvimento da criança. Profissionais recomendam acompanhamento regular e uso de ferramentas de triagem validadas."
  },
  {
    title: "Terapias baseadas em jogos para autistas",
    description: "Estudos mostram que jogos terapêuticos podem auxiliar significativamente no desenvolvimento de habilidades sociais e cognitivas.",
    url: "https://www.autismspeaks.org/gaming-autism",
    source: "Autism Speaks",
    category: "Terapias",
    content: "Jogos terapêuticos têm se mostrado ferramentas valiosas no tratamento do autismo. Através de jogos digitais e atividades lúdicas estruturadas, terapeutas conseguem trabalhar habilidades sociais, comunicação, coordenação motora e regulação emocional. Jogos que envolvem turnos, por exemplo, ajudam a desenvolver paciência e compreensão de regras sociais. Realidade virtual também tem sido explorada para simular situações sociais em ambientes controlados, permitindo que pessoas autistas pratiquem interações sem a pressão do mundo real."
  },
  {
    title: "Inclusão escolar de alunos com autismo",
    description: "Estratégias pedagógicas e adaptações curriculares que promovem a inclusão efetiva de estudantes autistas.",
    url: "https://diversa.org.br/autismo",
    source: "Instituto Diversa",
    category: "Inclusão",
    content: "A inclusão escolar de alunos com TEA requer planejamento, formação de professores e adaptações no ambiente escolar. Estratégias eficazes incluem: rotinas visuais claras, espaços de descompressão sensorial, comunicação alternativa e aumentativa, e apoio individualizado quando necessário. Professores devem receber capacitação para compreender as necessidades específicas e adaptar metodologias de ensino. A parceria entre escola e família é essencial para o sucesso do processo de inclusão."
  },
  {
    title: "Direitos das pessoas autistas no Brasil",
    description: "Conheça os principais direitos garantidos por lei às pessoas com Transtorno do Espectro Autista.",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm",
    source: "Lei Berenice Piana",
    category: "Direitos",
    content: "A Lei 12.764/2012, conhecida como Lei Berenice Piana, estabelece a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista. Entre os direitos garantidos estão: acesso à educação e ensino profissionalizante, proteção social, atendimento multiprofissional, medicamentos, informação adequada aos pais ou responsáveis. A lei também prevê punições para discriminação e garante que pessoas com autismo têm os mesmos direitos que pessoas com deficiência, incluindo prioridade em filas e vagas reservadas."
  },
  {
    title: "Alimentação e sensibilidade sensorial no autismo",
    description: "Como a seletividade alimentar afeta pessoas autistas e estratégias para ampliar o repertório alimentar.",
    url: "https://www.autism.org.uk/advice-and-guidance/topics/physical-health/food",
    source: "National Autistic Society",
    category: "Qualidade de Vida",
    content: "Muitas pessoas autistas apresentam seletividade alimentar relacionada a questões sensoriais: texturas, cheiros, cores e temperaturas dos alimentos podem causar desconforto. Isso pode levar a restrições alimentares significativas. Estratégias para ampliar o repertório incluem: exposição gradual a novos alimentos sem pressão, respeito às preferências sensoriais, ambiente tranquilo durante refeições, e trabalho conjunto com nutricionistas e terapeutas ocupacionais. É importante garantir nutrição adequada através de suplementação quando necessário."
  },
  {
    title: "Autismo em meninas: diagnóstico e particularidades",
    description: "Por que o autismo em meninas costuma ser diagnosticado mais tarde e suas características específicas.",
    url: "https://www.spectrumnews.org/features/deep-dive/costs-camouflaging-autism/",
    source: "Spectrum News",
    category: "Diagnóstico",
    content: "Meninas autistas frequentemente recebem diagnóstico tardio devido a diferenças na apresentação dos sintomas. Elas tendem a desenvolver habilidades de 'mascaramento' social mais cedo, imitando comportamentos de colegas para se encaixar. Seus interesses podem parecer mais típicos, embora a intensidade seja característica. A camuflagem constante leva a esgotamento mental e maior risco de ansiedade e depressão. Profissionais estão sendo treinados para reconhecer essas apresentações atípicas e evitar subdiagnóstico em meninas e mulheres."
  },
  {
    title: "Tecnologias assistivas para autismo",
    description: "Aplicativos, dispositivos e ferramentas tecnológicas que auxiliam no desenvolvimento e comunicação.",
    url: "https://www.assistiveware.com/learn/autism-assistive-technology",
    source: "AssistiveWare",
    category: "Terapias",
    content: "Tecnologias assistivas revolucionaram o suporte a pessoas autistas. Aplicativos de comunicação alternativa permitem que não-verbais se expressem através de símbolos e voz sintetizada. Ferramentas de organização visual ajudam a criar rotinas e cronogramas compreensíveis. Dispositivos de regulação sensorial, como fones com cancelamento de ruído e cobertores com peso, proporcionam conforto. Plataformas de aprendizado adaptativo personalizam o ensino conforme o ritmo individual. A tecnologia deve ser vista como ferramenta complementar, não substituta de interação humana."
  },
  {
    title: "Emprego e autismo: inclusão no mercado de trabalho",
    description: "Desafios e oportunidades para pessoas autistas no ambiente profissional.",
    url: "https://www.autism.org.uk/advice-and-guidance/topics/employment",
    source: "National Autistic Society",
    category: "Inclusão",
    content: "A inclusão de pessoas autistas no mercado de trabalho enfrenta desafios mas também apresenta oportunidades. Muitos autistas possuem habilidades valiosas como atenção a detalhes, pensamento sistemático e hiperfoco. Adaptações razoáveis no ambiente de trabalho incluem: instruções claras por escrito, rotinas previsíveis, espaços de trabalho com menor estímulo sensorial, e comunicação direta. Programas de diversidade e inclusão estão reconhecendo o valor da neurodiversidade. O emprego apoiado e programas de capacitação facilitam a transição para o mercado."
  },
];

export const fetchAutismNews = async (page: number = 1): Promise<NewsArticle[]> => {
  try {
    const articlesPerPage = 3;
    const startIndex = (page - 1) * articlesPerPage;
    
    // Se for a primeira página, incluir artigo da Wikipedia
    if (page === 1) {
      const response = await fetch(
        `https://pt.wikipedia.org/api/rest_v1/page/mobile-sections/Transtorno_do_espectro_autista`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        // Extrair texto completo das seções (mais seções para conteúdo mais rico)
        let fullContent = "";
        if (data.sections) {
          fullContent = data.sections
            .slice(0, 10) // Pegar primeiras 10 seções para mais conteúdo
            .map((section: any) => {
              const text = section.text || "";
              // Remover tags HTML e formatar melhor
              return text
                .replace(/<[^>]*>/g, " ")
                .replace(/\s+/g, " ")
                .replace(/\[\d+\]/g, "") // Remover referências [1], [2], etc
                .trim();
            })
            .filter(text => text.length > 50) // Filtrar seções muito curtas
            .join("\n\n");
        }
        
        const wikiArticle: NewsArticle = {
          title: "Entendendo o Transtorno do Espectro Autista",
          description: "Informações completas e atualizadas sobre o Transtorno do Espectro Autista, incluindo características, diagnóstico e tratamento.",
          url: "https://pt.wikipedia.org/wiki/Transtorno_do_espectro_autista",
          source: "Wikipedia",
          publishedAt: new Date().toISOString(),
          category: "Informação Geral",
          content: fullContent || "Conteúdo completo sobre o Transtorno do Espectro Autista disponível no link.",
        };

        // Pegar 3 artigos do pool para a primeira página
        const pageArticles = ARTICLE_POOL.slice(0, articlesPerPage).map((article, index) => ({
          ...article,
          publishedAt: new Date(Date.now() - (index * 3600000)).toISOString(),
        }));

        return [wikiArticle, ...pageArticles];
      }
    }
    
    // Para páginas subsequentes, pegar artigos diferentes do pool
    const pageArticles = ARTICLE_POOL.slice(startIndex, startIndex + articlesPerPage).map((article, index) => ({
      ...article,
      publishedAt: new Date(Date.now() - (page * 86400000) - (index * 3600000)).toISOString(),
    }));

    // Se não houver mais artigos no pool, criar variações
    if (pageArticles.length === 0) {
      const recycledIndex = (page - 1) % ARTICLE_POOL.length;
      return ARTICLE_POOL.slice(recycledIndex, recycledIndex + articlesPerPage).map((article, index) => ({
        ...article,
        title: `${article.title} - Atualização ${page}`,
        publishedAt: new Date(Date.now() - (page * 86400000) - (index * 3600000)).toISOString(),
      }));
    }

    return pageArticles;
  } catch (error) {
    console.error("Error fetching autism news:", error);
    // Retornar artigos do pool com base na página
    const articlesPerPage = 3;
    const startIndex = ((page - 1) * articlesPerPage) % ARTICLE_POOL.length;
    return ARTICLE_POOL.slice(startIndex, startIndex + articlesPerPage).map((article, index) => ({
      ...article,
      publishedAt: new Date(Date.now() - (page * 86400000) - (index * 3600000)).toISOString(),
    }));
  }
};

export const translateText = async (text: string, targetLang: string = "pt"): Promise<string> => {
  try {
    // Usando MyMemory Translation API (gratuita sem necessidade de chave)
    const encodedText = encodeURIComponent(text.substring(0, 500)); // Limitar tamanho
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`
    );

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Retorna texto original se falhar
  }
};
