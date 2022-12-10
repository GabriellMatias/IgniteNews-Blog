/* quando queremos que a pagina seja dinamica baseado no id ou algo assim que vai vim, 
nomeia o arquivo com [] colchete e dentro coloca o parametro que deseja receber */

import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../services/prismic'
import style from './post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | IgNews</title>
      </Head>

      <main className={style.container}>
        <article className={style.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          {/*   tomar cuidado com essa funcao que pode deixar a pessoa injetar um script
        na sua pagina e roubar informacoes */}
          <div
            className={style.postContent}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </article>
      </main>
    </>
  )
}

/* paginas geradas de forma statica nao e protegida, ou seja,todos tem acesso,
e essa pagina so pode ter acesso quem e inscrito e quem esta logado */

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}: any) => {
  const session = await getSession({ req })
  const { slug } = params
  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    }
  }

  const prismic = getPrismicClient(req)
  const response = await prismic.getByUID<any>('post', String(slug), {
    /* aqui vai alguns
parametros que devem ser passana funcao */
  })

  /* formatando dados nesse lado do servidor para nao ser formatado
  toda vez que o usuario acessar a pagina */
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date!).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  }

  return {
    props: { post },
  }
}
