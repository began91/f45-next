import Layout from 'components/Layout';
import NewCalendar from 'components/NewCalendar';
import styles from 'styles/weekly.module.css';
import utilStyles from 'styles/utils.module.css';
import logos from 'public/workout-logos/workout-logos';
import Image from 'next/image';
import LinkIf from 'components/LinkIf';
import { WorkoutType } from 'src/helpers/CreateWorkout';

function WorkoutBrief({ workout, date, dayOfWeek }) {
	const isWorkout = !!workout;
	const daysOfWeek = [
		'Sun',
		'Mon',
		'Tues',
		'Wednes',
		'Thurs',
		'Fri',
		'Satur',
	].map((d) => d + 'day');
	const datePathString = `/${date.getFullYear()}/${
		date.getMonth() + 1
	}/${date.getDate()}`;

	return (
		<LinkIf href={'/daily' + datePathString} isLink={isWorkout}>
			<div
				className={styles.workout}
				title={workout?.displayStyle || 'No workout'}
			>
				<h4 className={utilStyles.headerMd}>{daysOfWeek[dayOfWeek]}</h4>
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

export default function Weekly({ week, year, month, date }) {
	const selectedDate = new Date(year, month - 1, date);

	return (
		<Layout page="Week" date={selectedDate}>
			<NewCalendar week={week} date={selectedDate} />
			{week.map((workout: WorkoutType, i: number) => (
				<WorkoutBrief
					workout={workout}
					date={selectedDate}
					dayOfWeek={i}
					key={i}
				/>
			))}
		</Layout>
	);
}

export async function getStaticPaths() {
	const { getAllWorkouts } = require('lib/mongodb');
	let workouts = await getAllWorkouts();
	let paths = workouts.map((workout: WorkoutType) => {
		let { year, month, date } = workout;
		return {
			params: {
				date: [String(year), String(month), String(date)],
			},
		};
	});

	paths.push({ params: { date: [''] } });

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
	let newDate = new Date(); //default is today if no date is specified
	let year = newDate.getFullYear();
	let month = newDate.getMonth();
	let date = newDate.getDate();
	if (params.date) {
		[year, month, date] = params.date.map((a: string) => Number(a));
	}

	const { getWorkoutByDate } = require('lib/mongodb');
	let week = await getWorkoutByDate(year, month, date, 'week');

	return {
		props: {
			week,
			year,
			month,
			date,
		},
	};
}
