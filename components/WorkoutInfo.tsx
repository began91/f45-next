import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import styles from 'components/WorkoutInfo.module.css';
import React from 'react';
import cn from 'classnames';

interface WorkoutInfoType {
	useWorkout: [
		WorkoutType,
		React.Dispatch<React.SetStateAction<WorkoutType | undefined>>
	];
	workoutStyleList?: string[]; //providing the style list assumes an editable workout info is desired.
	getWeeklyWorkoutOn?(date: Date | string, backupStyle?: string): WorkoutType;
}

export default function WorkoutInfo({
	useWorkout: [workout, setWorkout],
	workoutStyleList,
	getWeeklyWorkoutOn,
}: WorkoutInfoType) {
	//change workout style from dropdown menu
	function setWorkoutStyle(e: React.ChangeEvent<HTMLElement>) {
		const target = e.target as HTMLSelectElement;
		// console.log(target.value);
		const newWorkout = CreateWorkout(workout.date, target.value, []);
		// console.log(newWorkout);
		setWorkout(newWorkout);
	}

	if (!workout) {
		workout = CreateWorkout(new Date(), 'Loading', []);
	}

	//reset any changes that have been made to the workout. If a workout already exists, reset to that. Otherwise reset to the current dropdown menu workout with default stations.
	function resetAll() {
		if (getWeeklyWorkoutOn) {
			setWorkout(getWeeklyWorkoutOn(workout.date, workout.style));
		}
	}

	// clear all the workout stations for new entries
	function clearAll() {
		const newStationList = workout.stationList.map((station, i) =>
			i < workout.stations ? '' : station
		);
		setWorkout({
			...workout,
			stationList: newStationList,
		});
	}

	//controlled components for each textarea element. Controls textarea resizing as well as text entry and individual clearing via the x button.
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
		setWorkout({
			...workout,
			stationList: newStationList,
		});
	};

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

	//providing the style list assumes an editable WorkoutInfo component is desired.
	const workoutStyleDisplay = workoutStyleList ? (
		<>
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
		</>
	) : (
		<>
			<b>Workout Style: </b>
			{workout.style}
		</>
	);

	const exerciseStationDisplay = workoutStyleList ? (
		<>
			<b>Exercises: </b>
			<button onClick={clearAll}>Clear Stations</button>
			<button onClick={resetAll}>Reset Workout</button>
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
		</>
	) : (
		<>
			<b className={styles.label}>Exercises:</b>
			<ol className={styles.stations} id="stationList">
				{workout.stationList
					.filter((station, i) => i < workout.stations)
					.map((station, i) => (
						<li
							key={i}
							className={cn(styles.station, styles.alternateGray)}
						>
							{station}
						</li>
					))}
			</ol>
		</>
	);

	return (
		<>
			{workoutStyleDisplay}
			<div className={styles.infoGrid}>
				{workoutStyleList ? (
					<></>
				) : (
					<>
						<b className={styles.label}>Date: </b>
						<div className={cn(styles.info, styles.span3)}>
							{new Date(workout.date).toLocaleString(undefined, {
								weekday: 'long',
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</div>
					</>
				)}
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
			{exerciseStationDisplay}
		</>
	);
}
