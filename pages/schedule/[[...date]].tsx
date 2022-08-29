import Layout from 'components/Layout';
import NewCalendar from 'components/NewCalendar';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { getAllWorkouts, getWorkoutByMonth } from 'lib/mongodb';
import { areDatesEqual } from 'src/helpers/areDatesEqual';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface ScheduleType {
	monthlyWorkouts: WorkoutType[][];
	date: Date;
	workout: WorkoutType;
	useWorkout: [WorkoutType, Dispatch<SetStateAction<WorkoutType>>];
}

export default function Schedule({
	monthlyWorkouts,
	date,
	workout,
	useWorkout,
}: ScheduleType) {
	date = new Date(date);

	const setWorkout = useWorkout[1];
	useEffect(() => {
		setWorkout(workout);
	}, [workout, setWorkout]);

	const router = useRouter();
	if (router.isFallback) {
		const fallDate = new Date();
		return (
			<Layout page="Month" date={fallDate}>
				Loading...
			</Layout>
		);
	}

	return (
		<Layout page="Month" date={date}>
			<NewCalendar month={monthlyWorkouts} date={date} />
		</Layout>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	// const { getAllWorkouts } = require('lib/mongodb');
	const workouts = (await getAllWorkouts()) as WorkoutType[];
	const paths = workouts.map((workout: WorkoutType) => {
		const date = new Date(workout.date);
		return {
			params: {
				date: [
					String(date.getUTCFullYear()),
					String(date.getUTCMonth() + 1),
					String(date.getUTCDate()),
				],
			},
		};
	});
	// console.log(paths.map((path) => path.params.date));

	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const newDate = new Date(); //default is today if no date is specified
	let year = newDate.getFullYear();
	let month = newDate.getMonth() + 1;
	let date = newDate.getDate();
	if (params?.date) {
		[year, month, date] = (params.date as string[]).map((a: string) =>
			Number(a)
		); //change to two separate params [year]/[month]
	}

	let monthlyWorkouts = await getWorkoutByMonth(
		new Date(year, month - 1, date)
	);

	monthlyWorkouts = monthlyWorkouts.map((week) =>
		week.map((workout) =>
			workout
				? CreateWorkout(
						workout.date,
						workout.style,
						workout.stationList
				  ) //eslint-disable-line no-mixed-spaces-and-tabs
				: null
		)
	);

	const workout =
		monthlyWorkouts
			.flat()
			.find((workout) =>
				areDatesEqual(
					new Date(year, month - 1, date),
					new Date(workout?.date)
				)
			) || CreateWorkout(new Date(year, month - 1, date), 'Abacus', []);

	return {
		props: {
			monthlyWorkouts,
			date: new Date(year, month - 1, date).toISOString(),
			workout,
		},
	};
};
