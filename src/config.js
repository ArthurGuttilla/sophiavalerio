// ─────────────────────────────────────────────────────────────
//  Configuração do gate de senha (client-side)
// ─────────────────────────────────────────────────────────────
//
//  A SENHA PADRÃO é:  interestelar
//
//  Para trocar a senha:
//   1. Escolha a nova senha.
//   2. Rode no terminal, dentro da pasta do projeto:
//        node -e 'const p=process.argv[1];let x=0x811c9dc5;for(let i=0;i<p.length;i++){x^=p.charCodeAt(i);x=Math.imul(x,0x01000193);}console.log(x>>>0)' "suanova senha"
//      (use a senha já em minúsculas e sem espaços nas pontas)
//   3. Cole o número resultante em PASSWORD_HASH abaixo.
//
//  Observação: isto é um cadeado leve — afasta visitantes casuais e
//  evita indexação, mas não é segurança real (o conteúdo está no código).
//
export const PASSWORD_HASH = 651681113; // "interestelar"

// Algoritmo de hash (FNV-1a) — precisa bater com o usado acima.
export function hashPassword(str) {
  let x = 0x811c9dc5;
  const s = String(str).toLowerCase().trim();
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 0x01000193);
  }
  return x >>> 0;
}
