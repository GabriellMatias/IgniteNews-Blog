import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      /* quais infos eu quero buscar na API */
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
}
export default NextAuth(authOptions)
