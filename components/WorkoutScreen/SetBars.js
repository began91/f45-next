import React from 'react';

export default function SetBars(props) {
    const [currentSet, setCurrentSet] = props.useCurrentSet;
    const [setTimer, setSetTimer] = props.useSetTimer;
    const workout = props.workout;

    const currentSetDuration = workout.timeList[workout.timeIndex[currentSet]];
    const percentComplete = (setTimer / currentSetDuration) * 100;

    const displayCurrentSet = workout.stationIndex
        .filter((sI, i) => i < currentSet)
        .filter(sI => sI < workout.stations).length;

    const goToSet = setNum => {
        setCurrentSet(setNum);
        setSetTimer(0);
    };

    const setBars = workout.stationIndex
        .map((sI, i) => {
            const isCurrentSet = i === currentSet;
            const style = { flexGrow: workout.setDurationList[i] };

            if (isCurrentSet) {
                style.background = `linear-gradient(to right , green 0% ${percentComplete}%, white ${percentComplete}%)`;
            }

            const isComplete = i < currentSet;
            return sI < workout.stations ? (
                <div
                    className={`set-bar2-${isComplete} current-${isCurrentSet}`}
                    key={i}
                    onClick={() => goToSet(i)}
                    style={style}
                ></div>
            ) : (
                ''
            );
        })
        .filter(result => result !== '');

    return (
        <div className="set-container">
            <div className="set-counter">
                Set:{' '}
                {displayCurrentSet >= setBars.length
                    ? setBars.length
                    : displayCurrentSet + 1}
                /{setBars.length}
            </div>
            <div className="set-bars">{setBars}</div>
        </div>
    );
}
