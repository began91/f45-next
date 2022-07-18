import React from 'react';

export default function WorkoutStats(props) {
    const timeString = seconds => {
        return seconds >= 3600
            ? new Date(seconds * 1000).toISOString().substring(11, 19)
            : new Date(seconds * 1000).toISOString().substring(14, 19);
    };

    return (
        <div className="workout-stats">
            Workout Complete!
            <br />
            Total Time: {timeString(props.mainTimer)}
            <br />
            <button onClick={props.resetWorkout}>Reset Workout</button>
            <button onClick={() => props.setWorkoutStatus(false)}>
                Return to Menu
            </button>
        </div>
    );
}
