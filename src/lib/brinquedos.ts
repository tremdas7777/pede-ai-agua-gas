/** Brinquedos de Como Treinar o Seu Dragão (coleção "Brinquedos"), montados a partir do catálogo do fornecedor. */
import type { Bundle } from "./bundles";

export const BRINQUEDO_IDS = [
  "bq01",
  "bq02",
  "bq03",
  "bq04",
  "bq05",
  "bq06",
  "bq07",
  "bq08",
  "bq09",
  "bq10",
  "bq11",
  "bq12",
  "bq13",
  "bq14",
  "bq15",
  "bq16",
  "bq18",
  "bq19",
  "bq20",
  "bq21",
  "bq22",
  "bq24",
  "bq25",
] as const;

type Toy = {
  id: (typeof BRINQUEDO_IDS)[number];
  name: string;
  tag: string;
  price: number;
  compareAtPrice: number;
  imgs: string[];
  description: string[];
  specs: [string, string][];
};

const img = (f: string) => `/produtos/${f}`;

const TOYS: Toy[] = [
  {
    id: "bq01",
    name: "Dragão Banguela com Sons de Plasma 33 cm",
    tag: "Battle Dragons, com sons e cauda removível",
    price: 70.9,
    compareAtPrice: 236.33,
    imgs: [
      "bq01-1.jpg",
      "bq01-2.jpg",
      "bq01-3.jpg",
      "bq01-4.jpg",
      "bq01-5.jpg",
      "bq01-6.jpg",
      "bq01-7.jpg",
      "bq01-8.jpg",
    ],
    description: [
      "O Banguela da linha Battle Dragons, da Spin Master, com cerca de 33 cm de comprimento. Ele emite os sons do disparo de plasma, relembrando as cenas mais épicas do filme.",
      "A cauda é removível e os detalhes das escamas e das asas são fiéis ao personagem. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Fabricante", "Spin Master (distribuição Sunny)"],
      ["Tamanho", "Cerca de 33 cm de comprimento"],
      ["Recursos", "Sons de plasma e cauda removível"],
    ],
  },
  {
    id: "bq02",
    name: "Banguela Som e Movimento",
    tag: "Asas e pernas móveis, sons de plasma, voo e rugido",
    price: 56.9,
    compareAtPrice: 189.67,
    imgs: ["bq02-1.jpg", "bq02-2.jpg", "bq02-3.jpg", "bq02-4.jpg"],
    description: [
      "Figura articulada do Banguela da linha Battle Dragons, com asas e pernas que se movem para recriar as cenas favoritas ou inventar novas aventuras.",
      "Segure o botão nas costas para soltar os sons de plasma. Levante a perna traseira para ouvir os sons de voo e volte para a posição para ouvir o rugido. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Recursos", "Sons de plasma, voo e rugido"],
      ["Articulação", "Asas e pernas móveis"],
      ["Idade", "A partir de 5 anos"],
    ],
  },
  {
    id: "bq03",
    name: "Figura Banguela Deluxe",
    tag: "Figura grande, articulada e cheia de detalhes",
    price: 157.9,
    compareAtPrice: 526.33,
    imgs: [
      "bq03-1.jpg",
      "bq03-2.jpg",
      "bq03-3.jpg",
      "bq03-4.jpg",
      "bq03-5.jpg",
      "bq03-6.jpg",
      "bq03-7.jpg",
      "bq03-8.jpg",
    ],
    description: [
      "A figura deluxe do Banguela, rica em detalhes, com pontos de articulação que deixam a brincadeira mais realista. Ótima para brincar e para colecionar.",
      "Estimula a criatividade e a imaginação das crianças, que podem recriar as aventuras de Berk. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Linha", "Deluxe"],
      ["Articulação", "Vários pontos articulados"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq04",
    name: "Dragão Banguela Articulado 20 cm",
    tag: "Asas que se movem e cauda removível",
    price: 32.9,
    compareAtPrice: 109.67,
    imgs: [
      "bq04-1.jpg",
      "bq04-2.jpg",
      "bq04-3.jpg",
      "bq04-4.jpg",
      "bq04-5.jpg",
      "bq04-6.jpg",
      "bq04-7.jpg",
    ],
    description: [
      "O Banguela da linha de dragões articulados da Spin Master, com cerca de 20 cm de comprimento, asas que se movem e cauda removível.",
      "Faz parte da coleção com outros dragões da saga (vendidos separadamente). Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Fabricante", "Spin Master (distribuição Sunny)"],
      ["Tamanho", "Cerca de 20 cm"],
      ["Recursos", "Asas móveis e cauda removível"],
    ],
  },
  {
    id: "bq05",
    name: "Mini Banguela Interativo",
    tag: "Sensor de toque com mais de 25 sons e movimentos",
    price: 77.9,
    compareAtPrice: 259.67,
    imgs: ["bq05-1.jpg", "bq05-2.jpg", "bq05-3.jpg", "bq05-4.jpg", "bq05-5.jpg", "bq05-6.jpg"],
    description: [
      "O mini Banguela interativo tem sensor de toque: com um simples carinho, ele ativa mais de 25 sons e movimentos diferentes.",
      "Uma forma divertida de trazer a magia de Como Treinar o Seu Dragão para casa. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Recursos", "Sensor de toque, mais de 25 sons e movimentos"],
      ["Tamanho", "Mini"],
    ],
  },
  {
    id: "bq06",
    name: "Funko Pop! Deluxe Banguela",
    tag: "Colecionável em vinil, versão Deluxe com cenário",
    price: 133.9,
    compareAtPrice: 446.33,
    imgs: ["bq06-1.jpg", "bq06-2.jpg", "bq06-3.jpg", "bq06-4.jpg", "bq06-5.jpg", "bq06-6.jpg"],
    description: [
      "O Funko Pop! Deluxe do Banguela, maior que um Pop! comum e com cenário, para destacar a sua coleção.",
      "Produto importado, feito em vinil, ideal para fãs de todas as idades e colecionadores. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Marca", "Funko"],
      ["Linha", "Pop! Deluxe"],
      ["Material", "Vinil"],
      ["Origem", "Importado"],
    ],
  },
  {
    id: "bq07",
    name: "Figura Deluxe Banguela Como Treinar o Seu Dragão 3",
    tag: "Abre e movimenta as asas",
    price: 50.9,
    compareAtPrice: 169.67,
    imgs: ["bq07-1.jpg", "bq07-2.jpg", "bq07-3.jpg", "bq07-4.jpg"],
    description: [
      "A figura deluxe do Banguela de Como Treinar o Seu Dragão 3, articulada, que abre e movimenta as asas.",
      "Faz parte de uma coleção com vários dragões para brincar e colecionar (vendidos separadamente). Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Recursos", "Asas que abrem e se movimentam"],
      ["Caixa", "Cerca de 12 x 30 x 35 cm"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq08",
    name: "Baby Dragon Banguela de Vinil Macio",
    tag: "Bebê dragão macio para abraçar, com certificação INMETRO",
    price: 24.9,
    compareAtPrice: 83,
    imgs: ["bq08-1.jpg", "bq08-2.jpg", "bq08-3.jpg"],
    description: [
      "O Baby Dragon Banguela é feito em vinil macio, gostoso de abraçar e de brincar. Um companheiro perfeito para criar histórias em casa.",
      "Tem certificação do INMETRO e é ideal para estimular a imaginação dos pequenos.",
    ],
    specs: [
      ["Material", "100% vinil macio"],
      ["Certificação", "INMETRO"],
      ["Cor", "Preto"],
    ],
  },
  {
    id: "bq09",
    name: "Funko Pop! Banguela 686",
    tag: "O Funko Pop! clássico do Banguela, número 686",
    price: 31.9,
    compareAtPrice: 106.33,
    imgs: ["bq09-1.jpg", "bq09-2.jpg", "bq09-3.jpg", "bq09-4.jpg", "bq09-5.jpg"],
    description: [
      "O Funko Pop! Movies número 686, o clássico do Banguela sentadinho, com os olhos verdes e as marcas do personagem.",
      "Feito em vinil, chega na caixa original, perfeito para colecionar e para presentear. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Marca", "Funko"],
      ["Linha", "Pop! Movies #686"],
      ["Material", "Vinil"],
    ],
  },
  {
    id: "bq10",
    name: "Set de Batalha Banguela com Canhão",
    tag: "Banguela que lança projéteis e canhão de batalha",
    price: 62.9,
    compareAtPrice: 209.67,
    imgs: ["bq10-1.jpg", "bq10-2.jpg", "bq10-3.jpg", "bq10-4.jpg", "bq10-5.jpg"],
    description: [
      "Set de batalha com a figura do Banguela de asas abertas e um canhão com projéteis, para recriar as cenas de combate dos filmes.",
      "O dragão lança projéteis pela boca e o canhão também dispara munição. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Vem no set", "Figura do Banguela, canhão e projéteis"],
      ["Recursos", "Lança projéteis"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq11",
    name: "Banguela + Soluço",
    tag: "Banguela com 33 cm de envergadura e figura do Soluço",
    price: 62.9,
    compareAtPrice: 209.67,
    imgs: [
      "bq11-1.jpg",
      "bq11-2.jpg",
      "bq11-3.jpg",
      "bq11-4.jpg",
      "bq11-5.jpg",
      "bq11-6.jpg",
      "bq11-7.jpg",
    ],
    description: [
      "Conjunto com o Banguela e o Soluço, licenciado pela DreamWorks e distribuído pela Sunny. O Banguela tem asas texturizadas, cauda articulada e 33 cm de envergadura.",
      "A figura do Soluço acompanha o kit, para recriar a amizade mais famosa da saga. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Vem no kit", "Banguela + Soluço"],
      ["Envergadura", "Cerca de 33 cm"],
      ["Recursos", "Asas texturizadas e cauda articulada"],
    ],
  },
  {
    id: "bq12",
    name: "Boneco Banguela 30 cm",
    tag: "Asas e partes articuladas",
    price: 37.9,
    compareAtPrice: 126.33,
    imgs: ["bq12-1.jpg", "bq12-2.jpg", "bq12-3.jpg", "bq12-4.jpg", "bq12-5.jpg"],
    description: [
      "Boneco do Banguela com cerca de 30 cm, com asas e partes articuladas que podem ser colocadas em diferentes posições.",
      "Perfeito para as crianças criarem as próprias aventuras no mundo dos dragões. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Tamanho", "Cerca de 30 cm"],
      ["Articulação", "Asas e partes móveis"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq13",
    name: "Funko Pop! Premium Banguela Alfa",
    tag: "O Banguela no momento em que vira o Alfa",
    price: 83.9,
    compareAtPrice: 279.67,
    imgs: ["bq13-1.jpg", "bq13-2.jpg", "bq13-3.jpg"],
    description: [
      "O Funko Pop! Premium que retrata o momento em que o Banguela se torna o Alfa, com os detalhes azuis que marcam a cena.",
      "Feito em vinil, com cerca de 11 cm de altura, uma peça indispensável para quem coleciona. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Marca", "Funko"],
      ["Linha", "Pop! Premium"],
      ["Altura", "Cerca de 11 cm"],
      ["Material", "Vinil"],
    ],
  },
  {
    id: "bq14",
    name: "Dragão Banguela Articulado em Impressão 3D",
    tag: "21 cm, todo articulado",
    price: 10.9,
    compareAtPrice: 36.33,
    imgs: [
      "bq14-1.jpg",
      "bq14-2.jpg",
      "bq14-3.jpg",
      "bq14-4.jpg",
      "bq14-5.jpg",
      "bq14-6.jpg",
      "bq14-7.jpg",
      "bq14-8.jpg",
    ],
    description: [
      "Um Banguela produzido em impressão 3D, todo articulado, com 21 cm de comprimento e 18 cm de largura.",
      "Rico em detalhes, é ótimo para brincar e para enfeitar a estante de quem ama dragões.",
    ],
    specs: [
      ["Tamanho", "21 cm de comprimento x 18 cm de largura"],
      ["Fabricação", "Impressão 3D"],
      ["Articulação", "Corpo todo articulado"],
    ],
  },
  {
    id: "bq15",
    name: "Pelúcia Interativa Banguela",
    tag: "Mais de 50 frases e sons, luz e fumaça de plasma",
    price: 165.9,
    compareAtPrice: 553,
    imgs: [
      "bq15-1.jpg",
      "bq15-2.jpg",
      "bq15-3.jpg",
      "bq15-4.jpg",
      "bq15-5.jpg",
      "bq15-6.jpg",
      "bq15-7.jpg",
      "bq15-8.jpg",
    ],
    description: [
      "A pelúcia interativa da DreamWorks, desenvolvida pela WOW! Stuff, une marionete e robótica para dar vida ao Banguela. São mais de 50 frases e sons do filme, e a boca e a cabeça se movem e reagem ao toque.",
      "Ela solta a rajada de plasma em forma de luz e fumaça pelo nariz e pela boca, e você muda o humor do Banguela (carinhoso, protetor ou bravo) com três botões. Tem cerca de 26 cm. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Fabricante", "WOW! Stuff (distribuição Sunny)"],
      ["Tamanho", "Cerca de 26 cm"],
      ["Recursos", "Mais de 50 sons, luz, fumaça e 3 humores"],
    ],
  },
  {
    id: "bq16",
    name: "Banguela Voador",
    tag: "Estique a cauda, solte e ele sai voando",
    price: 31.9,
    compareAtPrice: 106.33,
    imgs: ["bq16-1.jpg", "bq16-2.jpg", "bq16-3.jpg", "bq16-4.jpg", "bq16-5.jpg", "bq16-6.jpg"],
    description: [
      "Figura do Banguela que voa de verdade: é só esticar a cauda e soltar para ele sair voando.",
      "Rica em detalhes, leva a diversão de treinar dragões para qualquer lugar. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Recursos", "Lançamento pela cauda"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq18",
    name: "Figura Banguela com Som 35 cm",
    tag: "Dragão articulado com efeitos sonoros",
    price: 79.9,
    compareAtPrice: 266.33,
    imgs: ["bq18-1.jpg", "bq18-2.jpg", "bq18-3.jpg", "bq18-4.jpg", "bq18-5.jpg"],
    description: [
      "Figura do Banguela com cerca de 35 cm de comprimento, articulada e com efeitos sonoros que deixam a brincadeira mais imersiva.",
      "Licenciada DreamWorks, para crianças e colecionadores. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Tamanho", "Cerca de 35 cm"],
      ["Recursos", "Sons e articulação"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq19",
    name: "Mini Figura Interativa Banguela",
    tag: "Aperte o nariz ou faça carinho para ouvir sons de dragão",
    price: 41.9,
    compareAtPrice: 139.67,
    imgs: ["bq19-1.jpg", "bq19-2.jpg", "bq19-3.jpg", "bq19-4.jpg", "bq19-5.jpg", "bq19-6.jpg"],
    description: [
      "Mini Banguela interativo: ao apertar o nariz ou fazer carinho, ele emite sons de dragão.",
      "Design detalhado e fiel ao personagem, para brincar no universo de Como Treinar o Seu Dragão. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Recursos", "Sons ao toque no nariz e carinho"],
      ["Tamanho", "Mini"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq20",
    name: "Pequeno Dragão Banguela Articulado",
    tag: "Asas que se movem e cauda articulada",
    price: 31.9,
    compareAtPrice: 106.33,
    imgs: [
      "bq20-1.jpg",
      "bq20-2.jpg",
      "bq20-3.jpg",
      "bq20-4.jpg",
      "bq20-5.jpg",
      "bq20-6.jpg",
      "bq20-7.jpg",
    ],
    description: [
      "O pequeno Banguela em figura articulada, com asas que se movem e cauda articulada, para recriar a amizade com o Soluço.",
      "Fiel ao personagem, transforma a brincadeira em voos pelos céus vikings. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Articulação", "Asas e cauda"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq21",
    name: "Playset Torre de Fogo com Banguela",
    tag: "Arena de treinamento com 4 mini figuras",
    price: 47.9,
    compareAtPrice: 159.67,
    imgs: ["bq21-1.jpg", "bq21-2.jpg", "bq21-3.jpg", "bq21-4.jpg", "bq21-5.jpg"],
    description: [
      "Playset Torre de Fogo da linha World of Berk, para recriar as batalhas na arena de treinamento: torre alta com braseiro no topo e muralha com portão destacável.",
      "Acompanha 4 mini figuras, entre elas o Banguela, e é compatível com outros itens da linha. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Vem no set", "Torre, muralha com portão e 4 mini figuras"],
      ["Linha", "World of Berk"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq22",
    name: "Playset Captura de Dragões com Banguela",
    tag: "Braço mecânico com rede, Banguela e vikings",
    price: 47.9,
    compareAtPrice: 159.67,
    imgs: ["bq22-1.jpg", "bq22-2.jpg", "bq22-3.jpg", "bq22-4.jpg", "bq22-5.jpg"],
    description: [
      "Playset da linha World of Berk com um braço mecânico articulado que movimenta uma cúpula em forma de rede para capturar dragões, e muralha com portão destacável.",
      "Acompanha o Banguela, um segundo dragão translúcido verde e 2 mini figuras de vikings. Produto oficial licenciado de Como Treinar o Seu Dragão.",
    ],
    specs: [
      ["Vem no set", "Estrutura com braço e rede, Banguela, dragão verde e 2 vikings"],
      ["Linha", "World of Berk"],
      ["Distribuição", "Sunny"],
    ],
  },
  {
    id: "bq24",
    name: "Conjunto 7 Figuras Como Treinar o Seu Dragão",
    tag: "Banguela e mais 6 dragões da saga",
    price: 94.9,
    compareAtPrice: 316.33,
    imgs: [
      "bq24-1.jpg",
      "bq24-2.jpg",
      "bq24-3.jpg",
      "bq24-4.jpg",
      "bq24-5.jpg",
      "bq24-6.jpg",
      "bq24-7.jpg",
      "bq24-8.jpg",
    ],
    description: [
      "Conjunto com 7 figuras de dragões de Como Treinar o Seu Dragão, com o Banguela e outros dragões da saga, para montar a sua própria Berk.",
      "Produto importado, ótimo para colecionar e para brincar.",
    ],
    specs: [
      ["Vem no conjunto", "7 figuras de dragões"],
      ["Origem", "Importado"],
    ],
  },
  {
    id: "bq25",
    name: "Pelúcia Pillow Pets Banguela com Luzes 28 cm",
    tag: "Pelúcia que projeta estrelas coloridas",
    price: 169.9,
    compareAtPrice: 566.33,
    imgs: [
      "bq25-1.jpg",
      "bq25-2.jpg",
      "bq25-3.jpg",
      "bq25-4.jpg",
      "bq25-5.jpg",
      "bq25-6.jpg",
      "bq25-7.jpg",
    ],
    description: [
      "A Pillow Pets do Banguela é uma pelúcia macia de cerca de 28 cm que acende e projeta estrelas coloridas no teto, perfeita como luz de dormir.",
      "Gostosa de abraçar e ótima para a hora de dormir das crianças. Produto importado.",
    ],
    specs: [
      ["Tamanho", "Cerca de 28 cm"],
      ["Recursos", "Projeta luzes coloridas"],
      ["Origem", "Importado"],
    ],
  },
];

/** Copy de venda de cada brinquedo: gancho e vantagens (blocos da descrição com as fotos). */
const TOY_COPY: Record<Toy["id"], { h: string; t: string; p: string[] }> = {
  bq01: {
    h: "O rugido de plasma mais famoso dos filmes",
    t: "Aperte e ouça o Banguela soltar o disparo de plasma, igual às cenas épicas do cinema. Com 33 cm, ele domina qualquer batalha no tapete da sala.",
    p: [
      "Cerca de 33 cm de comprimento",
      "Sons do disparo de plasma",
      "Cauda removível",
      "Escamas e asas fiéis ao personagem",
    ],
  },
  bq02: {
    h: "Ele voa, ruge e dispara plasma",
    t: "Mexa as asas e as pernas e ouça o Banguela ganhar vida: tem som de voo, de rugido e de plasma, cada um num movimento diferente.",
    p: [
      "Asas e pernas articuladas",
      "Botão nas costas com sons de plasma",
      "Som de voo ao levantar a perna",
      "Rugido ao voltar para a posição",
    ],
  },
  bq03: {
    h: "O Banguela mais detalhado da coleção",
    t: "Uma figura grande e cheia de detalhes, com articulações que deixam cada pose realista. Para brincar de Berk ou para ser o destaque da estante.",
    p: [
      "Linha Deluxe, rica em detalhes",
      "Vários pontos de articulação",
      "Para brincar e para colecionar",
      "Estimula a imaginação",
    ],
  },
  bq04: {
    h: "Pequeno no preço, grande na aventura",
    t: "Com 20 cm, asas que se movem e cauda removível, é o Banguela perfeito para levar para qualquer lugar e começar a coleção.",
    p: [
      "Cerca de 20 cm",
      "Asas que se movem",
      "Cauda removível",
      "Combina com outros dragões da linha",
    ],
  },
  bq05: {
    h: "Um carinho e ele responde",
    t: "O mini Banguela tem sensor de toque: é só fazer carinho para ele reagir com sons e movimentos. As crianças não largam.",
    p: [
      "Sensor de toque",
      "Mais de 25 sons e movimentos",
      "Tamanho mini, cabe na mão",
      "Diversão sem precisar de tela",
    ],
  },
  bq06: {
    h: "O Funko que rouba a cena da coleção",
    t: "Maior que um Pop! comum e com cenário, o Deluxe do Banguela é a peça que todo colecionador quer na prateleira.",
    p: [
      "Linha Pop! Deluxe com cenário",
      "Vinil de alta qualidade",
      "Produto importado",
      "Para fãs de todas as idades",
    ],
  },
  bq07: {
    h: "Asas abertas, pronto para voar",
    t: "A figura deluxe de Como Treinar o Seu Dragão 3 abre e movimenta as asas para recriar os voos mais bonitos do filme.",
    p: [
      "Asas que abrem e se movimentam",
      "Figura articulada",
      "Faz parte de uma coleção de dragões",
      "Chega na caixa original",
    ],
  },
  bq08: {
    h: "O bebê dragão mais fofo de Berk",
    t: "Macio, leve e gostoso de abraçar, o Baby Dragon Banguela é o companheiro perfeito para os pequenos criarem as primeiras histórias.",
    p: [
      "100% vinil macio",
      "Certificação INMETRO",
      "Leve e fácil de segurar",
      "Preço que cabe em qualquer lembrança",
    ],
  },
  bq09: {
    h: "O clássico que todo fã precisa ter",
    t: "O Funko Pop! número 686, com o Banguela sentadinho e os olhos verdes que conquistaram o mundo. Simples, fofo e indispensável.",
    p: [
      "Funko Pop! Movies #686",
      "Vinil",
      "Na caixa original",
      "Perfeito para colecionar e presentear",
    ],
  },
  bq10: {
    h: "Prepare-se para a batalha",
    t: "O Banguela de asas abertas lança projéteis pela boca e ainda vem com um canhão para a disputa ficar completa.",
    p: [
      "Figura do Banguela com asas abertas",
      "Lança projéteis pela boca",
      "Canhão com munição",
      "Ótimo para brincar em dupla",
    ],
  },
  bq11: {
    h: "A amizade mais famosa da saga",
    t: "Banguela e Soluço juntos, prontos para recriar o voo que mudou Berk para sempre. O Banguela tem 33 cm de envergadura.",
    p: [
      "Banguela + figura do Soluço",
      "Cerca de 33 cm de envergadura",
      "Asas texturizadas",
      "Cauda articulada",
    ],
  },
  bq12: {
    h: "30 cm de dragão para brincar o dia todo",
    t: "Um Banguela grande, com asas e partes articuladas que mudam de pose para cada aventura que a criança inventar.",
    p: ["Cerca de 30 cm", "Asas articuladas", "Várias poses possíveis", "Resistente para brincar"],
  },
  bq13: {
    h: "O momento em que ele vira o Alfa",
    t: "O Funko Pop! Premium que eterniza a cena mais marcante do Banguela, com os detalhes azuis brilhando na pele de dragão.",
    p: [
      "Funko Pop! Premium",
      "Cerca de 11 cm de altura",
      "Detalhes azuis do Alfa",
      "Peça indispensável para colecionadores",
    ],
  },
  bq14: {
    h: "Todo articulado, do focinho à cauda",
    t: "Feito em impressão 3D, esse Banguela se mexe inteiro e surpreende pela quantidade de detalhes. Por esse preço, dá para levar um para cada amigo.",
    p: [
      "21 cm de comprimento x 18 cm de largura",
      "Corpo todo articulado",
      "Impressão 3D cheia de detalhes",
      "Ótimo para brincar e para enfeitar",
    ],
  },
  bq15: {
    h: "O Banguela mais vivo que você já viu",
    t: "Marionete e robótica juntas: ele mexe a boca e a cabeça, reage ao toque, fala mais de 50 frases e sons e ainda solta a rajada de plasma em luz e fumaça.",
    p: [
      "Mais de 50 frases e sons do filme",
      "Boca e cabeça que se movem e reagem ao toque",
      "Rajada de plasma com luz e fumaça",
      "3 humores: carinhoso, protetor ou bravo",
    ],
  },
  bq16: {
    h: "Ele voa de verdade",
    t: "Estique a cauda, solte e veja o Banguela sair voando. Diversão garantida no quintal, no parque ou na sala.",
    p: [
      "Lançamento pela cauda",
      "Voa de verdade",
      "Rico em detalhes",
      "Leve para levar a qualquer lugar",
    ],
  },
  bq18: {
    h: "35 cm de dragão com som",
    t: "Grande, articulado e com efeitos sonoros: esse Banguela transforma qualquer brincadeira em cena de cinema.",
    p: ["Cerca de 35 cm", "Efeitos sonoros", "Articulado", "Para crianças e colecionadores"],
  },
  bq19: {
    h: "Aperte o nariz e ouça o dragão",
    t: "Faça carinho ou aperte o nariz do mini Banguela e ele responde com sons de dragão. Pequeno, fofo e viciante.",
    p: [
      "Sons ao apertar o nariz",
      "Sons ao fazer carinho",
      "Tamanho mini",
      "Design fiel ao personagem",
    ],
  },
  bq20: {
    h: "Pronto para voar pelos céus vikings",
    t: "O pequeno Banguela tem asas que se movem e cauda articulada para recriar os voos com o Soluço em qualquer cantinho da casa.",
    p: [
      "Asas que se movem",
      "Cauda articulada",
      "Fiel ao personagem",
      "Tamanho ideal para levar junto",
    ],
  },
  bq21: {
    h: "A arena de treinamento de Berk em casa",
    t: "Uma torre alta com braseiro no topo, muralha com portão e 4 mini figuras, entre elas o Banguela. É só montar e começar a batalha.",
    p: [
      "Torre de Fogo com braseiro",
      "Muralha com portão destacável",
      "4 mini figuras com o Banguela",
      "Compatível com a linha World of Berk",
    ],
  },
  bq22: {
    h: "Será que os vikings capturam o Banguela?",
    t: "O braço mecânico movimenta a rede para capturar dragões, e a criança decide quem vence: os vikings ou o Banguela.",
    p: [
      "Braço mecânico articulado com rede",
      "Muralha com portão destacável",
      "Banguela e um dragão verde translúcido",
      "2 mini figuras de vikings",
    ],
  },
  bq24: {
    h: "Monte a sua própria Berk",
    t: "O Banguela e mais 6 dragões da saga num só conjunto. Ideal para quem quer começar a coleção de uma vez ou dar um presente que impressiona.",
    p: [
      "7 figuras de dragões",
      "Banguela incluso",
      "Produto importado",
      "Para brincar e para colecionar",
    ],
  },
  bq25: {
    h: "Um céu de estrelas no quarto",
    t: "Abraçou, apertou, acendeu: a Pillow Pets do Banguela projeta estrelas coloridas no teto e transforma a hora de dormir no melhor momento do dia.",
    p: [
      "Cerca de 28 cm",
      "Projeta luzes coloridas no teto",
      "Pelúcia macia para abraçar",
      "Perfeita como luz de dormir",
    ],
  },
};

export const brinquedos: Bundle[] = TOYS.map((t) => ({
  id: t.id,
  name: t.name,
  tag: t.tag,
  price: t.price,
  compareAtPrice: t.compareAtPrice,
  img: img(t.imgs[0]!),
  images: t.imgs.map(img),
  options: [],
  benefits: [
    t.tag,
    "Produto original, na embalagem do fabricante",
    "Ótimo para presentear fãs de dragão",
  ],
  description: t.description,
  richSections: [
    { title: TOY_COPY[t.id].h, text: TOY_COPY[t.id].t, media: img(t.imgs[1]!) },
    {
      title: "Por que as crianças (e os adultos) amam",
      text: t.description[0]!,
      points: TOY_COPY[t.id].p,
      media: img(t.imgs[2]!),
    },
    {
      title: "Presente certeiro com 70% OFF",
      text: `${t.description.some((d) => d.includes("licenciado")) ? "Produto original e licenciado de Como Treinar o Seu Dragão" : "Produto original"}, na embalagem do fabricante, por uma fração do preço. Para o aniversário, o Natal, o Dia das Crianças ou para aumentar a sua coleção.`,
      ...(t.imgs[3] ? { media: img(t.imgs[3]) } : {}),
    },
  ],
  specs: [
    ...t.specs,
    ["Indicado para", "Fãs de Como Treinar o Seu Dragão; veja a idade na embalagem"],
  ],
  category: "brinquedos",
  checkoutProductName: t.name,
  checkoutProductDescription: t.tag,
  checkoutUrl: `/checkout?plano=${t.id}`,
  badge: "70% OFF",
}));
