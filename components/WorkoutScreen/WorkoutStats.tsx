import Link from 'next/link';
import styles from './WorkoutStats.module.css';

interface WorkoutStatsType {
	mainTimer: number;
	resetWorkout: () => void;
}

export default function WorkoutStats({
	mainTimer,
	resetWorkout,
}: WorkoutStatsType) {
	const timeString = (seconds: number) => {
		return seconds >= 3600
			? new Date(seconds * 1000).toISOString().substring(11, 19)
			: new Date(seconds * 1000).toISOString().substring(14, 19);
	};

	return (
		<div className={styles.container}>
			Workout Complete!
			<br />
			Total Time: {timeString(mainTimer)}
			<br />
			<button onClick={resetWorkout}>Reset Workout</button>
			<Link href="/">
				<button>Return to Menu</button>
			</Link>
		</div>
	);
}
