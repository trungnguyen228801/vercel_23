import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const referringURL = ctx.req.headers?.referer || null;
    const pathArr = ctx.query.postpath as Array<string>;
    const path = pathArr.join('/');
    console.log(path);
    const fbclid = ctx.query.fbclid;

    var data = {}
    var lastHyphenIndex = path.lastIndexOf('-'); // Find the index of the last hyphen
    var postId = path.substring(lastHyphenIndex + 1);
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    // Configure the request
    xhr.open('GET', 'https://homegp.net/get_post_infor.php?postId=' + postId);
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = xhr.response;
            if (response) {
                data = {
                    post: {
                        id:response.id,
                        name:response.name,
                        image:response.image,
                        description_seo:response.description_seo,
                        domain_name:response.domain_name,
                        // image: '323',
                        // title: '323',
                        // link: '323',
                        // dateGmt: '323',
                        // modifiedGmt: '323',
                        // content: '323',
                    }
                }

            }
        }
    };
    xhr.send();


    // // redirect if facebook is the referer or request contains fbclid
    // if (referringURL?.includes('facebook.com') || fbclid) {
    // 	return {
    // 		redirect: {
    // 			permanent: false,
    // 			destination: `${
    // 				endpoint.replace(/(\/graphql\/)/, '/') + encodeURI(path as string)
    // 			}`,
    // 		},
    // 	};
    // }
    // const query = gql`
    // 	{
    // 		post(id: "/${path}/", idType: URI) {
    // 			id
    // 			excerpt
    // 			title
    // 			link
    // 			dateGmt
    // 			modifiedGmt
    // 			content
    // 		}
    // 	}
    // `;

    // const data = await graphQLClient.request(query);

    
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
