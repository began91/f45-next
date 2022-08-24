// declare module 'next-auth' {
// 	interface Session extends NextAuth.DefaultSession {
// 		user: {
// 			id?: string;
// 			name?: string;
// 			email?: string;
// 			image?: string;
// 		};
// 		jwt?: boolean;
// 		expires: ISODateFormat;
// 	}

// 	// interface NextAuthOptions {
// 	// 	session: Session;
// 	// 	adapter: Adapter;
// 	// 	debug: boolean;
// 	// 	providers: any[];
// 	// }
// }

declare module 'next-auth/react';

declare module 'next-auth/providers/google';

declare module 'next-auth/providers/facebook';
