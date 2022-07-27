import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// import styles

async function createUser(username, email, password) {
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });

    const data = await res.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }
    return data;
}

export default function RegisterForm() {
    const usernameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const router = useRouter();

    async function submitHandler(e) {
        e.preventDefault();
        console.log('Form submitted:');

        const enteredUsername = usernameInputRef.current.value;
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        //add optional validation here;
        //Validation
        if (
            !enteredEmail ||
            !enteredEmail.includes('@') ||
            !enteredPassword ||
            !enteredUsername
        ) {
            alert('Invalid details');
            return;
        }

        try {
            const result = await createUser(
                enteredUsername,
                enteredEmail,
                enteredPassword
            );
            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section>
            <h1>Sign Up</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        id="username"
                        required
                        ref={usernameInputRef}
                    />
                </div>
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
                    <button>Sign me up!</button>
                    <br />
                    <Link href="/auth/signin">
                        <a>Login with existing account</a>
                    </Link>
                </div>
            </form>
        </section>
    );
}
