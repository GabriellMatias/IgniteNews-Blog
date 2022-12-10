import { GetStaticProps } from 'next'
import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

type Post = {
  slug: string
  title: string
  resume: string
  updatedAt: string
}
interface PostProps {
  post: Post[]
}

export default function Posts({ post }: PostProps) {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Posts | IgNews</title>
      </Head>

      <main className={styles.Container}>
        <div className={styles.PostList}>
          {post.map((post) => (
            <Link
              href={
                session?.activeSubscription
                  ? `posts/${post.slug}`
                  : `posts/preview/${post.slug}`
              }
              key={post.slug}
              legacyBehavior
            >
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.resume.substring(0, 195)}...</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

/* puxando os posto do prismic CRM */
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  /* sempre faca a formatacao de dados apos consumir os dados da API
  para que ele nao tenha que ser formatado toda vez que o usuario acessar 
  a pagina */
  const response = await prismic.query<any>(
    [
      /* buscar todos documentos que o tipo for publication */
      Prismic.predicates.at('document.type', 'post'),
    ],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    },
  )
  const post = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      resume:
        post.data.content.find((content: any) => content.type === 'paragraph')
          ?.text ?? '',
      updatedAt: new Date(post.last_publication_date!).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      ),
    }
  })
  return {
    props: { post },
  }
}
