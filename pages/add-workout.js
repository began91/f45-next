import Layout from 'components/Layout';
import React, { useState, useEffect, useRef } from 'react';
import CreateWorkout from 'src/helpers/CreateWorkout';
import utilStyles from 'styles/utils.module.css';
import styles from 'styles/custom.module.css';
import { workoutStyleList, getLastWorkoutByStyle, getWorkoutByDate } from 'src/helpers/lists';
import cn from 'classnames';
import Link from 'next/link';
import Calendar from 'components/Calendar';

export default function AddWorkout() {
    const [date, setDate] = useState(new Date());
    const [workout, setWorkout] = useState(
        CreateWorkout(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            workoutStyleList[0],
            []
        )
    );

    async function postWorkout(e) {
        e.preventDefault();
        console.log('Posting workout:')
        console.log(workout)
        const response = await fetch('/api/workouts/', {
            method: 'POST',
            body: JSON.stringify(workout),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(data)

    }

    const workoutInfo = [
        'stations',
        'pods',
        'laps',
        'sets',
        'timing',
        'durationDisplay',
        'misc'
    ];

    const workoutInfoLabels = [
        'Stations',
        'Pods',
        'Laps',
        'Sets',
        'Timing',
        'Duration',
        'Misc'
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

    useEffect(() => {
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

    useEffect(()=>{
        let newWorkout = getWorkoutByDate(date);
        if (!newWorkout.stations) {
            const style = workoutStyleList[0];
            const lastWorkoutByStyle = getLastWorkoutByStyle(style)
            newWorkout = CreateWorkout(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                style,
                lastWorkoutByStyle.stationList.filter(
                    (_, i) => i < lastWorkoutByStyle.stations
                )
            );
        }
        setWorkout(newWorkout);
    },[date])

    return (
        <Layout page="add-workout" date={date}>
            <h2 className={utilStyles.headingMd}>Post Workout to Database:</h2>
            <Calendar useDate={[date, setDate]} week db />
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

            <button onClick={postWorkout}>Post Workout</button>
        </Layout>
    );
}
