import Link from 'next/link'
import styles from '../styles/Home.module.scss'

// const BLOG_URL = 'http://localhost:2368/';
// const CONTENT_API_KEY = '66e15cebcfdb4992be54b72b9d';
const {BLOG_URL, CONTENT_API_KEY} = process.env;

export default function Home({posts}) {
  return (
    <div className={styles.container}>
      <h1>My Bolg</h1>
      <ul>
        {posts.posts.map((post, index) => (
          <li key={index}><Link href="/post/[slug]" as={`/post/${post.slug}`}><a>{post.title}</a></Link></li>
        ))}
      </ul>
      
    </div>
  )
}

export const getStaticProps = async () => {
    const posts = await getPosts();
    
    return {
      props: {
        posts
      },
      revalidate: 10
    }
}

async function getPosts() {
     try {
        const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,excerpt,feature_image`);
        const posts = await res.json();
        return posts;
     } catch (error) {
        console.log(error);
     }    
}
