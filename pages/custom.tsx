import React, { Dispatch, SetStateAction, useEffect } from 'react';
import Layout from '../components/Layout';
// import { workoutStyleList, getLastWorkoutByStyle } from 'src/helpers/lists';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import utilStyles from 'styles/utils.module.css';
// import styles from 'styles/custom.module.css';
// import cn from 'classnames';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import WorkoutInfo from 'components/WorkoutInfo';
import { GetStaticProps } from 'next';
import { getUniqueWorkoutStyles, getWorkoutByDate } from 'lib/mongodb';

interface CustomType {
	useDate: [Date, Dispatch<SetStateAction<Date | undefined>>];
	useWorkout: [WorkoutType, Dispatch<SetStateAction<WorkoutType>>];
	snd: HTMLAudioElement;
	workoutStyleList: string[];
	todaysWorkout: WorkoutType;
}

export default function Custom({
	useDate,
	useWorkout: [workout, setWorkout],
	snd,
	workoutStyleList,
	todaysWorkout,
}: CustomType) {
	// const [workout, setWorkout] = useState(getWorkoutByDate(date));
	const { data: session, status } = useSession();
	const date = useDate[0];

	useEffect(() => {
		setWorkout(workout || todaysWorkout);
	});

	async function startWorkout() {
		snd.play();
		const postWorkout = workout;
		// postWorkout.logo = null;
		if (status === 'authenticated') {
			const { user } = session;
			//get the user id? perhaps the user id should be stored in the session. We'll use email for now.
			postWorkout.user = user.email;
		}
	}

	useEffect(() => {
		//resize textareas to content
		//https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
		const tx = document.getElementsByTagName('textarea');
		for (let i = 0; i < tx.length; i++) {
			tx[i].style.height = '0px';
			tx[i].setAttribute(
				'style',
				'height:' + (tx[i].scrollHeight + 2) + 'px;overflow-y:hidden;'
			);
		}
	});

	return (
		<Layout page="Custom" date={date}>
			<h2 className={utilStyles.headingMd}>Create Custom Workout:</h2>
			<WorkoutInfo
				useWorkout={[workout, setWorkout]}
				workoutStyleList={workoutStyleList}
			/>
			<Link href="/workout">
				<button onClick={startWorkout}>Start Workout</button>
			</Link>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const date = new Date();

	const today = new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate()
	);
	const workoutStyleList = await getUniqueWorkoutStyles();
	const todaysWorkout = await getWorkoutByDate(today);

	return {
		props: {
			workoutStyleList,
			todaysWorkout: todaysWorkout
				? CreateWorkout(
						todaysWorkout.date,
						todaysWorkout.style,
						todaysWorkout.stationList
				  ) //eslint-disable-line no-mixed-spaces-and-tabs
				: null,
		},
	};
};
