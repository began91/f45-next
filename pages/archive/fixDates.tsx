import { getAllWorkouts } from 'lib/mongodb';
import { GetStaticProps } from 'next';
// import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';

export default function FixDates({ workouts }) {
	async function updateDate(date) {
		const result = await fetch('/api/updateDate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(date.toISOString()),
		});

		console.log(result);
		return result;
	}

	return workouts.map((workout) => {
		const newDate = new Date(workout.year, workout.month - 1, workout.date);
		return (
			<div>
				{workout.style}
				<br />
				{newDate.toLocaleString(undefined, {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				})}
				<br />
				<button onClick={() => updateDate(newDate)}>Update</button>
			</div>
		);
	});
}

export const getStaticProps: GetStaticProps = async () => {
	// const { getAllWorkouts } = require('lib/mongodb');
	const workouts = await getAllWorkouts();

	return {
		props: {
			workouts: workouts.filter(
				(workout) => typeof workout.date === 'number'
			),
		},
	};
};
