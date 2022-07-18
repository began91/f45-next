//import logo from './logo.svg';
import React, {useState} from 'react';
import './App.css';
// import MyTimer from './components/MyTimer.js';
import WorkoutScreen from './components/WorkoutScreen/WorkoutScreen.js';
import SetupScreen from './components/SetupScreen';
import {getWorkoutByDate} from './helpers/lists.js';
// import Beep from './helpers/Beep.js';


export default function App(props) {
  const [workoutStatus, setWorkoutStatus] = useState(false);
  const useSetupView = useState('byDate');
  const snd = useState(new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"))

  const useWorkouts = useState({
    byDate: getWorkoutByDate(new Date()),
    custom: getWorkoutByDate(new Date())})

  // snd.autoplay = true;
  // snd.src = ;
  // snd.src = Beep;
  
  return (
    <div className="App">
      <div id="mainScreen">
        {workoutStatus ? 
        (<WorkoutScreen setWorkoutStatus={setWorkoutStatus} workout={useWorkouts[0][useSetupView[0]]} snd={snd[0]}/>) : 
        (<SetupScreen setWorkoutStatus={setWorkoutStatus} useWorkouts={useWorkouts} useView={useSetupView} snd={snd[0]}/>)}
      </div>

    </div>
  );
}

