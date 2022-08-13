import 'styles/globals.css';
import { useState, useEffect } from 'react';
// import { getWorkoutByDate } from 'lib/mongodb';
import { SessionProvider } from 'next-auth/react';
import 'src/helpers/date.extensions';
import type { AppProps } from 'next/app';
import { WorkoutType } from 'src/helpers/CreateWorkout';

// Data Prototypes

function MyApp({ Component, pageProps }: AppProps) {
	const useDate = useState(new Date());
	const useWorkout = useState(null as unknown as WorkoutType);

	const [snd, setSnd] = useState(null as unknown as HTMLAudioElement);

	useEffect(() => {
		setSnd(
			new Audio(
				'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
			)
		);
	}, []);
	// console.log('session:');
	// console.log(pageProps.session);

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
