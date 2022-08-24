import {
	useState,
	useEffect,
	useCallback,
	Dispatch,
	SetStateAction,
} from 'react';
import styles from '../styles/workout.module.css';
import Beep from '../src/helpers/Beep';
import ExitMenu from '../components/WorkoutScreen/ExitMenu';
import Timers from '../components/WorkoutScreen/Timers';
import SetBars from '../components/WorkoutScreen/SetBars';
import WorkoutStats from '../components/WorkoutScreen/WorkoutStats';
import TimeControls from '../components/WorkoutScreen/TimeControls';
import TimeCircle from '../components/WorkoutScreen/TimeCircle';
import SetDisplay from '../components/WorkoutScreen/SetDisplay';
import cn from 'classnames';
import Image from 'next/image';
import defaultLogo from 'public/workout-logos/defaultLogo.png';
import { WorkoutType } from 'src/helpers/CreateWorkout';

interface WorkoutScreenType {
	useWorkout: [
		WorkoutType,
		Dispatch<SetStateAction<WorkoutType | undefined>>
	];
	snd: HTMLAudioElement;
}

export default function WorkoutScreen({ useWorkout, snd }: WorkoutScreenType) {
	const workout = useWorkout[0];
	//state
	const [mainTimer, setMainTimer] = useState(0);
	const [isActive, setIsActive] = useState(true);
	const [currentSet, setCurrentSet] = useState(0);
	const [setTimer, setSetTimer] = useState(0);
	const [isComplete, setIsComplete] = useState(false);

	//derivatives of state
	const currentSetDuration = workout.timeList[workout.timeIndex[currentSet]];
	const isWork = workout.stationIndex[currentSet] < workout.stations;

	const endWorkout = useCallback(() => {
		setIsComplete(true);
		setIsActive(false);
		// router.push('/');
	}, [setIsComplete, setIsActive]);

	const updateActiveTimers = useCallback(() => {
		if (setTimer >= currentSetDuration - 1) {
			if (currentSet >= workout.numSets - 1) {
				endWorkout();
			}
			snd.src = Beep;
			snd.play();
			setCurrentSet((currentSet) => currentSet + 1);
			setSetTimer(-1);
		}
		setMainTimer((mainTimer) => mainTimer + 1);
		setSetTimer((setTimer) => setTimer + 1);
	}, [currentSetDuration, setTimer, currentSet, endWorkout, workout, snd]);

	useEffect(() => {
		// https://www.geeksforgeeks.org/create-a-stop-watch-using-reactjs/
		let interval: NodeJS.Timer | undefined;

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

	const resetWorkout = () => {
		setIsComplete(false);
		setMainTimer(0);
		setIsActive(true);
		setCurrentSet(0);
		setSetTimer(0);
	};

	return (
		<div
			className={cn(
				isWork ? styles.work : styles.rest,
				styles.workoutScreen
			)}
		>
			<ExitMenu endWorkout={endWorkout} />

			<div
				className={cn(
					styles.logoContainer,
					isWork ? styles.logoWork : styles.logoRest
				)}
			>
				<Timers
					workout={workout}
					currentSet={currentSet}
					mainTimer={mainTimer}
					setTimer={setTimer}
					isComplete={isComplete}
				/>
				<div className={styles.imgContainer}>
					<Image
						src={workout.logo ? workout.logo : defaultLogo}
						layout="responsive"
						alt="logo"
					/>
				</div>
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
				/>
			) : (
				<>
					<div
						className={styles.currentSet}
						onClick={handlePlayPause}
					>
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
