import Layout from 'components/Layout';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { NextAuthOptions } from 'next-auth/core/types';
// import { NextAuthOptions } from 'next-auth';
// import { useRouter } from 'next/router';

interface ProfileType {
	useDate: [Date, Dispatch<SetStateAction<Date | undefined>>];
}

export default function Profile({ useDate }: ProfileType) {
	const { data: session, status } = useSession();
	const date = useDate[0];
	// const router = useRouter();

	// if (typeof window === 'undefined') return null;
	// if (!session) {
	//     router.replace('/auth');
	// }
	if (status === 'authenticated') {
		const { user } = session;

		return (
			<Layout page={'Profile'} date={date}>
				<h1>Profile</h1>
				<div>Name: {user.name}</div>
				<div>Email: {user.email}</div>
				<div
					style={{
						position: 'relative',
						width: '20px',
						height: '20px',
					}}
				>
					<Image src={user.image} alt="user" layout="fill" />
				</div>
				<div>Session Status: {status}</div>

				<button onClick={signOut}>Sign Out</button>
			</Layout>
		);
	}
	return (
		<Layout page={'Auth'} date={date}>
			<Link href="api/auth/signin">
				<button>Sign In</button>
			</Link>
		</Layout>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	// const { unstable_getServerSession } = require('next-auth/next');
	// const { authOptions } = require('./api/auth/[...nextauth]');

	const session = await unstable_getServerSession(
		context.req as NextApiRequest,
		context.res as NextApiResponse<any>,
		authOptions as NextAuthOptions
	);
	console.log('session is:');
	console.log(session);
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const { user } = session;

	return {
		props: {
			user,
		},
	};
};
