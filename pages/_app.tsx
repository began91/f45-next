import 'styles/globals.css';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import 'src/helpers/date.extensions';
import type { AppProps } from 'next/app';
import { WorkoutType } from 'src/helpers/CreateWorkout';

function MyApp({ Component, pageProps }: AppProps) {
	const date = new Date();
	const useDate = useState(
		new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
	); //set the state's UTC date to the local date
	const useWorkout = useState(null as unknown as WorkoutType);

	const [snd, setSnd] = useState(null as unknown as HTMLAudioElement);

	useEffect(() => {
		setSnd(
			new Audio(
				'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
			)
		);
	}, []);
	// console.log('pageprops:');
	// console.log(pageProps);

	return (
		<SessionProvider session={pageProps.session}>
			<Component
				{...pageProps}
				useDate={useDate}
				useWorkout={useWorkout}
				snd={snd}
			/>
		</SessionProvider>
	);
}

export default MyApp;
