import styles from './TimeCircle.module.css';

interface TimeCircleType {
	isWork: boolean;
	currentSetDuration: number;
	setTimer: number;
}

export default function TimeCircle({
	isWork,
	currentSetDuration,
	setTimer,
}: TimeCircleType) {
	const percentComplete = (setTimer / currentSetDuration) * 100;

	const timeStringSec = (seconds: number) => {
		return seconds >= 60
			? new Date(seconds * 1000).toISOString().substring(14, 19)
			: seconds;
	};

	return (
		<div className={styles.setTimer}>
			<div className={styles.outer}>
				<div
					className={styles.inner}
					style={{
						backgroundColor: isWork ? 'green' : 'red',
					}}
				>
					<div className={styles.setTime}>
						{timeStringSec(currentSetDuration - setTimer)}
					</div>
				</div>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				width="200px"
				height="200px"
				className={styles.svg}
				style={{
					strokeDashoffset: (percentComplete * 565) / 100,
				}}
			>
				<defs>
					<linearGradient id="GradientColor">
						<stop offset="0%" stopColor="aqua" />
						<stop offset="100%" stopColor="orange" />
					</linearGradient>
				</defs>
				<circle
					className={styles.circle}
					cx="100"
					cy="100"
					r="90"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	);
}
