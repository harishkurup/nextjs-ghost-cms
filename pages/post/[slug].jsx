import {useRouter} from 'next/router';
import Link from 'next/link'
import {useState} from 'react';
import styles from '../../styles/Home.module.scss';

const {BLOG_URL, CONTENT_API_KEY} = process.env;

const Post = ({post}) => {

    const router = useRouter();

    const [enableLoadComments, setenableLoadComments] = useState(true);

    if(router.isFallback) {
        return <h1>Loading...</h1>
    }

    const loadComments = () => {
        setenableLoadComments(false);
        // load Disqus comments
        
        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
        
        window.disqus_config = function () {
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = post.slug; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };

        const script = document.createElement('script');
        script.src = 'https://nextjs-ghost-demo.disqus.com/embed.js';
        script.setAttribute('data-timestamp', Date.now().toString());
        
        document.body.appendChild(script);
    }

    return (
        <div className={styles.container}>
            <p className={styles.goback}>
                <Link href="/"><a>Go Back</a></Link>  
            </p>
            
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.html}}></div>
            {enableLoadComments && (<p className={styles.goback} onClick={loadComments}>
                Load Comments
            </p>)}
            <div id="disqus_thread"></div>
        </div>
    )
}

export default Post

export const getStaticProps = async ({params}) => {
    try {
        const slug = params.slug;
        const res = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`);
        const posts = await res.json();
        const post = posts.posts[0];

        return {
            props: {post},
            revalidate: 10
        }
    } catch (error) {
        console.log(error);
    }    
}

export const getStaticPaths = () => {
    // paths -> slugs which are allowed 
    // fallback 
    return {
        paths: [],
        fallback: true
    }
}


