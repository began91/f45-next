// import { getWorkoutByDate } from '../src/helpers/lists';//this is going to move to an API call to get a workout on the specified dates.

/*
need to go back into schedule and weekly to get serverside props with a db call. Available


Options:
static generation: One API call that gets all the workouts at once.
Pros: simple
cons: slows down with big API call. slows down with heavier component

static generation for each month:
pros: quick delivery to client, adjacent months are ready to go
cons: need to set up unique pages for each month with url routing (already set up for daily though so nbd), need to set up 404 page, need to make months/weeks with no workouts not selectable (or just load one month before and after selectable months) via getServerSideProps

server side render on request for a new month:
doesnt really make sense since the data isnt changing



client side request for a new month:
currently, each workout is one request, but that could be optimized to mmake an API call for a week or month of workouts
pros: just fetch what you need right now
const: request to server and db every time new month or week selected




*/
import logos from '../public/workout-logos/workout-logos';
import LinkIf from 'components/LinkIf';
import styles from 'components/Calendar.module.css';
import Image from 'next/image';
import cn from 'classnames';
import { WorkoutType } from 'src/helpers/CreateWorkout';
import { ReactElement } from 'react';

//Calendar outputs a month or week of dates around the date provided in props

interface WeekType {
	week: WorkoutType[];
	month?: boolean;
	db: boolean;
	activeDate: Date;
}

function Week({ week, month, db, activeDate }: WeekType) {
	//row in the calendar
	return (
		<div className={styles.week}>
			{week.map((workout, i) => (
				<DaySquare
					workout={workout}
					key={i}
					month={!!month}
					db={db}
					isActiveDate={
						workout.month - 1 === activeDate.getMonth() &&
						workout.date === activeDate.getDate()
					}
					isThisMonth={workout.month - 1 === activeDate.getMonth()}
				/>
			))}
		</div>
	);
}

interface DaySquareType {
	workout: WorkoutType;
	month: boolean;
	db: boolean;
	isActiveDate: boolean;
	isThisMonth: boolean;
}

function DaySquare({
	workout,
	month,
	db,
	isActiveDate,
	isThisMonth,
}: DaySquareType) {
	let isWorkout = !!workout;
	const date = new Date(workout.year, workout.month - 1, workout.date);

	const logo = workout?.logo || logos.defaultLogo;
	const datePathString = `/${date.getFullYear()}/${
		date.getMonth() + 1
	}/${date.getDate()}`;

	let href: string; //vary link based on current page view
	if (month) {
		href = '/weekly' + datePathString;
	} else if (db) {
		href = '/add-workout';
	} else {
		href = '/daily' + datePathString;
	}

	return (
		<LinkIf href={href} isLink={!db && isWorkout}>
			<div
				className={cn(styles.daySquare, {
					[styles.notThisMonth]: !isThisMonth && month,
					[styles.activeDate]: isActiveDate,
					[styles.noWorkout]: !isWorkout,
				})}
				title={workout?.displayStyle || 'No workout'}
			>
				<div className={styles.logoContainer}>
					<Image
						priority
						src={logo}
						layout="responsive"
						alt="logo"
						className={styles.logo}
					/>
					<div className={styles.date}>
						{date.toLocaleString(undefined, { day: 'numeric' })}
					</div>
				</div>
			</div>
		</LinkIf>
	);
}

export default function NewCalendar({
	date, //date from state
	//booleans
	month, //month view
	week, //week view
	db, //db update page
}: {
	date: Date;
	month?: WorkoutType[][];
	week?: WorkoutType[];
	db?: boolean;
}) {
	//display the month name
	let monthRow: ReactElement;
	let calendarGrid: ReactElement | ReactElement[];

	if (!!month) {
		//for month view, simply display the month of the date in state, including year.
		monthRow = (
			<div className={styles.monthRow}>
				{date.toLocaleString(undefined, {
					month: 'long',
					year: 'numeric',
				})}
			</div>
		);
		calendarGrid = month.map((week, i) => (
			<Week week={week} key={i} month db={!!db} activeDate={date} />
		));
	} else if (!!week) {
		//for week view, count the number of days in the month of the first day of the week
		const daysInMonth1 = week.filter(
			(workout: WorkoutType) => workout.month === week[0].month
		).length;
		const daysInMonth2 = 7 - daysInMonth1; //the rest of the week is in the net month (may be 0)
		const monthDisplayShort = week.map((workout: WorkoutType) => {
			const newDate = new Date(
				workout.year,
				workout.month - 1,
				workout.date
			);
			return newDate.toLocaleString(undefined, {
				month: 'short',
				year: '2-digit',
			});
		});
		const monthDisplayLong = week.map((workout: WorkoutType) => {
			const newDate = new Date(
				workout.year,
				workout.month - 1,
				workout.date
			);
			return newDate.toLocaleString(undefined, {
				month: 'long',
				year: 'numeric',
			});
		});

		monthRow =
			daysInMonth2 === 0 ? ( //if all in one month, simply display month and year as above
				<div className={styles.monthRow}>{monthDisplayLong[0]}</div>
			) : (
				//if split between two months, sidebyside divs with flex grow set to the number of days and flex basis set to 0
				<div className={styles.splitMonthRow}>
					<div
						className={styles.subMonth}
						style={{ flexGrow: daysInMonth1 }}
					>
						{monthDisplayShort[0]}
					</div>

					<div
						className={styles.subMonth}
						style={{ flexGrow: daysInMonth2 }}
					>
						{monthDisplayShort[6]}
					</div>
				</div>
			);
		calendarGrid = (
			<Week week={week} db={!!db} month={!!month} activeDate={date} />
		);
	} else {
		throw new Error(
			'Week or Month must be specified to Calendar component.'
		);
	}

	// weekday name header row
	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
		(day, i) => (
			<div className={styles.daySquare} key={i}>
				{day}
			</div>
		)
	);

	const backDate = week
		? new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
		: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
	const fwdDate = week
		? new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
		: new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
	const hrefBack = `/${
		week ? 'weekly' : 'schedule'
	}/${backDate.getFullYear()}/${
		backDate.getMonth() + 1
	}/${backDate.getDate()}`;
	const hrefFwd = `/${
		week ? 'weekly' : 'schedule'
	}/${fwdDate.getFullYear()}/${fwdDate.getMonth() + 1}/${fwdDate.getDate()}`;
	const today = new Date();
	const hrefToday = `/${
		week ? 'weekly' : 'schedule'
	}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;

	//buttons for incrementing the date
	const highButtons = (
		<div className={styles.highButtons}>
			<LinkIf href={hrefBack}>
				<button>&lt;&lt;</button>
			</LinkIf>
			<LinkIf href={hrefToday}>
				<button>Go To Today</button>
			</LinkIf>
			<LinkIf href={hrefFwd}>
				<button>&gt;&gt;</button>
			</LinkIf>
		</div>
	);

	return (
		<div className="calendar">
			{highButtons}
			<LinkIf href="/schedule" isLink={!db && !!week}>
				{monthRow}
			</LinkIf>
			<div className={styles.daysOfWeek}>{daysOfWeek}</div>
			{calendarGrid}
		</div>
	);
}
