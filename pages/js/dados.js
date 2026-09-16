const dados = [

    {
        id: 1,
        data: "2026-09-01",
        hora: "10:45",
        preco: "R$ 30,00",
        "evento-novo": "Musicais",
        "detalhes": "Uma experiência especial com apresentações musicais, performances e momentos de entretenimento para todos os públicos.",
        imagem: "assents/img/musicais.jpg",
        vaga: 1500
    },

    {
        id: 2,
        data: "2026-09-05",
        hora: "16:00",
        preco: "R$ 45,00",
        "evento-novo": "Festival de Música",
        "detalhes": "Festival reunindo diferentes estilos musicais, com apresentações ao vivo, artistas convidados e muita música durante o evento.",
        imagem: "assents/img/festivaldemusica.jpg",
        vaga: 2200
    },

    {
        id: 3,
        data: "2026-09-12",
        hora: "14:30",
        preco: "R$ 50,00",
        "evento-novo": "Teatro",
        "detalhes": "Uma apresentação teatral com uma história envolvente, interpretação dos atores e uma produção preparada para proporcionar uma experiência cultural marcante.",
        imagem: "assents/img/teatro.jpg",
        vaga: 1350
    },

    {
        id: 4,
        data: "2026-09-17",
        hora: "19:00",
        preco: "R$ 70,00",
        "evento-novo": "Cinema",
        "detalhes": "Sessão especial de cinema com uma experiência completa para os amantes da sétima arte, incluindo exibição de filme em ambiente preparado para o público.",
        imagem: "assents/img/cinema.jpg",
        vaga: 1200
    },

    {
        id: 5,
        data: "2026-09-23",
        hora: "20:00",
        preco: "R$ 90,00",
        "evento-novo": "Stand-up",
        "detalhes": "Uma noite de muito humor com apresentações de comediantes, histórias engraçadas e situações do cotidiano transformadas em momentos de diversão.",
        imagem: "assents/img/standup.jpg",
        vaga: 1400
    },

    {
        id: 6,
        data: "2026-09-27",
        hora: "18:30",
        preco: "R$ 35,00",
        "evento-novo": "Feira Cultural",
        "detalhes": "Feira dedicada à cultura e à diversidade, reunindo artes, música, apresentações e atividades para toda a comunidade.",
        imagem: "assents/img/festivalcultural.jpg",
        vaga: 1600
    },

    {
        id: 7,
        data: "2026-10-03",
        hora: "15:00",
        preco: "R$ 25,00",
        "evento-novo": "Exposição de Arte",
        "detalhes": "Exposição com obras de arte de diferentes estilos e técnicas, proporcionando ao público um momento de apreciação e contato com a produção artística.",
        imagem: "assents/img/exposiçãodearte.jpg",
        vaga: 1200
    },

    {
        id: 8,
        data: "2026-10-08",
        hora: "19:30",
        preco: "R$ 80,00",
        "evento-novo": "Show ao Vivo",
        "detalhes": "Show com apresentação musical ao vivo, repertório especial e uma atmosfera preparada para quem gosta de curtir música e entretenimento.",
        imagem: "assents/img/showaovivo.jpg",
        vaga: "Ilimitada"
    },

    {
        id: 9,
        data: "2026-10-11",
        hora: "14:00",
        preco: "R$ 40,00",
        "evento-novo": "Festival Gastronômico",
        "detalhes": "Uma celebração da gastronomia com diferentes opções de pratos, sabores e experiências culinárias para os visitantes.",
        imagem: "assents/img/festivalgastronomia.gif",
        vaga: 1250
    },

    {
        id: 10,
        data: "2026-10-16",
        hora: "20:00",
        preco: "R$ 60,00",
        "evento-novo": "Dança",
        "detalhes": "Apresentação de dança com coreografias, música e performances que exploram diferentes movimentos e estilos artísticos.",
        imagem: "assents/img/danca.jpg",
        vaga: 1320
    },

    {
        id: 11,
        data: "2026-10-21",
        hora: "19:00",
        preco: "R$ 55,00",
        "evento-novo": "Palestra",
        "detalhes": "Encontro com conteúdo educativo e informativo, proporcionando ao público a oportunidade de aprender, refletir e trocar conhecimentos sobre o tema apresentado.",
        imagem: "assents/img/palestra.jpg",
        vaga: 1700
    },

    {
        id: 12,
        data: "2026-10-25",
        hora: "17:30",
        preco: "R$ 75,00",
        "evento-novo": "Festival de Cinema",
        "detalhes": "Festival dedicado ao cinema, com uma programação especial de filmes e uma oportunidade para o público conhecer diferentes histórias e produções cinematográficas.",
        imagem: "assents/img/festivaldecinema.jpg",
        vaga: 1650
    },

    {
        id: 13,
        data: "2026-11-02",
        hora: "10:00",
        preco: "R$ 20,00",
        "evento-novo": "Feira de Artesanato",
        "detalhes": "Feira com produtos artesanais, trabalhos manuais e peças criativas produzidas por artesãos, oferecendo ao público uma experiência de cultura e criatividade.",
        imagem: "assents/img/feiradeartesanato.jpg",
        vaga: 2200
    },

    {
        id: 14,
        data: "2026-11-07",
        hora: "19:30",
        preco: "R$ 100,00",
        "evento-novo": "Show Nacional",
        "detalhes": "Grande apresentação musical com atrações de destaque nacional, repertório especial e uma noite preparada para os fãs de música ao vivo.",
        imagem: "assents/img/shownacional.jpg",
        vaga: 3000
    },

    {
        id: 15,
        data: "2026-11-12",
        hora: "18:00",
        preco: "R$ 65,00",
        "evento-novo": "Teatro Musical",
        "detalhes": "Espetáculo que combina teatro, música, dança e interpretação em uma apresentação completa e envolvente para o público.",
        imagem: "assents/img/teatromusical.gif",
        vaga: 1300
    },

    {
        id: 16,
        data: "2026-11-15",
        hora: "16:30",
        preco: "R$ 35,00",
        "evento-novo": "Evento Geek",
        "detalhes": "Evento voltado para fãs da cultura geek, com atrações relacionadas a filmes, séries, jogos, quadrinhos, tecnologia e entretenimento.",
        imagem: "assents/img/eventogeek.jpg",
        vaga: 1750
    },

    {
        id: 17,
        data: "2026-11-20",
        hora: "20:00",
        preco: "R$ 85,00",
        "evento-novo": "Comédia",
        "detalhes": "Uma noite dedicada ao humor e à diversão, com apresentações de comédia, histórias divertidas e momentos para aproveitar com os amigos.",
        imagem: "assents/img/comedia.jpg",
        vaga: 1500
    },

    {
        id: 18,
        data: "2026-11-28",
        hora: "15:00",
        preco: "R$ 30,00",
        "evento-novo": "Feira Cultural",
        "detalhes": "Evento aberto ao público com atrações culturais, apresentações, atividades e espaços dedicados à arte, cultura e convivência.",
        imagem: "assents/img/feiracultural.jpg",
        vaga: "Livre ao público."
    }

];
