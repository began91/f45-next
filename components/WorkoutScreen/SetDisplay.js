import styles from './SetDisplay.module.css';

export default function SetDisplay(props) {
    const workout = props.workout;
    const currentSet = props.currentSet;

    const isWork = workout.stationIndex[currentSet] < workout.stations;
    const currentStation =
        workout.stationList[workout.stationIndex[currentSet]];
    const nextStation =
        workout.stationList[workout.stationIndex[currentSet + 1]];
    const stayOrMove =
        currentSet === workout.stations ? 'Stay Here: ' : 'Next Station: ';

    return isWork ? (
        <div className={styles.workoutName}>{currentStation}</div>
    ) : (
        <div className={styles.workoutName}>
            {stayOrMove}
            <br />
            {nextStation}
        </div>
    );
}
