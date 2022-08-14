import Layout from 'components/Layout';
import NewCalendar from 'components/NewCalendar';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { areDatesEqual } from 'src/helpers/areDatesEqual';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import utilStyles from 'styles/utils.module.css';
import styles from 'styles/custom.module.css';
import React from 'react';
import cn from 'classnames';
// import { useRouter } from 'next/router';

interface AddWorkoutType {
	weeklyWorkouts: WorkoutType[];
	ISOdate: string;
	workoutStyleList: string[];
}

export default function AddWorkout({
	weeklyWorkouts,
	workoutStyleList,
	ISOdate,
}: AddWorkoutType) {
	// const router = useRouter();
	// console.log(`isFallback: ${router.isFallback}`);
	// console.log(weeklyWorkouts);
	// console.log(workoutStyleList);
	// console.log(ISOdate);

	let date = new Date(ISOdate);

	const [workout, setWorkout] = useState(
		weeklyWorkouts.find(
			(dailyWorkout) =>
				dailyWorkout && areDatesEqual(new Date(dailyWorkout.date), date)
		) || CreateWorkout(date, 'Afterglow', [])
	);

	useEffect(() => {
		setWorkout(
			weeklyWorkouts.find(
				(dailyWorkout) =>
					dailyWorkout &&
					areDatesEqual(new Date(dailyWorkout.date), date)
			) || CreateWorkout(date, 'Afterglow', [])
		);
	}, [ISOdate]);

	useEffect(() => {
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

	//change workout style from dropdown menu
	function setWorkoutStyle(e: React.ChangeEvent<HTMLElement>) {
		const target = e.target as HTMLSelectElement;
		// console.log(target.value);
		const newWorkout = CreateWorkout(date, target.value, []);
		// console.log(newWorkout);
		setWorkout(newWorkout);
	}

	function resetAll() {
		setWorkout(CreateWorkout(date, workout.style, []));
	}

	function clearAll() {
		const newStationList = workout.stationList.map((station, i) =>
			i < workout.stations ? '' : station
		);
		setWorkout({ ...workout, stationList: newStationList });
	}

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.MouseEvent<HTMLButtonElement>
	) => {
		//auto resize text area and update state
		const target = e.target as HTMLTextAreaElement | HTMLButtonElement;
		if (target.tagName === 'TEXTAREA') {
			target.style.height = 'inherit';
			target.style.height = +target.scrollHeight - 5 + 'px';
		}
		const i = Number(target.id.split('_').pop());
		const newStationList = workout.stationList;
		newStationList[i] = target.value;
		setWorkout({ ...workout, stationList: newStationList });
	};

	async function postWorkout(e: React.MouseEvent<HTMLElement>) {
		e.preventDefault();
		const { style, date } = workout;
		const stationList = workout.stationList.filter(
			(_, i) => i < workout.stations
		);
		const dbWorkout = { style, date: date, stationList };
		console.log('Posting workout:');
		console.log(dbWorkout);
		const response = await fetch('/api/workouts/', {
			method: 'POST',
			body: JSON.stringify(dbWorkout),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		console.log(data);
		// if (!data.ok) {
		// 	throw new Error(data.lastErrorObject);
		// } else {
		// 	console.log('Success!');
		// 	console.log(data);
		// }
	}

	const workoutInfo = [
		'stations',
		'pods',
		'laps',
		'sets',
		'timing',
		'durationDisplay',
		'misc',
	];

	const workoutInfoLabels = [
		'Stations',
		'Pods',
		'Laps',
		'Sets',
		'Timing',
		'Duration',
		'Misc',
	];

	return (
		<Layout page="add-workout" date={date}>
			<h2 className={utilStyles.headingMd}>Post Workout to Database:</h2>
			<NewCalendar date={date} week={weeklyWorkouts} db />
			<label htmlFor="workoutStyle">
				<b>Workout Style: </b>
			</label>
			<select
				name="workoutStyle"
				id="workoutStyle"
				value={workout.style}
				onChange={setWorkoutStyle}
			>
				{workoutStyleList.map((workoutStyle) => (
					<option value={workoutStyle} key={workoutStyle}>
						{workoutStyle}
					</option>
				))}
			</select>
			<div className={styles.infoGrid}>
				{workoutInfo.map((info, i) => (
					<React.Fragment key={i}>
						<b className={styles.label} key={i}>
							{workoutInfoLabels[i]}
						</b>
						<div
							className={cn(styles.info, {
								[styles.span3]: i >= 4,
							})}
						>
							{workout[info]}
						</div>
					</React.Fragment>
				))}
			</div>
			<b>Exercises: </b>
			<button onClick={clearAll}>Clear Stations</button>
			<button onClick={resetAll}>Reset Stations</button>
			<ol className={styles.stations}>
				{workout.stationList
					.filter((_, i) => i < workout.stations)
					.map((station, i) => (
						<li className={styles.station} key={i}>
							<textarea
								rows={1}
								id={'station_' + i}
								value={station}
								onChange={handleChange}
								className={styles.stationInput}
							></textarea>
							<button
								value=""
								id={'station_' + i}
								className={styles.clearStation}
								onClick={handleChange}
								tabIndex={-1}
							>
								X
							</button>
						</li>
					))}
			</ol>

			<button onClick={postWorkout}>Post Workout</button>
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
		fallback: 'blocking',
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

	const { getWorkoutByWeek, getUniqueWorkoutStyles } = require('lib/mongodb');
	let weeklyWorkouts: WorkoutType[] = await getWorkoutByWeek(
		new Date(year, month - 1, date)
	);
	weeklyWorkouts = weeklyWorkouts.map((workout) =>
		!!workout
			? CreateWorkout(workout.date, workout.style, workout.stationList)
			: null
	);

	const workoutStyleList = await getUniqueWorkoutStyles();

	return {
		props: {
			workoutStyleList,
			weeklyWorkouts,
			ISOdate: new Date(year, month - 1, date).toISOString(),
		},
		revalidate: 1,
	};
};
