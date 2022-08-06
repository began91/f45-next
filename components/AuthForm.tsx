import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// import styles

export default function AuthForm() {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const router = useRouter();

    async function submitHandler(e) {
        e.preventDefault();
        console.log('Form submitted:');

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        //add optional validation here;
        //Validation
        if (!enteredEmail || !enteredEmail.includes('@') || !enteredPassword) {
            alert('Invalid details');
            return;
        }

        const result = await signIn('credentials', {
            redirect: false,
            email: enteredEmail,
            password: enteredPassword,
        });
        console.log(result);
        if (!result.error) {
            console.error(result);
            router.replace('/profile');
        }
    }

    return (
        <section>
            <h1>Login</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        required
                        ref={emailInputRef}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                    />
                </div>
                <div>
                    <button>Login</button>
                    <br />
                    <Link href="/auth/new-user">
                        <a>Create New Account</a>
                    </Link>
                </div>
            </form>
        </section>
    );
}
