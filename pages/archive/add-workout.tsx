import Layout from 'components/Layout';
import React, { useState, useEffect } from 'react'; //configure to useRef vice passing events?
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import utilStyles from 'styles/utils.module.css';
import styles from 'styles/custom.module.css';
// import {
// 	workoutStyleList,
// 	getLastWorkoutByStyle,
// 	areDatesEqual,
// } from 'src/helpers/lists';
// import { getWorkoutByDate } from 'lib/mongodb';
import cn from 'classnames';
import NewCalendar from 'components/NewCalendar';
import useSWR from 'swr';
import { areDatesEqual } from 'src/helpers/lists';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function AddWorkout() {
	const [date, setDate] = useState(new Date());

	const [workout, setWorkout] = useState(CreateWorkout(date, 'Abacus', []));

	const { data, error } = useSWR('api/workouts', fetcher);

	useEffect(() => {
		//create a workout on the date specified
		console.log(date);
		defaultWorkout = CreateWorkout(date, 'Abacus', []);

		let workoutByDate = defaultWorkout;
		if (data) {
			console.log(data);
			workoutByDate = data.data.find((workout: WorkoutType) =>
				areDatesEqual(date, workout.date)
			);
		}
		setWorkout(workoutByDate || defaultWorkout);
		console.log('Just set workout to:');
		console.log(workout);
	}, [date, setWorkout, data]);

	if (error) {
		throw new Error(error);
	}
	if (!data) return <div>Loading...</div>;

	async function postWorkout(e: React.MouseEvent<HTMLElement>) {
		e.preventDefault();
		console.log('Posting workout:');
		console.log(workout);
		const { style, year, month, date } = workout;
		const stationList = workout.stationList.filter(
			(_, i) => i < workout.stations
		);
		const dbWorkout = { style, year, month, date, stationList };
		const response = await fetch('/api/workouts/', {
			method: 'POST',
			body: JSON.stringify(dbWorkout),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		console.log(data);
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

	function setWorkoutStyle(e: React.ChangeEvent<HTMLElement>) {
		//when style selected from dropdown, create empty workout of that style on the selected date
		const target = e.target as HTMLSelectElement;
		// const lastWorkoutByStyle = getLastWorkoutByStyle(target.value);
		const newWorkout = CreateWorkout(date, target.value, []);
		setWorkout(newWorkout);
	}

	const resetAll = () => {
		//reset all exercise station fields to the most recent workout.
		const newWorkout = CreateWorkout(date, workout.style, []);
		setWorkout(newWorkout);
	};

	const clearAll = () => {
		//set all the stations to empty string except the last two (rest stations)
		const newStationList = workout.stationList.map((station, i) =>
			i < workout.stations ? '' : station
		);
		setWorkout({ ...workout, stationList: newStationList }); //keep everything else about the station the same, only change stationList
	};

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

	const weekCalendar = date.getWeek();

	return (
		<Layout page="add-workout" date={date}>
			<h2 className={utilStyles.headingMd}>Post Workout to Database:</h2>
			<NewCalendar date={date} week db />
			<label htmlFor="workoutStyle">
				<b>Workout Style: </b>
			</label>
			<select
				name="workoutStyle"
				id="workoutStyle"
				value={workout?.displayStyle || undefined}
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
