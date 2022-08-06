import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
    workoutStyleList,
    getWorkoutByDate,
    getLastWorkoutByStyle,
} from '../src/helpers/lists';
import CreateWorkout from '../src/helpers/CreateWorkout';
import utilStyles from '../styles/utils.module.css';
import styles from '../styles/custom.module.css';
import cn from 'classnames';
import Link from 'next/link';
import {useSession} from 'next-auth/react';

export default function Custom({ useDate: [date, setDate],useWorkout: [workout, setWorkout], snd }) {
    // const [workout, setWorkout] = useState(getWorkoutByDate(date));
    const {data: session, status} = useSession();

    const workoutInfo = [
        'stations',
        'pods',
        'laps',
        'sets',
        'timing',
        'durationDisplay',
    ];

    const workoutInfoLabels = [
        'Stations',
        'Pods',
        'Laps',
        'Sets',
        'Timing',
        'Duration',
    ];

    function setWorkoutStyle(e) {
        let newDate = new Date();
        let lastWorkoutByStyle = getLastWorkoutByStyle(e.target.value);
        let newWorkout = CreateWorkout(
            newDate.getFullYear(),
            newDate.getMonth() + 1,
            newDate.getDate(),
            e.target.value,
            lastWorkoutByStyle.stationList.filter(
                (_, i) => i < lastWorkoutByStyle.stations
            )
        );
        setWorkout(newWorkout);
    }

    const resetAll = e => {
        let lastWorkoutByStyle = getLastWorkoutByStyle(workout.style);
        let newWorkout = CreateWorkout(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            workout.style,
            lastWorkoutByStyle.stationList.filter(
                (_, i) => i < lastWorkoutByStyle.stations
            )
        );
        setWorkout(newWorkout);
    };

    const clearAll = e => {
        let newStationList = workout.stationList.map((station, i) =>
            i < workout.stations ? '' : station
        );
        setWorkout({ ...workout, stationList: newStationList });
    };

    const handleChange = e => {
        if (e.target.tagName === 'TEXTAREA') {
            e.target.style.height = 'inherit';
            e.target.style.height = +e.target.scrollHeight - 5 + 'px';
        }
        let i = e.target.id.split('_').pop();
        let newStationList = workout.stationList;
        newStationList[i] = e.target.value;
        setWorkout({ ...workout, stationList: newStationList });
    };

    async function startWorkout() {
        snd.play()
        let postWorkout = workout;
        postWorkout.logo = null;
        if (status === 'authenticated') {
            const {user} = session;
            //get the user id? perhaps the user id should be stored in the session. We'll use email for now.
            postWorkout.user = user.email;
        }
        //use the current workout
        //get the user if authentiicated
        //post the workout to userWorkouts, referenced to the user._id
        const response = await fetch('api/userWorkouts',{
            method: 'POST',
            body: JSON.stringify(postWorkout),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json();
        console.log(data);

        
    }

    useEffect(() => {//resize textareas to content
        //https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
        const tx = document.getElementsByTagName('textarea');
        for (let i = 0; i < tx.length; i++) {
            tx[i].style.height = '0px';
            tx[i].setAttribute(
                'style',
                'height:' + (tx[i].scrollHeight + 2) + 'px;overflow-y:hidden;'
            );
        }
    });

    return (
        <Layout page="Custom" date={date}>
            <h2 className={utilStyles.headingMd}>Create Custom Workout:</h2>
            <label htmlFor="workoutStyle">
                <b>Workout Style: </b>
            </label>
            <select
                name="workoutStyle"
                id="workoutStyle"
                value={workout.displayStyle}
                onChange={setWorkoutStyle}
            >
                {workoutStyleList.map(workoutStyle => (
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
                                type="search"
                                rows="1"
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
                                tabIndex="-1"
                            >
                                X
                            </button>
                        </li>
                    ))}
            </ol>
            <Link href="/workout">
                <button onClick={startWorkout}>Start Workout</button>
            </Link>
        </Layout>
    );
}
