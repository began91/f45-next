import React, { useState, useEffect, useCallback } from 'react';
import './WorkoutScreen.css';
import Beep from '../../helpers/Beep.js';
import ExitMenu from './ExitMenu';
import Timers from './Timers';
import SetBars from './SetBars';
import WorkoutStats from './WorkoutStats';
import TimeControls from './TimeControls';
import TimeCircle from './TimeCircle';
import SetDisplay from './SetDisplay';

export default function WorkoutScreen(props) {
    const workout = props.workout;
    //state
    const [mainTimer, setMainTimer] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [currentSet, setCurrentSet] = useState(0);
    const [setTimer, setSetTimer] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    //derivatives of state
    let currentSetDuration = workout.timeList[workout.timeIndex[currentSet]];
    let isWork = workout.stationIndex[currentSet] < workout.stations;

    const endWorkout = useCallback(() => {
        setIsComplete(true);
        setIsActive(false);
    }, [setIsComplete, setIsActive]);

    const updateActiveTimers = useCallback(() => {
        if (setTimer >= currentSetDuration - 1) {
            if (currentSet >= workout.numSets - 1) {
                endWorkout();
            }
            props.snd.src = Beep;
            props.snd.play();
            setCurrentSet(currentSet => currentSet + 1);
            setSetTimer(-1);
        }
        setMainTimer(mainTimer => mainTimer + 1);
        setSetTimer(setTimer => setTimer + 1);
    }, [
        currentSetDuration,
        setTimer,
        currentSet,
        endWorkout,
        workout,
        props.snd,
    ]);

    useEffect(() => {
        // https://www.geeksforgeeks.org/create-a-stop-watch-using-reactjs/
        let interval = null;

        if (currentSet >= workout.numSets) {
            endWorkout();
        }

        if (isActive) {
            interval = setInterval(updateActiveTimers, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, updateActiveTimers, currentSet, workout, endWorkout]);

    const handlePlayPause = () => {
        setIsActive(!isActive);
    };

    const resetWorkout = e => {
        setIsComplete(false);
        setMainTimer(0);
        setIsActive(true);
        setCurrentSet(0);
        setSetTimer(0);
    };

    return (
        <div id="workout-screen" className={isWork ? 'work' : 'rest'}>
            {isActive ? <ExitMenu endWorkout={endWorkout} /> : ''}

            <div id="logo-container">
                <Timers
                    workout={workout}
                    currentSet={currentSet}
                    mainTimer={mainTimer}
                    setTimer={setTimer}
                    isComplete={isComplete}
                />
                <img src={workout.logo} className="logo" alt="logo" />
                <SetBars
                    workout={workout}
                    useCurrentSet={[currentSet, setCurrentSet]}
                    useSetTimer={[setTimer, setSetTimer]}
                />
            </div>

            {isComplete ? (
                <WorkoutStats
                    mainTimer={mainTimer}
                    resetWorkout={resetWorkout}
                    setWorkoutStatus={props.setWorkoutStatus}
                />
            ) : (
                <>
                    <div className="current-set" onClick={handlePlayPause}>
                        {/* https://www.youtube.com/watch?v=mSfsGTIQlxg */}
                        <TimeCircle
                            isWork={isWork}
                            currentSetDuration={currentSetDuration}
                            setTimer={setTimer}
                        />
                        <SetDisplay workout={workout} currentSet={currentSet} />

                        <TimeControls
                            workout={workout}
                            endWorkout={endWorkout}
                            useCurrentSet={[currentSet, setCurrentSet]}
                            useSetTimer={[setTimer, setSetTimer]}
                            isActive={isActive}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
