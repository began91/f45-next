import React from 'react';

export default function TimeControls(props) {
    const workout = props.workout;
    const endWorkout = props.endWorkout;
    const [currentSet, setCurrentSet] = props.useCurrentSet;
    const [setTimer, setSetTimer] = props.useSetTimer;
    const isActive = props.isActive;

    const currentSetDuration = workout.timeList[workout.timeIndex[currentSet]];

    const incrementSet = e => {
        // if its the first (0) set and value =-1 => do nothing
        // else if its the last set and value=1 => end workout
        // else increment
        e.preventDefault();
        e.stopPropagation();
        // console.log('single')
        if (currentSet === 0 && +e.target.value === -1) {
        } else if (currentSet >= workout.numSets - 1 && +e.target.value === 1) {
            endWorkout();
        } else {
            goToSet(currentSet + +e.target.value);
        }
    };

    const incrementTime = e => {
        e.preventDefault();
        e.stopPropagation();

        const newTime = setTimer + 5 * +e.target.value;

        if (newTime > currentSetDuration - 1) {
            // time exceeds current set duration. go to next set
            if (currentSet >= workout.numSets) {
                endWorkout();
            }
            goToSet(currentSet + 1);
        } else if (newTime < 0) {
            setSetTimer(0);
        } else {
            //just change the current set timer
            setSetTimer(newTime);
        }
    };

    const goToSet = setNum => {
        setCurrentSet(setNum);
        setSetTimer(0);
    };

    return (
        <div className="time-controls">
            <button className="last-set" onClick={incrementSet} value={-1}>
                Last
                <br />
                &#x23EE;
                <br />
                Set
            </button>
            <button className="rewind" onClick={incrementTime} value={-1}>
                &#x23EA;&#xFE0E; 5s
            </button>
            <div className="play-pause">
                {isActive ? <>&#x23F8;</> : <>&#x23F5;</>}
            </div>
            <button className="fast-forward" onClick={incrementTime} value={1}>
                5s &#x23E9;&#xFE0E;
            </button>
            <button className="next-set" onClick={incrementSet} value={1}>
                Next
                <br />
                &#x23ED;
                <br />
                Set
            </button>
        </div>
    );
}
