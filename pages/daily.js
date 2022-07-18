import Layout from '../components/Layout';
import Link from 'next/link';
import { getWorkoutByDate } from '../src/helpers/lists';
import styles from '../styles/daily.module.css';
import utilStyles from '../styles/utils.module.css';

export default function daily({ useDate: [date, setDate] }) {
    const workout = getWorkoutByDate(date);
    const workoutInfo = [
        'displayStyle',
        'stations',
        'pods',
        'laps',
        'sets',
        'timing',
        'durationDisplay',
        'misc',
    ];
    const workoutInfoLabels = [
        'Style',
        'Stations',
        'Pods',
        'Laps',
        'Sets',
        'Timing',
        'Duration',
        'Misc',
    ];
    console.log(workout.stationList);
    return (
        <Layout>
            <div className={styles.infoGrid}>
                <div className={styles.label}>Date: </div>
                <div className={styles.info}>
                    {date.toLocaleString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>

                {workoutInfo.map((info, i) => (
                    <>
                        <div className={styles.label}>
                            {workoutInfoLabels[i]}:{' '}
                        </div>
                        <div className={styles.info}>{workout[info]}</div>
                    </>
                ))}
            </div>
            <label htmlFor="stationList" className={styles.label}>
                Exercises:{' '}
            </label>
            <ol className={styles.info} id="stationList">
                {workout.stationList
                    .filter((station, i) => i < workout.stations)
                    .map((station, i) => (
                        <li key={i}>{station}</li>
                    ))}
            </ol>
            <Link href="/custom">
                <button>Create a custom workout using this format-&gt;</button>
            </Link>
        </Layout>
    );
}
