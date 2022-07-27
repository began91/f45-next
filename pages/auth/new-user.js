import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from 'components/Layout';

import RegisterForm from 'components/RegisterForm';

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
            {isLoading ? <p>Loading...</p> : <RegisterForm />}
        </Layout>
    );
}
