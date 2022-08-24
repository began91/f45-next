import React, { useState } from 'react';
import styles from './ExitMenu.module.css';
import cn from 'classnames';

interface ExitMenuType {
	endWorkout: () => void;
}

export default function ExitMenu({ endWorkout }: ExitMenuType) {
	const [pendingClose, setPendingClose] = useState(false);

	return (
		<div
			className={cn(styles.container, { [styles.closing]: pendingClose })}
		>
			{pendingClose ? (
				<>
					End Workout?
					<div
						onClick={() => setPendingClose(false)}
						className={cn(styles.resume, styles.button)}
					>
						Resume
					</div>
					<div
						onClick={() => {
							endWorkout();
							setPendingClose(false);
						}}
						className={cn(styles.end, styles.button)}
					>
						End
					</div>
				</>
			) : (
				<div
					onClick={() => setPendingClose(true)}
					className={styles.exit}
				>
					&#x2715;
				</div>
			)}
		</div>
	);
}
