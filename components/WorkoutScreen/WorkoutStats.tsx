import Link from 'next/link';
import styles from './WorkoutStats.module.css';

export default function WorkoutStats(props) {
    const timeString = seconds => {
        return seconds >= 3600
            ? new Date(seconds * 1000).toISOString().substring(11, 19)
            : new Date(seconds * 1000).toISOString().substring(14, 19);
    };

    return (
        <div className={styles.container}>
            Workout Complete!
            <br />
            Total Time: {timeString(props.mainTimer)}
            <br />
            <button onClick={props.resetWorkout}>Reset Workout</button>
            <Link href="/">
                <button>Return to Menu</button>
            </Link>
        </div>
    );
}
