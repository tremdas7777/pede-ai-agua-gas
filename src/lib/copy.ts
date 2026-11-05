/** Descrição em blocos (copy de venda + fotos) dos produtos da loja. Kits e Sleepo ficam em bundles.ts. */
import type { RichSection } from "./bundles";

const img = (f: string) => `/produtos/${f}`;

export const PRODUCT_COPY: Readonly<Record<string, readonly RichSection[]>> = {
  pijama: [
    {
      title: "Pijama de dragão 🌟 Sucesso entre os fãs",
      text: "A calça de pijama que dá vontade de cancelar os planos e ficar em casa. Tecido felpudo e macio, caimento soltinho e uma estampa de dragão tão fofa que rende foto no espelho antes mesmo de deitar.",
      media: img("pijama-gif-1.webp"),
    },
    {
      title: "Qualidade que continua macia lavagem após lavagem 🧵",
      text: "Nada de pijama que embola, desbota ou fica áspero depois de duas lavagens. Esta calça foi feita para durar e te deixar quentinho por muitos invernos.",
      points: [
        "Algodão felpudo, macio por dentro",
        "Cós com elástico e cordão para ajustar na cintura",
        "Modelagem relaxada que não aperta para dormir",
        "Dois modelos: Dragão Branco e Dragão Preto",
      ],
      media: img("pijama-gif-2.webp"),
    },
    {
      title: "Conforto para a família toda 👨‍👩‍👧‍👦",
      text: "Para relaxar sozinho, ficar agarradinho com o seu amor ou combinar com as crianças: tem do infantil 2 anos ao plus size G3. Escolha um modelo para cada um e transforme a noite de filme em noite de dragões.",
      media: img("p1_casal.jpg"),
    },
  ],
  snuggy: [
    {
      title: "Snuggy Dragão 🌟 Sucesso entre os fãs",
      text: "O macacão de dragão que conquistou quem ama Como Treinar o Seu Dragão. Você veste em segundos e vira um dragão fofo e quentinho, pronto para o sofá, a maratona de séries ou a festa do pijama.",
      media: img("snuggy-gif-1.webp"),
    },
    {
      title: "Cobertor e moletom ao mesmo tempo 🧵",
      text: "Diferente do cobertor, que escorrega e deixa os pés de fora, o Snuggy fica no lugar e te abraça do pescoço aos joelhos, com as mãos livres para o celular, o livro ou o controle.",
      points: [
        "Flanela ultramacia que continua macia por muito tempo",
        "Capuz amplo de dragão",
        "Mangas largas e bolso canguru",
        "Tamanhos adultos P, Padrão, G e GG",
      ],
      media: img("snuggy-gif-2.webp"),
    },
    {
      title: "Conforto para todos 👨‍👩‍👧‍👦",
      text: "Seja para relaxar sozinho, ficar agarradinho com o seu amor ou curtir com a família, o Snuggy deixa todo mundo quentinho e feliz. Tem versão infantil de 4 a 14 anos, para os pequenos virarem dragão junto.",
      media: img("snuggy-gif-3.webp"),
    },
  ],
  pantufa: [
    {
      title: "Chega de pé gelado no piso frio",
      text: "Sabe aquele choque de levantar da cama e pisar no chão gelado? As pantufas de dragão resolvem isso com forro de pelúcia que segura o calor e deixa o pé quentinho do quarto até a cozinha.",
      media: img("p3b.jpg"),
    },
    {
      title: "Fofas por fora, seguras por baixo",
      text: "Os olhinhos bordados deixam qualquer um com vontade de sorrir, e o solado antiderrapante deixa você andar tranquilo no piso do banheiro ou da cozinha.",
      points: [
        "Forro em pelúcia macia",
        "Solado antiderrapante",
        "Olhinhos bordados que não descolam",
        "Branco e preto, para escolher o seu dragão",
      ],
      media: img("p3c.jpg"),
    },
    {
      title: "Do 28 ao 45: a família toda de dragão",
      text: "Tem numeração infantil e adulta, então dá para montar a turma inteira: um par branco, um preto, um para cada um. Ficou entre dois números? Escolha o maior, e se não servir você troca em até 30 dias.",
      media: img("p3_pantufas.jpg"),
    },
  ],
  chinelo: [
    {
      title: "Como andar nas nuvens, só que de dragão",
      text: "O solado nuvem é alto e fofinho e amortece cada passo, e na tira tem um dragãozinho de pelúcia com olhos verdes que parece estar abraçando o seu pé. É o chinelo que você não vai querer tirar.",
      media: img("chinelo-2.jpg"),
    },
    {
      title: "Conforto que aguenta o dia todo",
      text: "Do home office à maratona de séries, da varanda à padaria: ele é leve, macio e firme no chão.",
      points: [
        "Solado nuvem alto e macio",
        "Sola de PVC com borracha antiderrapante",
        "Tira com forro em poliéster macio",
        "Leve: cerca de 300 g",
      ],
      media: img("chinelo-3.jpg"),
    },
    {
      title: "Adulto e infantil, para combinar",
      text: "Tem do 26 ao 41. Pais e filhos de chinelo de dragão pela casa é foto garantida. Ficou entre dois números? Escolha o maior.",
      media: img("chinelo-1.jpg"),
    },
  ],
  luminaria: [
    {
      title: "O quarto ganha um guardião",
      text: "Quando a luz principal apaga, os olhos grandes do dragão acendem e deixam o ambiente com uma luz suave e aconchegante. Perfeita para quem tem medo do escuro, para ler antes de dormir ou para deixar a estante com cara de fã de verdade.",
      media: img("luminaria.jpg"),
    },
    {
      title: "Produto licenciado, feito no Brasil",
      text: "Nada de réplica frágil: é uma peça oficial, feita em polietileno resistente, com 29 cm de altura para ser notada.",
      points: [
        "Bivolt (110/220V), funciona em qualquer tomada",
        "Cabo de 1,8 m com interruptor de mão",
        "Usa lâmpada LED de até 15 W (não inclusa)",
        "29 x 20 x 17 cm, cabe na mesa de cabeceira",
      ],
    },
    {
      title: "Presente que fica para sempre",
      text: "Para o quarto das crianças, para a sala de jogos ou para o adulto que cresceu com os filmes. É um presente que sai da caixa direto para o lugar de destaque da casa.",
    },
  ],
  lum3d: [
    {
      title: "Um dragão que flutua no ar",
      text: "Apagou a luz, acendeu a mágica: o desenho gravado no acrílico ganha um efeito 3D e o dragãozinho parece flutuar sobre a base. É impossível passar pelo quarto e não olhar.",
      media: img("luminaria-3d-b.jpg"),
    },
    {
      title: "7 cores com um toque",
      text: "Roxo para jogar, azul para relaxar, amarelo para ler: toque na base para ligar, desligar e trocar de cor.",
      points: [
        "7 cores trocadas pelo toque na base",
        "Funciona no USB ou com pilhas, sem depender de tomada",
        "Luz de LED que não esquenta",
        "Base preta ou branca",
      ],
      media: img("luminaria-3d-d.jpg"),
    },
    {
      title: "A luz de dormir favorita das crianças",
      text: "Quem tem medo do escuro ganha um dragão que vigia o quarto a noite toda. E para o quarto gamer, é a decoração que faltava.",
      media: img("luminaria-3d-c.jpg"),
    },
  ],
  mascara: [
    {
      title: "Durma como um dragão",
      text: "Claridade da janela, luz da TV, celular do lado: tudo isso atrapalha o seu sono. A máscara bloqueia a luz e ajuda você a pegar no sono mais rápido, em casa, na viagem ou naquele cochilo da tarde.",
      media: img("mascara-olhos-verdes.jpg"),
    },
    {
      title: "7 estampas, uma para cada humor",
      text: "Olhos de dragão realistas que encaram quem estiver por perto, versões fofas em desenho e até o casal de dragões apaixonados.",
      points: [
        "Bloqueia a luz para dormir melhor",
        "Leve e confortável",
        "Elástico que se ajusta à cabeça sem apertar",
        "Para adultos e crianças",
      ],
      media: img("mascara-todas.jpg"),
    },
    {
      title: "Presente em dupla",
      text: "A estampa do casal apaixonado é perfeita para dar ao seu amor, e por esse preço dá para levar uma para cada um. Combina com os pijamas e o Sleepo Dragão da loja.",
      media: img("mascara-apaixonados.jpg"),
    },
  ],
  kitescola: [
    {
      title: "O primeiro dia de aula mais esperado",
      text: "Mochila, estojo e lancheira térmica com a mesma estampa de dragão. A criança chega na escola com o kit completo e todo mundo quer saber onde você comprou.",
      media: img("kit-escolar.jpg"),
    },
    {
      title: "Tudo o que a rotina escolar precisa",
      text: "Três peças pensadas para o dia a dia, que chegam juntas e combinando, sem precisar caçar mochila, estojo e lancheira em lojas diferentes.",
      points: [
        "Mochila com alças acolchoadas, alça de mão e bolso lateral de tela",
        "Estojo com zíper para lápis, canetas e borracha",
        "Lancheira térmica com alça de ombro removível e alça de mão",
        "Estampa de dragão com olhos verdes nas três peças",
      ],
    },
    {
      title: "Presente que é usado todo dia",
      text: "Para aniversário, Dia das Crianças ou volta às aulas: um presente útil, que a criança ama mostrar para os amigos.",
    },
  ],
  carro: [
    {
      title: "Seu copiloto favorito",
      text: "Trânsito parado fica bem melhor com um dragãozinho olhando para você do painel. Ele chama atenção no carro, na moto e em qualquer foto de viagem.",
      media: img("p4b.jpg"),
    },
    {
      title: "Você escolhe como ele fica",
      text: "Três tipos de fixação, para colocar onde quiser e tirar quando precisar.",
      points: [
        "Adesivo 3M para o painel",
        "Ventosa para o vidro",
        "Engate rápido para tirar e colocar",
        "Pelúcia resistente, fácil de limpar com pano úmido",
      ],
      media: img("p4_carro.jpg"),
    },
    {
      title: "Preto ou branco? Leve os dois",
      text: "Um para o seu carro e outro para presentear quem divide a estrada com você. Os dois juntos formam o casal de dragões.",
      media: img("p4c.jpg"),
    },
  ],
  aneis: [
    {
      title: "Uma promessa que fica no dedo",
      text: "Um dragão escuro e um prateado, que formam par quando as mãos se encontram. É o jeito mais bonito de dizer que vocês são um time, todos os dias.",
      media: img("p5b.jpg"),
    },
    {
      title: "Prata 925 que serve em qualquer dedo",
      text: "Nada de adivinhar a medida do anel: o ajuste é livre, então dá para fazer surpresa sem medo de errar.",
      points: [
        "Par de anéis em prata 925",
        "Ajuste livre, serve em qualquer dedo",
        "Detalhes de escamas e asas",
        "Chega em estojo de presente, pronto para entregar",
      ],
      media: img("p5c.jpg"),
    },
    {
      title: "Presente para namoro, noivado ou aniversário",
      text: "Para o Dia dos Namorados, para o aniversário de namoro ou só porque sim. Um presente que tem significado e que vocês vão usar juntos.",
      media: img("p5_aneis.jpg"),
    },
  ],
  colares: [
    {
      title: "Dois dragões, um só coração",
      text: "Cada um fica com um pingente, e quando vocês se encontram as asas dos dragões se encaixam e formam um coração. Um lembrete de que a outra metade está sempre com você.",
      media: img("p6b.jpg"),
    },
    {
      title: "Bonito no pescoço, seguro na pele",
      text: "Um colar para usar no dia a dia, com ou sem a outra metade por perto.",
      points: [
        "Par de colares com pingentes que se encaixam",
        "Corrente banhada e antialérgica",
        "Um para cada pessoa do casal",
        "Caixa de presente inclusa",
      ],
      media: img("p6_colares.jpg"),
    },
    {
      title: "O presente perfeito para casais",
      text: "Namorados, melhores amigos ou casal à distância: é um presente simples de entregar e difícil de esquecer.",
      media: img("p6c.jpg"),
    },
  ],
};
