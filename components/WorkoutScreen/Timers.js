import React from 'react';

export default function Timers(props) {
    const timeString = seconds => {
        return seconds >= 3600
            ? new Date(seconds * 1000).toISOString().substring(11, 19)
            : new Date(seconds * 1000).toISOString().substring(14, 19);
    };

    const remainingTime = props.workout.setDurationList
        .filter((_, i) => i >= props.currentSet)
        .reduce(
            (prev, setDuration) => {
                return +prev + +setDuration;
            },
            [-props.setTimer]
        );

    return (
        <div id="timers">
            <div id="elapsed-timer">Elapsed: {timeString(props.mainTimer)}</div>
            <div id="remaining-timer">
                Remaining: {timeString(props.isComplete ? 0 : remainingTime)}
            </div>
        </div>
    );
}
