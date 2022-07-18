import React from 'react';
import CustomWorkoutSetup from './CustomWorkoutSetup.js';
import WorkoutByDateSetup from './WorkoutByDateSetup.js';
import SetupOptions from './SetupOptions';
import './SetupScreen.css';
import Beep from '../helpers/Beep.js';

export default function SetupScreen(props) {

    return (
        <div id="setupScreen">
            <SetupOptions useView={props.useView}/>
            
            {props.useView[0]==='custom' ? 
            (<CustomWorkoutSetup useWorkouts={props.useWorkouts}/>) 
            : 
            (<WorkoutByDateSetup useWorkouts={props.useWorkouts}/>)
            }

            <button id="startWorkout" onClick={()=>{
                props.setWorkoutStatus(true);
                props.snd.src = Beep;
                props.snd.play();
                }} disabled={!props.useWorkouts[0][props.useView[0]].stationList}>Start Workout</button>
        </div>        
    )
}

