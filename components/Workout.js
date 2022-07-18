import React from 'react';

export default function Workout(props) {


    return (
        <div className="workout">
            <div className="workout-title">
                {props.workout.style}
            </div>
            <div className="workout-stations">
                {props.workout.stations}
            </div>
        </div>
    )
}