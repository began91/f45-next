import React, { useEffect } from 'react';
import Layout from 'components/Layout';
// import { connectToDatabase } from 'lib/mongodb';
import CreateWorkout from 'src/helpers/CreateWorkout';
import styles from 'styles/daily.module.css';
import cn from 'classnames';
import Link from 'next/link';

export default function daily({ workout, useWorkout: [oldWorkout,setWorkout], useDate: [date,setDate] }) {
    
    useEffect(()=>{
        setWorkout(workout)
        setDate(new Date(workout.year,workout.month-1,workout.date));
    },[workout,setWorkout,setDate])
    
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

    return (
        <Layout page="Day" date={date}>
            <div className={styles.infoGrid}>
                <b className={styles.label}>Date: </b>
                <div className={cn(styles.info, styles.span3)}>
                    {date.toLocaleString(undefined, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>

                {workoutInfo.map((info, i) => (
                    <React.Fragment key={i}>
                        <b className={styles.label}>{workoutInfoLabels[i]}: </b>
                        <div
                            className={cn(styles.info, {
                                [styles.span3]: ![1, 2, 3, 4].includes(i),
                            })}
                        >
                            {workout[info]}
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <b htmlFor="stationList" className={styles.label}>
                Exercises:
            </b>
            <ol className={styles.info} id="stationList">
                {workout.stationList
                    .filter((station, i) => i < workout.stations)
                    .map((station, i) => (
                        <li key={i} className={styles.station}>
                            {station}
                        </li>
                    ))}
            </ol>
            <Link href="/custom">
                <button>Create a custom workout using this format-&gt;</button>
            </Link>
        </Layout>
    );
}

export async function getStaticPaths() {
    const { getAllWorkouts } = require('lib/mongodb');
    //get dates of all workouts from mongo and return as possible paths
    let workouts = await getAllWorkouts();
    let paths = workouts.map(workout => {
        let {year,month,date} = workout;
                return {
            params: {
                date: [`${year}`,`${month}`,`${date}`]
            },
        };
    });

        paths.push({params:{date: ['']}})
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({params}) {
    // console.log(typeof Workout);
    // use date to get workout from mongodb
    //default is today
    let newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth();
    let date = newDate.getDate();
    if (params.date) {//if a date was supplied, set that instead

     [year, month, date] = params.date;
    }


    const { getWorkoutByDate } = require('lib/mongodb');
    let workout = await getWorkoutByDate(year, month, date);
    // workout = CreateWorkout(2022, 7, 27, 'Bears', []);
    return {
        props: {
            workout,
        },
    };
}