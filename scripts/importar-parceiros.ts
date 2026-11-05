/**
 * Importa a planilha de revendas parceiras para src/lib/parceiros.json.
 *
 *   bun run parceiros ~/Downloads/parceiros.csv              valida e grava
 *   bun run parceiros ~/Downloads/parceiros.csv --verificar  também consulta cada CNPJ na Receita (BrasilAPI)
 *   bun run parceiros ~/Downloads/parceiros.csv --ignorar-erros  grava só as linhas válidas
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { importar } from "../src/lib/parceiros-csv";
import { consultarCnpj, vendeGlp } from "../src/lib/cnpj";

const args = process.argv.slice(2);
const arquivo = args.find((a) => !a.startsWith("--"));
const verificar = args.includes("--verificar");
const ignorarErros = args.includes("--ignorar-erros");

if (!arquivo) {
  console.error("Uso: bun run parceiros <planilha.csv> [--verificar] [--ignorar-erros]");
  process.exit(1);
}

const bytes = readFileSync(resolve(arquivo));
let texto: string;
try {
  texto = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
} catch {
  texto = new TextDecoder("windows-1252").decode(bytes);
}

const rel = importar(texto);

if (verificar) {
  for (const c of [...rel.cidades]) {
    const r = c.revenda;
    try {
      const dados = await consultarCnpj(r.cnpj);
      const problema = !dados
        ? "CNPJ não encontrado na Receita"
        : dados.situacao !== "ATIVA"
          ? `CNPJ com situação ${dados.situacao}`
          : "";
      if (problema) {
        rel.erros.push({ linha: 0, erros: [`${c.nome}/${c.uf} (${r.nome}): ${problema}`] });
        rel.cidades.splice(rel.cidades.indexOf(c), 1);
      } else if (r.marcasGas.length && dados && !vendeGlp(dados)) {
        console.warn(`! ${c.nome}/${c.uf} (${r.nome}): CNPJ sem CNAE 4784-9/00 (revenda de GLP). Confira a autorização ANP.`);
      }
    } catch (e) {
      console.warn(`! ${c.nome}/${c.uf}: não deu pra consultar o CNPJ agora (${(e as Error).message})`);
    }
    await new Promise((ok) => setTimeout(ok, 400));
  }
}

for (const e of rel.erros) {
  console.error(`✗ ${e.linha ? `linha ${e.linha}: ` : ""}${e.erros.join("; ")}`);
}
console.log(
  `\n${rel.cidades.length} revenda(s) válida(s), ${rel.erros.length} com erro, ${rel.exemplos} linha(s) de exemplo ignorada(s).`,
);
for (const c of rel.cidades) console.log(`✓ ${c.nome}/${c.uf} — ${c.revenda.nome}`);

if (rel.erros.length && !ignorarErros) {
  console.error("\nNada foi gravado. Corrija as linhas acima ou rode com --ignorar-erros.");
  process.exit(1);
}

const destino = resolve(import.meta.dir, "../src/lib/parceiros.json");
writeFileSync(destino, `${JSON.stringify(rel.cidades, null, 2)}\n`);
console.log(`\nGravado em src/lib/parceiros.json. Publique o site para as cidades entrarem no ar.`);
