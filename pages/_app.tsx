import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { getWorkoutByDate } from '../src/helpers/lists';
import { SessionProvider } from 'next-auth/react';
import 'src/helpers/date.extensions';

// Data Prototypes

function MyApp({ Component, pageProps }) {
	const useDate = useState(new Date());
	const useWorkout = useState(getWorkoutByDate(useDate[0]));

	const [snd, setSnd] = useState(null);

	useEffect(() => {
		setSnd(
			new Audio(
				'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
			)
		);
	}, []);
	console.log('session:');
	console.log(pageProps.session);

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
