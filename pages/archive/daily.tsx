// import React from 'react';
// import Layout from '../../components/Layout';
// import Link from 'next/link';
// import { getWorkoutByDate } from '../../src/helpers/lists';
// import styles from '../styles/daily.module.css';
// import utilStyles from '../styles/utils.module.css';
// import cn from 'classnames';

// export default function daily({
//     useDate: [date, setDate],
//     useWorkout: [workout, setWorkout],
// }) {
//     setWorkout(getWorkoutByDate(date));
//     const workoutInfo = [
//         'displayStyle',
//         'stations',
//         'pods',
//         'laps',
//         'sets',
//         'timing',
//         'durationDisplay',
//         'misc',
//     ];
//     const workoutInfoLabels = [
//         'Style',
//         'Stations',
//         'Pods',
//         'Laps',
//         'Sets',
//         'Timing',
//         'Duration',
//         'Misc',
//     ];

//     return (
//         <Layout page="Day" date={date}>
//             <div className={styles.infoGrid}>
//                 <b className={styles.label}>Date: </b>
//                 <div className={cn(styles.info, styles.span3)}>
//                     {date.toLocaleString(undefined, {
//                         weekday: 'long',
//                         month: 'long',
//                         day: 'numeric',
//                         year: 'numeric',
//                     })}
//                 </div>

//                 {workoutInfo.map((info, i) => (
//                     <React.Fragment key={i}>
//                         <b className={styles.label}>{workoutInfoLabels[i]}: </b>
//                         <div
//                             className={cn(styles.info, {
//                                 [styles.span3]: ![1, 2, 3, 4].includes(i),
//                             })}
//                         >
//                             {workout[info]}
//                         </div>
//                     </React.Fragment>
//                 ))}
//             </div>
//             <b htmlFor="stationList" className={styles.label}>
//                 Exercises:
//             </b>
//             <ol className={styles.info} id="stationList">
//                 {workout.stationList
//                     .filter((station, i) => i < workout.stations)
//                     .map((station, i) => (
//                         <li key={i} className={styles.station}>
//                             {station}
//                         </li>
//                     ))}
//             </ol>
//             <Link href="/custom">
//                 <button>Create a custom workout using this format-&gt;</button>
//             </Link>
//         </Layout>
//     );
// }

// export async function getStaticProps(context) {
//     console.log('Context in daily:')
//     console.log(context)
//     return {
//         props: {},
//     };
// }

// // combined service years and months
// // 4 <FA></FA>
// // 2 Pilots
export {};
