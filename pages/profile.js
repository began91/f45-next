import Layout from 'components/Layout';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
// import { unstable_getServerSession } from 'next-auth/next';
// import { authOptions } from 'pages/api/auth/[...nextauth]';
// import { useRouter } from 'next/router';

export default function Profile({ foo }) {
    const { data: session, status } = useSession();
    // const router = useRouter();

    // if (typeof window === 'undefined') return null;
    // if (!session) {
    //     router.replace('/auth');
    // }
    if (status === 'authenticated') {
        const { user } = session;

        return (
            <Layout>
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
                    <Image src={user.image} layout="fill" />
                </div>
                <div>Session Status: {status}</div>

                <button onClick={signOut}>Sign Out</button>
            </Layout>
        );
    }
    return (
        <Layout>
            <Link href="api/auth/signin">
                <button>Sign In</button>
            </Link>
        </Layout>
    );
}

// export async function getServerSideProps(context) {
//     console.log('Context:');
//     console.log(context);
//     const foo = 'bar';
//     console.log(`foo=${foo}`);
//     return {
//         props: {
//             foo,
//         },
//     };
// }

export async function getServerSideProps(context) {
    let { unstable_getServerSession } = require('next-auth/next');
    let { authOptions } = require('./api/auth/[...nextauth]');

    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
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

    let { user } = session;

    return {
        props: {
            user,
        },
    };

    // const session = await unstable_getServerSession();

    // if (!session) {
    //     return {
    //         redirect: {
    //             destination: '/auth',
    //             permanent: false,
    //         },
    //     };
    // }

    // return {
    //     props: { session },
    // };
}
