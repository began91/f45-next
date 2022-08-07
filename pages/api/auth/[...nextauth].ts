import NextAuth from 'next-auth';
// import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from 'lib/mongodb';
import clientPromise from 'lib/mongodb2';
import { compare } from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

const client = new MongoClient(uri, options);

const authOptions = {
    session: {
        jwt: true,
    },
    // callbacks: {
    //     async signIn({ user, account, profile, email, credentials }) {
    //         return true;
    //     },
    //     async redirect({ user, baseUrl }) {
    //         return baseUrl;
    //     },
    //     async session({ session, user, token }) {
    //         return session;
    //     },
    //     async jwt({ token, user, account, profile, isNewUser }) {
    //         return token;
    //     },
    // },
    // pages: {
    //     signIn: 'auth/signin',
    //     signOut: 'auth/signout',
    //     error: '/auth/error',
    //     verifyRequest: '/auth/verify-request',
    //     newUser: '/auth/new-user',
    // },
    adapter: MongoDBAdapter(clientPromise),
    debug: true,
    providers: [
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID,
        //     clientSecret: process.env.FACEBOOK_SECRET,
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        // CredentialsProvider({
        //     name: 'Credentials',
        //     credentials: {
        //         email: { label: 'Email', type: 'email' },
        //         password: { label: 'Password', type: 'password' },
        //     },
        //     async authorize(credentials, req) {
        //         //connect to db
        //         // console.log(credentials);
        //         const { db, client } = await connectToDatabase();
        //         const result = await db
        //             .collection('users')
        //             .findOne({ email: credentials.email });

        //         //not found

        //         if (!result) {
        //             client.close();
        //             throw new Error('No user found with the email');
        //         }
        //         // check hashed password
        //         const checkPassword = await compare(
        //             credentials.password,
        //             result.password
        //         );
        //         //incorrect password
        //         if (!checkPassword) {
        //             client.close();
        //             throw new Error('Incorrect password');
        //         }
        //         console.log('result');
        //         console.log(result);
        //         client.close();
        //         return {
        //             email: result.email || null,
        //             name: result.username || null,
        //             image: result.image || null,
        //             foo: 'bar',
        //         };
        //     },
        // }),
    ],
};

export default NextAuth(authOptions);
export { authOptions };
