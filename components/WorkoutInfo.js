import React, {useEffect} from 'react';
import './WorkoutInfo.css';
// import {getWorkoutByDate} from '../helpers/lists.js';
// import StationList from './StationList.js';

export default function WorkoutInfo(props) {
    const [workouts,setWorkouts] = props.useWorkouts;
    const workout = workouts[props.view];

    const handleChange = (e) => {
        if (e.target.tagName==='LI') {
            e.target.style.height = 'inherit';
            e.target.style.height = (+e.target.scrollHeight-5) + 'px';
        }
        let i = e.target.id.split('_').pop();
        let newStationList = workout.stationList;
        newStationList[i] = e.target.value;
        setWorkouts({...workouts, [props.view]: {...workout, stationList: newStationList}})
    }

    const clearAll = e => {
        let newStationList = workout.stationList.map((station,i)=>i<workout.stations?'':station)
        setWorkouts({...workouts, [props.view]: {...workout, stationList: newStationList}})
    }

    useEffect(()=>{
        //https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
        const tx = document.getElementsByTagName('textarea');
        for (let i=0; i< tx.length; i++) {
            tx[i].style.height = '0px';
            tx[i].setAttribute('style','height:' + (tx[i].scrollHeight-5) + 'px;overflow-y:hidden;'); 
        }
    })

    return !workout.stationList ? (
                <div className="noWorkoutInfo">No Workout For the Selected Date</div>
            ): 
            (<div id='workoutInfo'>
                <div className='workout-info-label'>Style: </div>
                <div id="workoutStyle" className='workout-info-data'>{workout.displayStyle}</div>
                <div className='workout-info-label'>Stations: </div>
                <div id="workoutStations" className='workout-info-data'>
                    {workout.stations}
                </div>
                <div className='workout-info-label'>Pods: </div>
                <div id="workoutPods" className='workout-info-data'>
                    {workout.pods}
                </div>
                <div className='workout-info-label'>Laps:</div>
                <div id="workoutLaps" className='workout-info-data'>
                    {workout.laps}
                </div>
                <div className='workout-info-label'>Sets: </div>
                <div id="workoutSets" className='workout-info-data'>
                    {workout.sets}
                </div>
                <div className='workout-info-label'>Timing: </div>
                <div id="workoutTiming" className='workout-info-data'>
                    {workout.timing}
                </div>
                <div className='workout-info-label'>Total Time: </div>
                <div id="totalTime" className='workout-info-data'>
                    {workout.durationDisplay}
                </div>
                <div className='workout-info-label'>Misc: </div>
                <div id="workoutMisc" className='workout-info-data'>
                    {workout.misc}
                </div>
                <ol id='stationList'>
                {props.view==='custom' ? (
                    <div>
                        Here's the most recent {workout.displayStyle} workout:
                    </div>
                ) : ''}
                <button className='clear-all' onClick={clearAll}>Clear All Stations</button>
                    {workout.stationList.filter((_,i)=>i<workout.stations).map((station,i)=>(
                        <li className='station-item' key={i}>
                            <textarea type='search' rows='1' id={'station_'+i} value={station} onChange={handleChange} className='station-input'></textarea>
                            <button value='' id={'station_'+i} className='clear-station' onClick={handleChange}>X</button>
                        </li>
                    ))}
                </ol>
            </div>)
}