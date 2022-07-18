import React from 'react';
import { workoutStyleList, getLastWorkoutByStyle } from '../helpers/lists';
import CreateWorkout from '../helpers/CreateWorkout.js';
import WorkoutInfo from './WorkoutInfo.js';

export default function CustomWorkoutSetup(props) {

    const [workouts, setWorkouts] = props.useWorkouts;
    const workout = workouts.custom;

    function setWorkoutStyle(e) {
        let newDate = new Date();
        let lastWorkoutByStyle = getLastWorkoutByStyle(e.target.value);
        let newWorkout = CreateWorkout(newDate.getFullYear(), newDate.getMonth()+1, newDate.getDate(),e.target.value,lastWorkoutByStyle.stationList.filter((_,i)=>i<lastWorkoutByStyle.stations));
        console.log(newWorkout);
        setWorkouts({...workouts, custom: newWorkout});
    }

    return (
        <div id="customWorkoutSetup">
            Custom Workout Setup <br/>
            <label htmlFor='workoutStyle'>Workout Style: </label>
            <select name='workoutStyle' id='workoutStyle' onChange={setWorkoutStyle} value={workout.displayStyle}>
                {workoutStyleList.map(workoutStyle => {
                    return (<option value={workoutStyle} key={workoutStyle}>{workoutStyle}</option>)
                })}    
            </select>
            <WorkoutInfo useWorkouts={props.useWorkouts} view='custom'/>
        </div>        
    )
}
