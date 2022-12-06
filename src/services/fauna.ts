import { Client } from 'faunadb'

/* isso ja da acesso ao banco de dados FAUNA */
/* requisicoes para o banco de dados so pode ser feita pela api roots ou
getstaticProps e getserversideprops. seguranca NUNCA RODAR NO CLIENT/BROWSER
DO USUARIO */
export const fauna = new Client({
  secret: process.env.FAUNADB_KEY!,
})
