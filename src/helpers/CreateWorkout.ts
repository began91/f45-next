import { StaticImageData } from 'next/image';
import images from 'public/workout-logos/workout-logos';

export interface WorkoutType {
	[key: string]: any;
	date: Date | string;
	style: string;
	displayStyle: string;
	stations: number;
	pods: number;
	laps: number;
	sets: number;
	timing: string;
	misc: string;
	timeList: number[];
	stationList: string[];
	stationIndex: number[];
	timeIndex: number[];
	logo: StaticImageData;
	numSets: number;
	setDurationList: number[];
	durationDisplay: string;
	_id?: string;
}

export default function WorkoutCreator(
	date: Date,
	workoutStyle: string,
	stationList: string[] = []
) {
	if (!date) {
		throw new Error('Date not supplied to WorkoutCreator');
	}
	if (!workoutStyle) {
		throw new Error('Workout style not supplied to WorkoutCreator');
	}

	let style = workoutStyle;
	let displayStyle = style;
	let stations: number = 1;
	let pods: number = 1;
	let laps: number = 1;
	let sets: number = 1;
	let timing = '';
	let misc = 'N/A';
	let timeList: number[] = [];
	let stationIndex: number[] = [];
	let timeIndex: number[] = [];
	let logo: StaticImageData = images[style] || images['defaultLogo'];
	let numSets = (sets: number, stations: number, laps: number) =>
		sets * stations * laps * 2 - 1;

	function standardStations(
		stations: number,
		pods: number,
		laps: number,
		sets: number
	) {
		//assumptions:
		// This calculation assumes a standard workout where pods are evenly split among the stations, laps describes the number of times within a pod, sets describes the number of times at that station each lap.
		let stationsPerPod = stations / pods;
		let stationIndex = Array.from(
			{ length: numSets(sets, stations, laps) },
			(_, i) => {
				let overallStation = Math.floor(i / (sets * 2));
				let pod = Math.floor(overallStation / (laps * stationsPerPod));
				let stationWithinPod = overallStation % stationsPerPod;
				let station = stationWithinPod + pod * stationsPerPod;

				station = i % 2 === 1 ? stations : station;
				station =
					i % (sets * 2) === sets * 2 - 1 ? stations + 1 : station;
				return station;
			}
		);
		// time index assumes the time for each station is constant (may be different for sets) and does not change with pods or laps. The time should be explicit within the timeList for each set and rest within the station. (eg, [20,10,20,10] vice [20,10])
		let timeIndex = Array.from(
			{ length: numSets(sets, stations, laps) },
			(_, i) => {
				return i % (sets * 2);
			}
		);
		return [stationIndex, timeIndex];
	}

	switch (workoutStyle) {
		case '3-peat':
			stations = 10;
			pods = 1;
			laps = 3;
			sets = 1;
			timing = '45/15';
			misc =
				'Target Reps to hit at each station. Keep track on score card. 2 minute water break between laps.';
			timeList = [45, 15, 120];
			[stationIndex, timeIndex] = standardStations(
				stations,
				pods,
				laps,
				sets
			);
			//insert 2 minute breaks between laps
			timeIndex[19] = 2;
			timeIndex[39] = 2;
			break;
		case 'Abacus':
			stations = 6;
			pods = 1;
			laps = 2;
			sets = 5;
			timing =
				'Lap1 - 20/10, 22/10, 24/10, 26/10, 28/15; Lap 2 - 28/10, 26/10, 24/10, 22/10, 20/15'; //timing changes per lap, no standard calc
			misc = 'No water breaks';
			timeList = [20, 10, 22, 10, 24, 10, 26, 10, 28, 10];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				if (i % 2 === 0) {
					//even is workout block
					stationIndex[i] = Math.floor(i / 10) % 6; //10 is sets*2 && 6 is stations
					if (i < numSets(sets, stations, laps) / 2) {
						timeIndex[i] = i % 10;
					} else {
						timeIndex[i] = 8 - (i % 10);
					}
				} else if (i % 10 === 9) {
					stationIndex[i] = stations + 1;
					timeIndex[i] = 9;
				} else {
					stationIndex[i] = stations;
					timeIndex[i] = i % 10;
				}
			}
			break;
		case 'Afterglow':
			stations = 9; // actually 9 where you do two different workouts
			pods = 1;
			laps = 3;
			sets = 1;
			timing = '3 Laps: 60/30 60/30 30/20'; // timing changes with laps, no standard timing
			timeList = [60, 30, 60, 30, 30, 20];
			misc =
				'Combo stations. Left exercise reps: 10-9-8-... with one rep of the right workout in between';
			//Cardio workout built with a ladder style combination sequence. Work as far down the ladder as you can. The combo stations will get your heart rate into the working zone and working up a sweat!';
			//9 stations, follow the leader. 3 laps: 60/30, 60/30, 30/20. There are two exercises at each station. You do 10 reps of the one on the right (even # above), 1 rep of the one on the left (odd # above). The 1 rep exercise is fixed. The other exercise you’ll work from 10-9-8… 1 rep.
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				// from bears
				let lap = Math.floor(i / (stations * 2));
				if (i % 2 === 0) {
					//work sets
					stationIndex[i] = Math.floor(i / 2) % stations;
					timeIndex[i] = 2 * lap;
				} else {
					//all rests are next station
					stationIndex[i] = stations + 1; //next station
					timeIndex[i] = 2 * lap + 1;
				}
			}
			break;
		case 'Athletica':
			// either 45/15 1 set 4 laps OR 20/10 4 sets 2 laps
			stations = 9;
			pods = 3;
			laps = 2;
			sets = 4;
			timing = '20/10';
			misc = '2 laps per pod of 3 stations before moving to next pod';
			timeList = [20, 10, 20, 10, 20, 10, 20, 10];
			//Standard stations
			// for (let i = 0; i < numSets(sets, stations, laps); i++) {
			//     timeIndex[i] = i % 2;
			//     if (i % 2 === 0) {
			//         //work
			//         stationIndex[i] = Math.floor(i / (sets * 2));
			//     } else if (i % (sets * 2) === sets * 2 - 1) {
			//         //next station
			//         stationIndex[i] = stations + 1;
			//     } else {
			//         //stay here
			//         stationIndex[i] = stations;
			//     }
			// }
			break;
		case 'Bears':
			stations = 18;
			pods = 1;
			laps = 1;
			sets = 2;
			timing = '35/10, 55/20';
			misc = 'No water breaks';
			timeList = [35, 10, 55, 20];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				if (i % 2 === 0) {
					//work
					stationIndex[i] = Math.floor(i / 4);
					timeIndex[i] = i % 4;
				} else if (i % 4 === 1) {
					//rest 1
					stationIndex[i] = stations;
					timeIndex[i] = 1;
				} else {
					//rest 2
					stationIndex[i] = stations + 1;
					timeIndex[i] = 3;
				}
			}
			break;
		case 'Heroeshollywood':
		case 'Heroes Hollywood':
			displayStyle = 'Heroes Hollywood';
			stations = 18;
			pods = 1;
			laps = 3;
			sets = 1;
			timing = '40/15';
			misc = 'Two people on each TV';
			timeList = [40, 15];
			break;
		case 'Joker':
		case 'The Joker':
			displayStyle = 'The Joker';
			stations = 18;
			pods = 6;
			laps = 2;
			sets = 1;
			timing = 'Lap 1 - 55/20, Lap 2 - 25/15';
			timeList = [55, 20, 25, 15];
			[stationIndex, timeIndex] = standardStations(
				stations,
				pods,
				laps,
				sets
			);
			timeIndex = timeIndex.map((timeI, i) => {
				if (i >= 36) {
					return timeI + 2;
				} else {
					return timeI;
				}
			});
			break;
		case 'Lonestar':
			stations = 12;
			pods = 1;
			laps = 2;
			sets = 2;
			timing = '30/20 20/10';
			misc =
				'Unilateral based resistance workout with a movement twist. Pivot in the opposite direction for the second lap to promote equal strength across the body.';
			timeList = [30, 20, 20, 10];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				// from bears
				if (i % 2 === 0) {
					stationIndex[i] = Math.floor(i / 4) % stations; //added stations modulo due to multiple laps
					timeIndex[i] = i % 4;
				} else if (i % 4 === 1) {
					//rest 1
					stationIndex[i] = stations;
					timeIndex[i] = 1;
				} else {
					//rest 2
					stationIndex[i] = stations + 1;
					timeIndex[i] = 3;
				}
			}
			break;
		case 'Miaminights':
		case 'Miami Nights':
			displayStyle = 'Miami Nights';
			stations = 12;
			pods = 3;
			laps = 3;
			sets = 1;
			timing = '40/20';
			timeList = [40, 20];
			//standard timing
			break;
		case 'Mkatz':
			stations = 9;
			pods = 1;
			laps = 2;
			sets = 3;
			timing = '35/10 20/10 20/20';
			misc = 'Finish with a 2 minute plank at the end!';
			timeList = [35, 10, 20, 10, 20, 20];
			break;
		case 'Panthers':
			stations = 14;
			pods = 1;
			laps = 1;
			sets = 3;
			timing = '35/20';
			misc = 'No water breaks';
			timeList = [35, 20, 34, 20, 35, 20];
			break;
		case 'Pegasus':
			stations = 15;
			pods = 1;
			laps = 1;
			sets = 3;
			timing = '30 resistance / 20 bodyweight / 15 rest';
			timeList = [30, 20, 15];
			misc =
				'12 resistance stations. Each set followed by one of three bodyweight workouts (stations 13, 14, & 15 below) before rest.';
			for (let i = 0; i < 9 * 12 - 1; i++) {
				timeIndex[i] = i % 3; //cycle through the three times continuously
				let setOfThree = Math.floor(i / 3) % 3;
				if (i % 3 === 0) {
					//resistance set
					stationIndex[i] = Math.floor(i / 9);
				} else if (i % 3 === 1) {
					//bodyweight set
					stationIndex[i] = setOfThree + 12;
				} else if (setOfThree === 0 || setOfThree === 1) {
					//i%3===2 && rest set 1 + 2
					stationIndex[i] = stations;
				} else {
					//rest set 3
					stationIndex[i] = stations + 1;
				}
			}
			break;
		case 'Piston':
			stations = 12;
			pods = 1;
			laps = 3;
			sets = 1;
			timing = '40/20';
			timeList = [40, 20];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				timeIndex[i] = i % 2;
				if (i % 2 === 0) {
					stationIndex[i] = Math.floor(i / 2) % stations;
				} else {
					stationIndex[i] = stations + 1;
				}
			}
			break;
		case 'Reddiamond':
		case 'Red Diamond':
			displayStyle = 'Red Diamond';
			stations = 9;
			pods = 3;
			laps = 1;
			sets = 4;
			timing = '45/15, 40/20, 35/25, 30/30';
			timeList = [45, 15, 40, 20, 35, 25, 30, 30];
			break;
		case 'Redline':
			stations = 9;
			pods = 1;
			laps = 1;
			sets = 5;
			timing = '20/5 30/5 40/5 50/5 60/20';
			misc = 'No water breaks';
			timeList = [20, 5, 30, 5, 40, 5, 50, 5, 60, 20];
			// for (let i = 0; i < numSets(sets, stations, laps); i++) {
			//     timeIndex[i] = i % (sets * 2);
			//     if (i % 2 === 0) {
			//         // work sets
			//         stationIndex[i] = Math.floor(i / (sets * 2));
			//     } else if (i % (sets * 2) === 9) {
			//         //next station
			//         stationIndex[i] = stations + 1;
			//     } else {
			//         stationIndex[i] = stations;
			//     }
			// }
			break;
		case 'Renegade':
			stations = 18;
			pods = 6;
			laps = 2;
			sets = 1;
			timing = '35/25';
			timeList = [35, 25];
			break;
		case 'Romans':
			stations = 9;
			pods = 3;
			laps = 2;
			sets = 2;
			timing = '35/25 two sets';
			misc =
				'Two 60 second hydration breaks in-between pods. Two laps per pod before moving to next pod.';
			timeList = [35, 25, 60];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				timeIndex[i] = i % 2; //alternating 35/25 throughout except...
				if (i % 2 === 0) {
					//work sets
					// 1r 1r 2r 2r 3r 3r / 1r 1r 2r 2r 3r 3r
					// 4r 4r 5r 5r 6r 6r / 4r 4r 5r 5r 6r 6r
					// 7r 7r 8r 8r 9r 9r / 7r 7r 8r 8r 9r 9r
					let pod = Math.floor(i / (pods * sets * laps * 2));
					let stationWithinPod = Math.floor(
						(i % (pods * sets * laps)) / 4
					);
					// console.log('Pod: ' + pod + ' Station: '+stationWithinPod)
					stationIndex[i] = stationWithinPod + pod * pods; //added stations modulo due to multiple laps and changed to six
					//need that laps to occur within the pod first...
				} else if (i % (sets * 2) === 1) {
					//rest 1
					stationIndex[i] = stations; //stay here
				} else {
					//rest 2
					stationIndex[i] = stations + 1; //next station
				}

				//except...
				if ((i + 1) % (sets * laps * pods * 2) === 0) {
					//60 sec breaks (should be 2 total)
					timeIndex[i] = 2;
					// stationIndex[i] = stations+1;//might change to +2 and add "next pod" later
				}
			}
			break;
		case 'Socal':
		case 'SoCal':
			displayStyle = 'SoCal';
			stations = 15;
			pods = 2;
			laps = 3;
			sets = 1;
			timing = 'Lap 1 - 60/30, Lap 2 - 40/20, Lap 3 - 20/10';
			misc =
				'6 stations per pod. 4 rounds of 3 body weight exercises at the end of each pod. 60 sec water break between pods.';
			timeList = [60, 30, 40, 20, 20, 10, 30, 10, 20, 10, 60];

			stationIndex = [
				0, 16, 1, 16, 2, 16, 3, 16, 4, 16, 5, 16, 0, 16, 1, 16, 2, 16,
				3, 16, 4, 16, 5, 16, 0, 16, 1, 16, 2, 16, 3, 16, 4, 16, 5, 16,

				12, 13, 14, 16, 12, 13, 14, 16, 12, 13, 14, 16, 12, 13, 14, 16,

				6, 16, 7, 16, 8, 16, 9, 16, 10, 16, 11, 16, 6, 16, 7, 16, 8, 16,
				9, 16, 10, 16, 11, 16, 6, 16, 7, 16, 8, 16, 9, 16, 10, 16, 11,
				16,

				12, 13, 14, 16, 12, 13, 14, 16, 12, 13, 14, 16, 12, 13, 14,
			];

			timeIndex = [
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 2, 3, 2, 3, 2,
				3, 2, 3, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5,

				6, 6, 6, 7, 8, 8, 8, 9, 8, 8, 8, 9, 8, 8, 8, 10,

				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 2, 3, 2, 3, 2,
				3, 2, 3, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5,

				6, 6, 6, 7, 8, 8, 8, 9, 8, 8, 8, 9, 8, 8, 8,
			];
			break;
		case 'Specialopshollywood':
		case 'Special Ops Hollywood':
			displayStyle = 'Special Ops Hollywood';
			stations = 13;
			pods = 2;
			laps = 3;
			sets = 2;
			timing = 'Lap 1: 20/10 20/10, Lap 2: 40/20, Lap 3: 60/30';
			misc =
				'4 minute AMRAP of last 3 exercises at end of each pod with 60 sec break';
			timeList = [20, 10, 40, 20, 60, 30, 4 * 60];
			stationIndex = [
				0, 13, 0, 14, 1, 13, 1, 14, 2, 13, 2, 14, 3, 13, 3, 14, 4, 13,
				4, 14, 5, 13, 5, 14, 0, 14, 1, 14, 2, 14, 3, 14, 4, 14, 5, 14,
				0, 14, 1, 14, 2, 14, 3, 14, 4, 14, 4, 14, 12, 14, 6, 13, 6, 14,
				7, 13, 7, 14, 8, 13, 8, 14, 9, 13, 9, 14, 10, 13, 10, 14, 11,
				13, 11, 14, 6, 14, 7, 14, 8, 14, 9, 14, 10, 14, 11, 14, 6, 14,
				7, 14, 8, 14, 9, 14, 10, 14, 11, 14, 12,
			];
			timeIndex = [
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0, 1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 4, 5, 4, 5, 4, 5,
				4, 5, 4, 5, 4, 5, 6, 4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3,
				2, 3, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 6,
			];
			break;
		case 'T10':
			stations = 10;
			pods = 1;
			laps = 4;
			sets = 1;
			timing = '40/10';
			timeList = [40, 10];
			misc = 'Exercises alternate between cardio and strength';
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				timeIndex[i] = i % 2;
				if (i % 2 === 0) {
					//work set
					stationIndex[i] = Math.floor((i % (2 * stations)) / 2);
				} else {
					//rest set
					stationIndex[i] = stations + 1; //all next station
				}
			}
			break;
		case 'Tempest':
			stations = 4 + 7;
			pods = 4;
			laps = 1;
			sets = 1;
			timing =
				'7 min AMRAP at each 4 station pod. Seven 30 sec reels between pods';
			timeList = [7 * 60, 30, 60];
			misc =
				'Each pod rotates when ski/bike/row/bench hops station hits target (beginner/advanced). As many reps as possible.';
			timeIndex = [
				0, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1,
				1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1,
			];
			stationIndex = [
				0, 4, 5, 6, 7, 8, 9, 10, 12, 1, 4, 5, 6, 7, 8, 9, 10, 12, 2, 4,
				5, 6, 7, 8, 9, 10, 12, 3, 4, 5, 6, 7, 8, 9, 10,
			];
			break;
		case 'Templars':
			stations = 14;
			pods = 1;
			laps = 3;
			sets = 1;
			timing = '35/15';
			misc =
				'Partner based exercises are added into this workout for added fun!';
			timeList = [35, 15];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				//this is the same as Piston (workout is almost the same but shorter sets and 2 more stations)
				timeIndex[i] = i % 2; //simple alternating between work and rest all same timing
				if (i % 2 === 0) {
					stationIndex[i] = Math.floor(i / 2) % stations; //changed this to 14 instead of 12
				} else {
					stationIndex[i] = stations + 1;
				}
			}
			break;
		case 'Thenines':
		case 'The Nines':
			displayStyle = 'The Nines';
			stations = 9;
			pods = 1;
			laps = 2;
			sets = 2;
			timing = '45/15 45/20';
			misc =
				'9 reps of primary exercise, then 9 reps secondary exercise. Increase resistance if you make it through with extra time.';
			timeList = [45, 15, 45, 20];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				timeIndex[i] = i % (sets * 2);
				if (i % 2 === 0) {
					//work sets
					stationIndex[i] = Math.floor(i / (sets * 2)) % stations;
				} else if (i % 4 === 1) {
					//stay here
					stationIndex[i] = stations;
				} else {
					//next station
					stationIndex[i] = stations + 1;
				}
			}
			break;
		case 'Trackstars':
		case 'Track Stars':
			displayStyle = 'Track Stars';
			stations = 18;
			pods = 1;
			laps = 1;
			sets = 2;
			timing = '90/10 60/10';
			misc = '"You go, I go" format with partner at each station.';
			timeList = [90, 10, 60, 10];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				timeIndex[i] = i % 4; //time cycles through all four continuously
				if (i % 2 === 0) {
					//work sets
					stationIndex[i] = Math.floor(i / 4) % stations;
				} else {
					//rest sets
					stationIndex[i] = stations + ((i % 4) - 1) / 2;
				}
			}
			break;
		case 'Tripledouble':
		case 'Triple Double':
			displayStyle = 'Triple Double';
			stations = 9;
			pods = 1;
			laps = 2; //2 per pod?
			sets = 3;
			timing = '30/10 30/10 30/10';
			timeList = [30, 10, 60];
			misc = '1 minute hydration between laps.';
			stationIndex = [
				0, 9, 0, 9, 0, 10, 1, 9, 1, 9, 1, 10, 2, 9, 2, 9, 2, 10, 3, 9,
				3, 9, 3, 10, 4, 9, 4, 9, 4, 10, 5, 9, 5, 9, 5, 10, 6, 9, 6, 9,
				6, 10, 7, 9, 7, 9, 7, 10, 8, 9, 8, 9, 8, 10, 0, 9, 0, 9, 0, 10,
				1, 9, 1, 9, 1, 10, 2, 9, 2, 9, 2, 10, 3, 9, 3, 9, 3, 10, 4, 9,
				4, 9, 4, 10, 5, 9, 5, 9, 5, 10, 6, 9, 6, 9, 6, 10, 7, 9, 7, 9,
				7, 10, 8, 9, 8, 9, 8,
			];

			timeIndex = [
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0,
			];
			break;
		case 'Varsity':
			stations = 9;
			pods = 1;
			laps = 3;
			sets = 3;
			timing = 'Lap 1 - 3x 20/10, Lap 2 - 40/20, Lap 3 - 60/30';
			misc =
				'3 sets in the first lap, 1 set for the second and third lap';
			timeList = [20, 10, 40, 20, 60, 30];
			stationIndex = [
				//lap 1 (three sets per station)
				0, 9, 0, 9, 0, 10, 1, 9, 1, 9, 1, 10, 2, 9, 2, 9, 2, 10, 3, 9,
				3, 9, 3, 10, 4, 9, 4, 9, 4, 10, 5, 9, 5, 9, 5, 10, 6, 9, 6, 9,
				6, 10, 7, 9, 7, 9, 7, 10, 8, 9, 8, 9, 8, 10,
				//lap 2 (one set)
				0, 10, 1, 10, 2, 10, 3, 10, 4, 10, 5, 10, 6, 10, 7, 10, 8, 10,
				//lap 3 (one set)
				0, 10, 1, 10, 2, 10, 3, 10, 4, 10, 5, 10, 6, 10, 7, 10, 8,
			];
			timeIndex = [
				//lap1
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
				//lap2
				2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3,
				//lap3
				4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4,
			];
			break;
		case 'Westhollywood':
		case 'West Hollywood':
			displayStyle = 'West Hollywood';
			stations = 27;
			pods = 1;
			laps = 2;
			sets = 1;
			timing = 'First lap: 45/15, Second Lap: 35/15';
			timeList = [45, 35, 15];
			for (let i = 0; i < numSets(sets, stations, laps); i++) {
				let lap = Math.floor(i / (stations * 2));
				let stationWithinLap = Math.floor((i % (stations * 2)) / 2);
				if (i % 2 === 0) {
					//work set
					stationIndex[i] = stationWithinLap;
					timeIndex[i] = lap;
				} else {
					//rest set
					timeIndex[i] = 2;
					stationIndex[i] = Math.floor((i % 4) / 2) + stations;
				}
			}
			break;
		case 'Wingman':
			stations = 18;
			pods = 1;
			laps = 1;
			sets = 2;
			timing = '35/25';
			timeList = [35, 25, 35, 25];
			break;
		case 'Loading':
		case 'No Workout':
			stations = 0;
			pods = 0;
			laps = 0;
			sets = 0;
			timing = '';
			timeList = [];
			break;
		default:
			throw new Error(`${style} is not a valid workout style`);
	}

	//if station or time index hasnt been set, assume standard
	let [sI, tI] = standardStations(stations, pods, laps, sets);

	if (stationIndex.length === 0) {
		stationIndex = sI;
	}

	if (timeIndex.length === 0) {
		timeIndex = tI;
	}

	for (let i = stationList.length; i < stations; i++) {
		stationList.push('W' + (i + 1));
	}

	stationList.push('Rest-Stay Here');
	stationList.push('Rest-Next Station');

	// stationList.push('Rest-Next Pod'); //Not sure if needed yet. will need to adjust some logic elsewhere that assumes only two things have been added to the workout list.
	let setDurationList = timeIndex.map((tI) => timeList[tI]);
	let duration = setDurationList.reduce((a, b) => a + b, 0);
	let durationDisplay;
	try {
		durationDisplay =
			duration > 3600
				? new Date(duration * 1000).toISOString().substring(11, 19)
				: new Date(duration * 1000).toISOString().substring(14, 19);
	} catch (error) {
		console.log(style);
		console.log(duration);
		throw new Error(error);
	}

	if (stationIndex.length !== timeIndex.length) {
		throw new Error(
			`Station and time index lists have dissimilar lenghts. Workout style: ${style}.
			
			stationIndex.length = ${stationIndex.length}
			
			timeIndex.length = ${timeIndex.length}`
		);
	}

	return {
		date: date instanceof Date ? date.toISOString() : date,
		style,
		displayStyle,
		stations,
		pods,
		laps,
		sets,
		timing,
		misc,
		numSets: stationIndex.length,
		stationList,
		stationIndex,
		timeList,
		timeIndex,
		setDurationList,
		durationDisplay,
		logo,
	} as WorkoutType;
}
