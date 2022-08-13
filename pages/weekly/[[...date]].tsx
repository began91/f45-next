import Layout from 'components/Layout';
import NewCalendar from 'components/NewCalendar';
import styles from 'styles/weekly.module.css';
import utilStyles from 'styles/utils.module.css';
import logos from 'public/workout-logos/workout-logos';
import Image from 'next/image';
import LinkIf from 'components/LinkIf';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import cn from 'classnames';
// import { getAllWorkouts } from 'lib/mongodb';

interface WorkoutBriefType {
	workout: WorkoutType;
	date: Date;
}

function WorkoutBrief({ workout, date }: WorkoutBriefType) {
	const isWorkout = !!workout;

	const datePathString = `/${date.getFullYear()}/${
		date.getMonth() + 1
	}/${date.getDate()}`;

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
						src={workout?.logo || logos.defaultLogo}
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
}

export default function Weekly({ weeklyWorkouts, date }: WeeklyType) {
	// const selectedDate = new Date(year, month - 1, date);
	date = new Date(date);
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
			<NewCalendar
				calendarWeek={calendarWeek}
				week={weeklyWorkouts}
				date={date}
			/>
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
	const { getAllWorkouts } = require('lib/mongodb');
	const workouts = await getAllWorkouts();
	const paths = workouts.map((workout: WorkoutType) => {
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
		); //change to three separate params [year]/[month]/[date]
	}

	const { getWorkoutByWeek } = require('lib/mongodb');
	let weeklyWorkouts: WorkoutType[] = await getWorkoutByWeek(
		new Date(year, month - 1, date)
	);
	weeklyWorkouts = weeklyWorkouts.map((workout) =>
		!!workout
			? CreateWorkout(workout.date, workout.style, workout.stationList)
			: null
	);

	return {
		props: {
			weeklyWorkouts,
			date: new Date(year, month - 1, date).toISOString(),
		},
	};
};
