import { WorkoutType } from 'src/helpers/CreateWorkout';
import styles from './SetDisplay.module.css';

interface SetDisplayType {
	workout: WorkoutType;
	currentSet: number;
}

export default function SetDisplay({ workout, currentSet }: SetDisplayType) {
	const isWork = workout.stationIndex[currentSet] < workout.stations;
	const currentStation =
		workout.stationList[workout.stationIndex[currentSet]];
	const nextStation =
		workout.stationList[workout.stationIndex[currentSet + 1]];
	const stayOrMove =
		workout.stationIndex[currentSet] === workout.stations
			? 'Stay Here: '
			: 'Next Station: ';

	return isWork ? (
		<div className={styles.workoutName}>{currentStation}</div>
	) : (
		<div className={styles.workoutName}>
			{stayOrMove}
			<br />
			{nextStation}
		</div>
	);
}
