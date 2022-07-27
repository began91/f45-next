// import { unstable_getServerSession } from 'next-auth/next';
// import { authOptions } from 'pages/api/auth/[...nextauth]';
import Layout from 'components/Layout';

export default function profile2({ session, foo }) {
    return (
        <Layout page="profile2">
            <h1>Server Side Rendered Page</h1>
            <p>{session ? 'True' : 'False'}</p>
            <p>{foo}</p>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            foo: 'bar',
            session: await unstable_getServerSession(
                context.req,
                context.res,
                authOptions
            ),
        },
    };
}
