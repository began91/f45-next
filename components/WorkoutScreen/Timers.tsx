import styles from './Timers.module.css';

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
        <div>
            <div className={`${styles.timer} ${styles.left}`}>
                Elapsed: {timeString(props.mainTimer)}
            </div>
            <div className={`${styles.timer} ${styles.right}`}>
                Remaining: {timeString(props.isComplete ? 0 : remainingTime)}
            </div>
        </div>
    );
}
