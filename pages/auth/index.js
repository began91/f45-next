import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import Link from 'next/link';

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        getSession().then(session => {
            if (session) {
                router.replace('/'); //if session exists, return to home page
            } else {
                setIsLoading(false);
            }
        });
    }, [router]);

    return (
        <Layout page="auth">
            <Link href="/auth/new-user">
                <button>New User</button>
            </Link>
            <br />
            <Link href="/auth/signin">
                <button>Returning User</button>
            </Link>
        </Layout>
    );
}
