import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import { getWorkoutByDate } from '../src/helpers/lists';
import styles from '../styles/weekly.module.css';
import utilStyles from '../styles/utils.module.css';
import logos from '../public/workout-logos/workout-logos';
import Image from 'next/image';
import Link from 'next/link';

function WeeklyWorkouts({ useDate: [date, setDate] }) {
    return date
        .getCalendar()
        .filter(week =>
            week.some(
                day =>
                    day.getDate() === date.getDate() &&
                    day.getMonth() === date.getMonth()
            )
        )[0]
        .map((day, i) => <WorkoutBrief date={day} setDate={setDate} />);
}

function WorkoutBrief({ date, setDate }) {
    const workout = getWorkoutByDate(date);

    return (
        <Link href="/daily">
            <div className={styles.workout} onClick={() => setDate(date)}>
                <h4 className={utilStyles.headerMd}>
                    {date.toLocaleString(undefined, { weekday: 'long' })}
                </h4>
                <div className={styles.logoContainer}>
                    <Image
                        priority
                        src={workout.logo ? workout.logo : logos.defaultLogo}
                        layout="responsive"
                        alt="logo"
                        className={styles.logo}
                    />
                </div>
                <div className={utilStyles.headerSm}>
                    {workout.style ? (
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
        </Link>
    );
}

export default function Weekly({ useDate }) {
    return (
        <Layout>
            <Calendar useDate={useDate} week />
            <WeeklyWorkouts useDate={useDate} />
        </Layout>
    );
}
