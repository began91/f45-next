import React, { useEffect, Dispatch, SetStateAction } from 'react';
import Layout from 'components/Layout';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getWorkoutByDate, getAllWorkouts } from 'lib/mongodb';
import WorkoutInfo from 'components/WorkoutInfo';

interface dailyType {
	workout: WorkoutType;
	useWorkout: [
		WorkoutType,
		Dispatch<SetStateAction<WorkoutType | undefined>>
	];
}

export default function Daily({ workout, useWorkout }: dailyType) {
	const setWorkout = useWorkout[1];
	useEffect(() => {
		setWorkout(workout);
	}, [workout, setWorkout]);

	const date = new Date(workout.date);

	return (
		<Layout page="Day" date={date}>
			<WorkoutInfo useWorkout={useWorkout} />
			<Link href="/custom">
				<button>Create a custom workout using this format-&gt;</button>
			</Link>
		</Layout>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	// const { getAllWorkouts } = require('lib/mongodb');
	//get dates of all workouts from mongo and return as possible paths
	const workouts = await getAllWorkouts();
	const paths = workouts.map((workout) => {
		const date = new Date(workout.date);
		return {
			params: {
				date: [
					String(date.getFullYear()),
					String(date.getMonth() + 1),
					String(date.getDate()),
				],
			},
		};
	});

	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	// console.log(typeof Workout);
	// use date to get workout from mongodb
	//default is today
	const newDate = new Date();
	let year = newDate.getFullYear();
	let month = newDate.getMonth() + 1;
	let date = newDate.getDate();
	if (params?.date) {
		//if a date was supplied, set that instead

		[year, month, date] = (params.date as string[]).map((a: string) =>
			Number(a)
		);
	}

	// const { getWorkoutByDate } = require('lib/mongodb');
	const workout = await getWorkoutByDate(new Date(year, month - 1, date));

	return {
		props: {
			workout: workout
				? CreateWorkout(
						workout.date,
						workout.style,
						workout.stationList
				  ) //eslint-disable-line no-mixed-spaces-and-tabs
				: null,
		},
		revalidate: 1,
	};
};
