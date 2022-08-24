import Layout from 'components/Layout';
import NewCalendar from 'components/NewCalendar';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { areDatesEqual } from 'src/helpers/areDatesEqual';
import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
import utilStyles from 'styles/utils.module.css';
import React from 'react';
import {
	getAllWorkouts,
	getUniqueWorkoutStyles,
	getWorkoutByWeek,
} from 'lib/mongodb';
import WorkoutInfo from 'components/WorkoutInfo';

/*
Add Workouts Page
This page is meant to be used by the administrator as a way to add workouts to the database. Only workouts that have been previously uploaded to the database are available as options to be used for creating new workouts.

Additional functionality is described throughout the code.

The add workouts page is a dynamically routed, SSG page for days with specified dates and SSR fallback for days with no workout specified.

The optional dynamic route of format /YYYY/MM/DD allows the server to statically generate pages with a workout specified. If no route is specified, the page will load with today's date by default.

Future functionality - 
1. Admin only access. 
2. Parse Reddit.com/r/f45 workout intel page to automatically generate workouts instead of copying each station from the page. Either through an API request (harder) or through drag/drop (easier?)
*/

interface AddWorkoutType {
	weeklyWorkouts: WorkoutType[];
	ISOdate: string;
	workoutStyleList: string[];
}

export default function AddWorkout({
	weeklyWorkouts,
	workoutStyleList,
	ISOdate,
}: AddWorkoutType) {
	//find the weekly workout on the supplied date, or return undefined if none exists.
	function getWeeklyWorkoutOn(
		date: Date | string,
		backupStyle: string = 'Afterglow'
	) {
		const workout: WorkoutType =
			weeklyWorkouts.find(
				(dailyWorkout) =>
					dailyWorkout &&
					areDatesEqual(new Date(dailyWorkout.date), new Date(date))
			) || CreateWorkout(new Date(date), backupStyle, []);
		return workout;
	}

	//if SSG page, get the workout that matches the currently selected date, otherwise default to an Afterglow workout
	const [workout, setWorkout] = useState(getWeeklyWorkoutOn(ISOdate));

	//if the date changes (new calendar page selected), get the workout from that date, otherwise default to Afterglow
	useEffect(() => {
		setWorkout(getWeeklyWorkoutOn(ISOdate));
	}, [ISOdate, weeklyWorkouts]);

	//keep the input text areas to the correct size
	useEffect(() => {
		//https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
		const tx = document.getElementsByTagName('textarea');
		for (let i = 0; i < tx.length; i++) {
			tx[i].style.height = '0px';
			tx[i].setAttribute(
				'style',
				'height:' + (tx[i].scrollHeight + 2) + 'px;overflow-y:hidden;'
			);
		}
	});

	//post the workout as displayed to the database through a fetch request through the workouts API. Log the workout and results to the console for confirmation.
	async function postWorkout(e: React.MouseEvent<HTMLElement>) {
		e.preventDefault();
		const { style, date } = workout as WorkoutType;
		const stationList = workout.stationList.filter(
			(_, i) => i < workout.stations
		);
		const dbWorkout = { style, date: date, stationList };
		console.log('Posting workout:');
		console.log(dbWorkout);
		const response = await fetch('/api/workouts/', {
			method: 'POST',
			body: JSON.stringify(dbWorkout),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		console.log(data);
	}

	return (
		<Layout page="add-workout" date={new Date(ISOdate)}>
			<h2 className={utilStyles.headingMd}>Post Workout to Database:</h2>
			<NewCalendar date={new Date(ISOdate)} week={weeklyWorkouts} db />
			<WorkoutInfo
				useWorkout={[workout, setWorkout]}
				workoutStyleList={workoutStyleList}
				getWeeklyWorkoutOn={getWeeklyWorkoutOn}
			/>
			<button onClick={postWorkout}>Post Workout</button>
		</Layout>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	// const { getAllWorkouts } = require('lib/mongodb');
	const workouts = await getAllWorkouts();
	const paths = workouts.map((workout) => {
		const date = new Date(workout.date);
		return {
			params: {
				date: [
					String(date.getFullYear()),
					String(date.getMonth() + 1),
					String(date.getDate()),
				],
			},
		};
	});

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const newDate = new Date(); //default is today if no date is specified
	let year = newDate.getFullYear();
	let month = newDate.getMonth() + 1;
	let date = newDate.getDate();
	if (params?.date) {
		[year, month, date] = (params.date as string[]).map((a: string) =>
			Number(a)
		); //change to three separate params [year]/[month]/[date]
	}

	// const { getWorkoutByWeek, getUniqueWorkoutStyles } = require('lib/mongodb');
	let weeklyWorkouts = await getWorkoutByWeek(
		new Date(year, month - 1, date)
	);
	weeklyWorkouts = weeklyWorkouts.map((workout) =>
		workout
			? CreateWorkout(workout.date, workout.style, workout.stationList)
			: null
	);

	const workoutStyleList = await getUniqueWorkoutStyles();

	return {
		props: {
			workoutStyleList,
			weeklyWorkouts,
			ISOdate: new Date(year, month - 1, date).toISOString(),
		},
		revalidate: 1,
	};
};
