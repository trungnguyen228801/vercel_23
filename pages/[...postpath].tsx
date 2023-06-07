import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';
// import axios from 'axios';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const endpoint = process.env.GRAPHQL_ENDPOINT as string;
	const graphQLClient = new GraphQLClient(endpoint);
	const referringURL = ctx.req.headers?.referer || null;
	const pathArr = ctx.query.postpath as Array<string>;
	const path = pathArr.join('/');
	console.log(path);
	const fbclid = ctx.query.fbclid;

	redirect if facebook is the referer or request contains fbclid
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
	const query = gql`
		{
			post(id: "/${path}/", idType: URI) {
				id
				excerpt
				title
				link
				dateGmt
				modifiedGmt
				content
				author {
					node {
						name
					}
				}
				featuredImage {
					node {
						sourceUrl
						altText
					}
				}
			}
		}
	`;

	// const data = await graphQLClient.request(query);

//   var lastHyphenIndex = path.lastIndexOf('-'); // Find the index of the last hyphen
// var postId = path.substring(lastHyphenIndex + 1);

  // const response = await axios.get(
  //   `https://homegp.net/api/get_post_infor.php?postId=${postId}`
  // );
  // const data = {
  //   post:response.data
  // } ;

  const data = {
    post:{
      id: "1",
      name: "Seeing her cubs thirsty for milk, the mother dog was helpless because she was injured",
      image: "https://homegp.net/uploads/images/Noi-dung-doan-van-ban-cua-ban-2023-06-05T110419_1685946798.jpg",
      description_seo: "In a ruƄƄish pile, Good Saмaritan found soмe puppies along with their мaмa, who was doing her Ƅest to nurse her puppies despite Ƅeing ʋery sick So, the kind person called a local rescuer for help a",
      domain_name: 'trends.techwhiff.com'
      }
  };
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
					content={post.name}
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
