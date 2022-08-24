import styles from './SetBars.module.css';
import cn from 'classnames';
import { WorkoutType } from 'src/helpers/CreateWorkout';
import { Dispatch, SetStateAction } from 'react';
import CSS from 'csstype';

interface SetBarsType {
	workout: WorkoutType;
	useCurrentSet: [number, Dispatch<SetStateAction<number>>];
	useSetTimer: [number, Dispatch<SetStateAction<number>>];
}

export default function SetBars({
	workout,
	useCurrentSet: [currentSet, setCurrentSet],
	useSetTimer: [setTimer, setSetTimer],
}: SetBarsType) {
	const currentSetDuration = workout.timeList[workout.timeIndex[currentSet]];
	const percentComplete = (setTimer / currentSetDuration) * 100;

	const displayCurrentSet = workout.stationIndex
		.filter((sI: number, i: number) => i < currentSet)
		.filter((sI) => sI < workout.stations).length;

	const goToSet = (setNum: number) => {
		setCurrentSet(setNum);
		setSetTimer(0);
	};

	const setBars = workout.stationIndex
		.map((sI, i) => {
			const isCurrentSet = i === currentSet;
			const style: CSS.Properties = {
				flexGrow: workout.setDurationList[i],
			};

			if (isCurrentSet) {
				style.background = `linear-gradient(to right , green 0% ${percentComplete}%, white ${percentComplete}%)`;
			}

			const isComplete = i < currentSet;

			return sI < workout.stations ? (
				<div
					className={cn(styles.setBar, {
						[styles.complete]: isComplete,
						// [styles.currentSet]: isCurrentSet,
					})}
					// `set-bar2-${isComplete} current-${isCurrentSet}`}
					key={i}
					onClick={() => goToSet(i)}
					style={style}
				></div>
			) : (
				''
			);
		})
		.filter((result) => result !== '');

	return (
		<div className={styles.setContainer}>
			<div>
				Set:{' '}
				{displayCurrentSet >= setBars.length
					? setBars.length
					: displayCurrentSet + 1}
				/{setBars.length}
			</div>
			<div className={styles.setBars}>{setBars}</div>
		</div>
	);
}
