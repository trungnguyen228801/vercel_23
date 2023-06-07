import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import axios from 'axios';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const referringURL = ctx.req.headers?.referer || null;
	const pathArr = ctx.query.postpath as Array<string>;
	const path = pathArr.join('/');
	console.log(path);
	const fbclid = ctx.query.fbclid;
    try {
        var lastHyphenIndex = path.lastIndexOf('-'); // Find the index of the last hyphen
        var postId = path.substring(lastHyphenIndex + 1);
        // Make the API request to fetch post information
        const response = await axios.get(
          `https://homegp.net/get_post_infor.php?postId=${postId}`
        );
    
        const data = response.data;
    
        // Redirect if facebook is the referrer or request contains fbclid
        if (data.post?.domain_name) {
          if (referringURL?.includes('facebook.com') || fbclid) {
            return {
              redirect: {
                permanent: false,
                destination: `https://${data.post.domain_name}/${encodeURI(path)}`,
              },
            };
          }
        }
    
        if (!data.post) {
          return {
            notFound: true,
          };
        }
    
        return {
          props: {
            path,
            post: data.post,
            host: ctx.req.headers.host,
          },
        };
      } catch (error) {
        console.error('Error fetching post information:', error);
        return {
          notFound: true,
        };
      }
};

interface PostProps {
    post: any;
    host: string;
    path: string;
}

const Post: React.FC<PostProps> = (props) => {
    const { post, host, path } = props;

    // to remove tags from excerpt
    const removeTags = (str: string) => {
        if (str === null || str === '') return '';
        else str = str.toString();
        return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
    };

    return (
        <>
        <Head>
        <meta property= "og:title" content = { post.name } />
            <link rel="canonical" href = {`https://${host}/${path}`
} />
    < meta property = "og:description" content = { removeTags(post.description_seo) } />
        <meta property="og:url" content = {`https://${host}/${path}`} />
            < meta property = "og:type" content = "article" />
                <meta property="og:locale" content = "en_US" />
                    <meta property="og:site_name" content = { host.split('.')[0] } />
                                <meta property="og:image" content = { post.image } />
                                    <meta
					property="og:image:alt"
content = { post.name }
    />
    <title>{ post.name } < /title>
    < /Head>
    < div className = "post-container" >
        <h1>{ post.name } < /h1>
        < img
src = { post.image }
alt = { post.name }
    />
    <article dangerouslySetInnerHTML={ { __html: post.description_seo } } />
        < /div>
        < />
	);
};

export default Post;
