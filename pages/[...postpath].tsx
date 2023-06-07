import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const endpoint = process.env.GRAPHQL_ENDPOINT as string;
	const graphQLClient = new GraphQLClient(endpoint);
	const referringURL = ctx.req.headers?.referer || null;
	const pathArr = ctx.query.postpath as Array<string>;
	const path = pathArr.join('/');
	console.log(path);
	const fbclid = ctx.query.fbclid;

	// redirect if facebook is the referer or request contains fbclid
	if (referringURL?.includes('facebook.com') || fbclid) {
		return {
			redirect: {
				permanent: false,
				destination: `${
					endpoint.replace(/(\/graphql\/)/, '/') + encodeURI(path as string)
				}`,
			},
		};
	}
	// var id_post = path.substring(path.lastIndexOf("-") + 1);
	// const query = gql`
	// 	{
	// 		post(id: "${id_post}") {
	// 			name
	// 			image
	// 			description_seo
	// 		}
	// 	}
	// `;

	// const data = await graphQLClient.request(query);


	// if (!data.post) {
	// 	return {
	// 		notFound: true,
	// 	};
	// }


// 	const postId = path.substring(path.lastIndexOf("-") + 1); // ID of the post you want to retrieve
// 	var data  = '';
// fetch(`https://trends.techwhiff.com/api_vercel.php?id=${postId}`)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not OK');
//     }
//     return response.json();
//   })
//   .then(res => {
// 	data = res;
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//   });
const data = {
	post:{
		name:'fwfefe',
		image:'àewfewf',
		description_seo:'description_seo'
	}
};
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

	// to remove tags from description_seo
	const removeTags = (str: string) => {
		if (str === null || str === '') return '';
		else str = str.toString();
		return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
	};

	return (
		<>
			<Head>
				<meta property="og:title" content={post.name} />
				<link rel="canonical" href={`https://${host}/${path}`} />
				<meta property="og:description" content={removeTags(post.description_seo)} />
				<meta property="og:url" content={`https://${host}/${path}`} />
				<meta property="og:type" content="article" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:site_name" content={host.split('.')[0]} />
				<meta property="og:image" content={post.image} />
				<meta
					property="og:image:alt"
					content={post.featuredImage.node.altText || post.name}
				/>
				<title>{post.name}</title>
			</Head>
			<div className="post-container">
				<h1>{post.name}</h1>
				<img
					src={post.image}
					alt={post.name}
				/>
				<article dangerouslySetInnerHTML={{ __html: post.description_seo }} />
			</div>
		</>
	);
};

export default Post;
