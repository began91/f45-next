import { WorkoutType } from 'src/helpers/CreateWorkout';
import styles from './Timers.module.css';

interface TimersType {
	workout: WorkoutType;
	currentSet: number;
	mainTimer: number;
	setTimer: number;
	isComplete: boolean;
}

export default function Timers({
	workout,
	currentSet,
	setTimer,
	mainTimer,
	isComplete,
}: TimersType) {
	const timeString = (seconds: number) => {
		return seconds >= 3600
			? new Date(seconds * 1000).toISOString().substring(11, 19)
			: new Date(seconds * 1000).toISOString().substring(14, 19);
	};

	const remainingTime = workout.setDurationList
		.filter((_, i) => i >= currentSet)
		.reduce((prev: number, setDuration: number) => {
			return prev + setDuration;
		}, -setTimer);

	return (
		<div>
			<div className={`${styles.timer} ${styles.left}`}>
				Elapsed: {timeString(mainTimer)}
			</div>
			<div className={`${styles.timer} ${styles.right}`}>
				Remaining: {timeString(isComplete ? 0 : remainingTime)}
			</div>
		</div>
	);
}
