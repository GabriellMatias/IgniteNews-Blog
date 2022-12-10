/* quando queremos que a pagina seja dinamica baseado no id ou algo assim que vai vim, 
nomeia o arquivo com [] colchete e dentro coloca o parametro que deseja receber */

import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RichText } from 'prismic-dom'
import { useEffect } from 'react'
import { getPrismicClient } from '../../../services/prismic'
import style from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    /* caso o usuario ja esteja logado e tenha a inscricao ativa, ele nao
    vai pra pagina de preview, e sim de posts */
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])
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
          <p
            className={style.postContent}
            dangerouslySetInnerHTML={{
              __html: post.content.slice(0, 200),
            }}
          />

          <div className={style.previewContent} />

          <div className={style.ContinueReading}>
            Wanna Continue Reading?
            <Link href="/" legacyBehavior>
              <a> Subscribe Now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

/* quais paginas vc quer gerar durante a build e nao durante o primeiro acesso
da pessoa, nessa funcao faz a chamada dos post mais acessados e ja carrega a pagina 
deles statica no momento da build do aplicativo */
export const getStaticPaths = () => {
  return {
    /* passa as paginas que quer que seja gerada na build */
    paths: [],

    fallback: 'blocking',
  }
}

/* pagina vai serr publica por ser apenas um prewier entao deve ser statica
para evitar carregamentos desnecessarios */
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const { slug } = params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID<any>('post', String(slug), {})

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
    revalidate: 60 * 30,
  }
}
