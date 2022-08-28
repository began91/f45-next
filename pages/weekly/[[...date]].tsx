import Layout from 'components/Layout';
import NewCalendar from 'components/NewCalendar';
import styles from 'styles/weekly.module.css';
import utilStyles from 'styles/utils.module.css';
import defaultLogo from 'public/workout-logos/defaultLogo.png';
import Image from 'next/image';
import LinkIf from 'components/LinkIf';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { getAllWorkouts, getWorkoutByWeek } from 'lib/mongodb';
import { areDatesEqual } from 'src/helpers/areDatesEqual';
import { Dispatch, SetStateAction, useEffect } from 'react';
// import { getAllWorkouts } from 'lib/mongodb';

interface WorkoutBriefType {
	workout: WorkoutType;
	date: Date;
}

function WorkoutBrief({ workout, date }: WorkoutBriefType) {
	const isWorkout = !!workout;

	const datePathString = `/${date.getUTCFullYear()}/${
		date.getUTCMonth() + 1
	}/${date.getUTCDate()}`;

	return (
		<LinkIf href={'/daily' + datePathString} isLink={isWorkout}>
			<div
				className={cn(styles.workout, {
					[styles.noWorkout]: !isWorkout,
				})}
				title={workout?.displayStyle || 'No workout'}
			>
				<h4 className={utilStyles.headerMd}>
					{date.toLocaleString(undefined, { weekday: 'long' })}
				</h4>
				<div className={styles.logoContainer}>
					<Image
						priority
						src={workout?.logo || defaultLogo}
						layout="responsive"
						alt="logo"
						className={styles.logo}
					/>
				</div>
				<div className={utilStyles.headerSm}>
					{isWorkout ? (
						<>
							<b>Style:</b> {workout.displayStyle} <br />
							<b>Stations:</b> {workout.stations} <br />
							<b>Duration: </b> {workout.durationDisplay}
						</>
					) : (
						'No Workout'
					)}
				</div>
			</div>
		</LinkIf>
	);
}

interface WeeklyType {
	weeklyWorkouts: WorkoutType[];
	date: Date;
	workout: WorkoutType;
	useWorkout: [WorkoutType, Dispatch<SetStateAction<WorkoutType>>];
}

export default function Weekly({
	weeklyWorkouts,
	date,
	workout,
	useWorkout,
}: WeeklyType) {
	// const selectedDate = new Date(year, month - 1, date);
	date = new Date(date);

	const setWorkout = useWorkout[1];

	useEffect(() => {
		setWorkout(workout);
	}, [workout, setWorkout]);
	const calendarWeek = date.getWeek();

	const router = useRouter();
	if (router.isFallback) {
		const fallDate = new Date();
		return (
			<Layout page="Week" date={fallDate}>
				Loading...
			</Layout>
		);
	}

	return (
		<Layout page="Week" date={date}>
			<NewCalendar week={weeklyWorkouts} date={date} />
			{weeklyWorkouts.map((workout: WorkoutType, i: number) => (
				<WorkoutBrief
					workout={workout}
					date={calendarWeek[i]}
					key={i}
				/>
			))}
		</Layout>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
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

	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const newDate = new Date(); //default is today if no date is specified
	let year = newDate.getUTCFullYear();
	let month = newDate.getUTCMonth() + 1;
	let date = newDate.getUTCDate();
	if (params?.date) {
		[year, month, date] = (params.date as string[]).map((a: string) =>
			Number(a)
		); //change to three separate params [year]/[month]/[date]
	}

	let weeklyWorkouts = await getWorkoutByWeek(
		new Date(year, month - 1, date)
	);
	weeklyWorkouts = weeklyWorkouts.map((workout) =>
		workout
			? CreateWorkout(workout.date, workout.style, workout.stationList)
			: null
	);

	const workout =
		weeklyWorkouts.find((workout) =>
			areDatesEqual(
				new Date(year, month - 1, date),
				new Date(workout?.date)
			)
		) || CreateWorkout(new Date(year, month - 1, date), 'Abacus', []);

	return {
		props: {
			weeklyWorkouts,
			date: new Date(year, month - 1, date).toISOString(),
			workout,
		},
	};
};
