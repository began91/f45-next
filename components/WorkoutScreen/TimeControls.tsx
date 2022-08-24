import React, { Dispatch, SetStateAction } from 'react';
import { WorkoutType } from 'src/helpers/CreateWorkout';
import styles from './TimeControls.module.css';

interface TimeControlsType {
	workout: WorkoutType;
	endWorkout: () => void;
	useCurrentSet: [number, Dispatch<SetStateAction<number>>];
	useSetTimer: [number, Dispatch<SetStateAction<number>>];
	isActive: boolean;
}

export default function TimeControls({
	workout,
	endWorkout,
	useCurrentSet: [currentSet, setCurrentSet],
	useSetTimer: [setTimer, setSetTimer],
	isActive,
}: TimeControlsType) {
	const currentSetDuration = workout.timeList[workout.timeIndex[currentSet]];

	const incrementSet = (e: React.MouseEvent<HTMLButtonElement>) => {
		// if its the first (0) set and value =-1 => do nothing
		// else if its the last set and value=1 => end workout
		// else increment
		const target = e.target as HTMLButtonElement;
		e.preventDefault();
		e.stopPropagation();
		// console.log('single')
		if (currentSet >= workout.numSets - 1 && +target.value === 1) {
			//if on the last set and trying to advance, end workout
			endWorkout();
		} else if (currentSet !== 0 || +target.value === 1) {
			//prevent change if on the current set and trying to go backwards. (DeMorgans Laws)
			goToSet(currentSet + +target.value);
		}
	};

	const incrementTime = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		e.preventDefault();
		e.stopPropagation();

		const newTime = setTimer + 5 * +target.value;

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

	const goToSet = (setNum: number) => {
		setCurrentSet(setNum);
		setSetTimer(0);
	};

	return (
		<div className={styles.controls}>
			<button onClick={incrementSet} value={-1}>
				Last
				<br />
				&#x23EE;
				<br />
				Set
			</button>
			<button onClick={incrementTime} value={-1}>
				&#x23EA;&#xFE0E; 5s
			</button>
			<div className={styles.pause}>
				{isActive ? <>&#x23F8;</> : <>&#x23F5;</>}
			</div>
			<button onClick={incrementTime} value={1}>
				5s &#x23E9;&#xFE0E;
			</button>
			<button onClick={incrementSet} value={1}>
				Next
				<br />
				&#x23ED;
				<br />
				Set
			</button>
		</div>
	);
}
