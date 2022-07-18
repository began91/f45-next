// import React from 'react';
// import './DaySquare.css'
import { getWorkoutByDate, workoutsByDate } from '../src/helpers/lists';
// import logos from

export default function DaySquare(props) {
    const date = props.date;
    const [workouts, setWorkouts] = props.useWorkouts;

    const workout = getWorkoutByDate(date);

    const logo = workout.logo ? workout.logo : defaultLogo;

    const noWorkout = workout ? '' : ' no-workout';

    return (
        <div
            className={props.activeDay + ' daySquare'}
            title={workout.displayStyle}
            onClick={() => setWorkouts({ ...workouts, byDate: workout })}
        >
            <div className="weekday">
                {date.toLocaleString(undefined, { weekday: 'short' })}
            </div>
            <div className={noWorkout}>
                <div className="day">
                    {date.toLocaleString(undefined, { day: 'numeric' })}
                </div>
                <div className="date-logo">
                    <img src={logo} alt="logo" className="datePickerLogo" />
                </div>
            </div>
        </div>
    );
}
