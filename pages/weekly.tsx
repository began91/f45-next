import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import { getWorkoutByDate } from '../src/helpers/lists';
import styles from '../styles/weekly.module.css';
import utilStyles from '../styles/utils.module.css';
import logos from '../public/workout-logos/workout-logos';
import Image from 'next/image';
import LinkIf from 'components/LinkIf';

function WeeklyWorkouts({ useDate: [date, setDate] }) {
    return date
        .getCalendar()
        .filter((week: Date[]) =>
            week.some(
                day =>
                    day.getDate() === date.getDate() &&
                    day.getMonth() === date.getMonth()
            )
        )[0]
        .map((day:Date, i:number) => <WorkoutBrief date={day} setDate={setDate} key={i} />);
}

function WorkoutBrief({ date, setDate }) {
    const workout = getWorkoutByDate(date);
    const isWorkout = (typeof workout !== "undefined")
    const datePathString=`/${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
    return (
        <LinkIf href={"/daily"+datePathString} isLink={isWorkout}>
            <div
                className={styles.workout}
                onClick={() => setDate(date)}
                title={workout?.displayStyle || "No workout"}
            >
                <h4 className={utilStyles.headerMd}>
                    {date.toLocaleString(undefined, { weekday: 'long' })}
                </h4>
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

export default function Weekly({ useDate }) {
    return (
        <Layout page="Week" date={useDate[0]}>
            <Calendar useDate={useDate} week />
            <WeeklyWorkouts useDate={useDate} />
        </Layout>
    );
}
