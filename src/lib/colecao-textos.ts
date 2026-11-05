/**
 * Textos de SEO das páginas de coleção: título e descrição que aparecem no Google e um bloco
 * de texto no fim da página (abaixo dos produtos), com as palavras que as pessoas pesquisam.
 * Coleção sem texto aqui usa o nome e a descrição do catálogo.
 */
export type ColecaoTexto = {
  title: string;
  description: string;
  h2: string;
  paragrafos: readonly string[];
};

export const COLECAO_TEXTOS: Readonly<Record<string, ColecaoTexto>> = {
  kigurumi: {
    title: "Pijama Kigurumi adulto e infantil: 2 por R$ 79",
    description:
      "Pijama kigurumi de corpo inteiro, com capuz e zíper, em tecido peluciado. Combo de 2 por R$ 79 ou 4 por R$ 129 com ursinho de brinde. Do infantil 2 anos ao plus size G3.",
    h2: "Pijama kigurumi para a família toda",
    paragrafos: [
      "O kigurumi é o pijama macacão de corpo inteiro, com capuz de bichinho e zíper na frente. O nosso é de pelúcia macia, soltinho no corpo e quentinho para o frio, bom para dormir, ficar no sofá ou fazer a noite do pijama.",
      "Ele é vendido em combo: 2 pijamas por R$ 79 ou 4 por R$ 129, e no combo de 4 vai um ursinho de pelúcia de brinde. Cada pijama do combo tem o seu tamanho, do infantil 2 anos ao plus size G3, então dá para vestir o casal, os filhos e os amigos no mesmo pedido.",
    ],
  },
  conforto: {
    title: "Pijama de dragão, pantufas e pelúcia gigante",
    description:
      "Pijama de casal com estampa de dragão, calça de pijama, Snuggy, pantufas de pelúcia, chinelo nuvem, máscara de dormir e pelúcia gigante de dragão de 1,10 m.",
    h2: "Pijamas e produtos de dragão para dormir bem",
    paragrafos: [
      "Aqui ficam os pijamas de dragão: o kit casal de calça ou short com camiseta de algodão, a calça de pijama de algodão felpudo e as versões infantis. Os conjuntos vêm do infantil 2 anos ao plus size G3, e você escolhe o tamanho da camiseta e o da calça separados.",
      "Para completar a hora de dormir tem o Snuggy, o cobertor que se veste com capuz de dragão, as pantufas de pelúcia do 22 ao 46, o chinelo nuvem antiderrapante, a máscara de dormir e a pelúcia gigante de dragão de 1,10 m, preta ou branca.",
    ],
  },
  moletons: {
    title: "Cobertor vestível com capuz de dragão (Sleepo)",
    description:
      "Cobertor vestível de flanela com sherpa e capuz de dragão com chifres e asinhas. 8 cores, em tamanho adulto e infantil.",
    h2: "Cobertor vestível de dragão",
    paragrafos: [
      "O Sleepo Dragão é um moletom cobertor: flanela macia por fora, sherpa quentinha por dentro e um capuz de dragão com chifres e asinhas. É largo como um cobertor e tem mangas como um moletom, para ver filme, estudar ou trabalhar no frio sem se descobrir.",
      "São 8 cores, entre elas preto, branco, galáxia e uma versão que brilha no escuro, cada uma com tamanho adulto e infantil.",
    ],
  },
  casa: {
    title: "Luminária e umidificador de dragão para o quarto",
    description:
      "Decoração de dragão: umidificador com névoa azul, luminária de dragão bivolt e luminária LED 3D de acrílico com 7 cores. Presente para quem ama dragões.",
    h2: "Decoração de dragão para o quarto",
    paragrafos: [
      "O umidificador de dragão solta uma névoa azul pela boca e deixa o ar do quarto mais úmido nos dias secos. A luminária de dragão é bivolt, com cabo e interruptor, e a luminária LED 3D de acrílico troca entre 7 cores com um toque e funciona no USB ou com pilhas.",
      "Ficam bonitos na cabeceira e combinam com quarto temático de dragão, de criança ou de adulto.",
    ],
  },
  escola: {
    title: "Mochila, estojo e lancheira de dragão",
    description:
      "Kit escolar de dragão com mochila, estojo e lancheira térmica. Material escolar temático para a volta às aulas.",
    h2: "Material escolar de dragão",
    paragrafos: [
      "O kit escolar de dragão traz mochila, estojo e lancheira térmica com a mesma estampa, para a criança voltar às aulas com tudo combinando.",
    ],
  },
  joias: {
    title: "Anéis de dragão em prata 925 e colares de casal",
    description:
      "Par de anéis de dragão em prata 925, ajustáveis, e par de colares de dragão com pingentes que se encaixam. Vêm em estojo de presente para casais.",
    h2: "Joias de dragão para casais",
    paragrafos: [
      "Os anéis promessa de dragão vêm em par, em prata 925 e ajustáveis, então não precisa saber o número do anel de ninguém. Os colares também vêm em par, com pingentes de dragão que se encaixam.",
      "Os dois chegam em caixa de presente, prontos para o Dia dos Namorados, aniversário de namoro ou Natal.",
    ],
  },
  auto: {
    title: "Mascote de dragão para carro e moto",
    description:
      "Dragão de pelúcia para carro e moto, com fixação à escolha. Mascote de dragão para o painel ou o retrovisor.",
    h2: "Dragão de pelúcia para o carro",
    paragrafos: [
      "O dragão de carro é um mascote de pelúcia que vai no painel, no retrovisor ou na moto. Você escolhe a fixação na página do produto.",
    ],
  },
  pijamas: {
    title: "Pijama de dragão casal, adulto e infantil",
    description:
      "Pijama de casal com estampa de dragão: kit calça ou short com camiseta de algodão e calça de pijama de algodão felpudo. Do infantil 2 anos ao plus size G3.",
    h2: "Pijama de dragão para casal e família",
    paragrafos: [
      "O kit casal vem com 2 conjuntos de camiseta de algodão com calça ou short de pijama. No kit de calça, um conjunto é preto e o outro é branco, com calça de felpa antialérgica. Cada peça tem o seu tamanho, do infantil 2 anos ao plus size G3.",
      "Se você só quer a calça, a calça de pijama de dragão é de algodão felpudo com cós de elástico, em versão adulta e infantil.",
    ],
  },
  pantufas: {
    title: "Pantufas de pelúcia e chinelo nuvem de dragão",
    description:
      "Pantufas de pelúcia de personagem: 2 pares por R$ 49,90 ou 4 por R$ 79,90, do 22 ao 46. Chinelo nuvem antiderrapante com dragão de pelúcia na tira.",
    h2: "Pantufas e chinelos para a família toda",
    paragrafos: [
      "As pantufas de pelúcia vêm em combo, 2 pares por R$ 49,90 ou 4 por R$ 79,90, e a numeração vai do 22 ao 46, do infantil ao adulto.",
      "O chinelo nuvem tem solado grosso e macio, antiderrapante, com um dragão de pelúcia na tira.",
    ],
  },
};
