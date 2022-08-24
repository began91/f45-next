import logos from '../public/workout-logos/workout-logos';
import LinkIf from 'components/LinkIf';
import styles from 'components/Calendar.module.css';
import Image from 'next/image';
import cn from 'classnames';
import { WorkoutType } from 'src/helpers/CreateWorkout';
import { ReactElement } from 'react';

interface WeekType {
	week: WorkoutType[];
	month?: boolean;
	calendarWeek: Date[];
	db: boolean;
	activeDate: Date;
}

function Week({ calendarWeek, week, month, db, activeDate }: WeekType) {
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
						calendarWeek[i].getMonth() === activeDate.getMonth() &&
						calendarWeek[i].getDate() === activeDate.getDate()
					}
					isThisMonth={
						calendarWeek[i].getMonth() === activeDate.getMonth()
					}
					date={calendarWeek[i]}
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
	date: Date;
}

function DaySquare({
	workout,
	month,
	db,
	isActiveDate,
	isThisMonth,
	date,
}: DaySquareType) {
	const isWorkout = !!workout;

	const logo = workout?.logo || logos.defaultLogo;
	const datePathString = `/${date.getFullYear()}/${
		date.getMonth() + 1
	}/${date.getDate()}`;

	let href: string; //vary link based on current page view
	if (month) {
		href = '/weekly' + datePathString;
	} else if (db) {
		href = '/add-workout' + datePathString;
	} else {
		href = '/daily' + datePathString;
	}

	return (
		<LinkIf href={href} isLink={isWorkout || db}>
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
	month, //monththly Workouts or undefined
	week, //weeklyWorkouts or undefined
	db, //db update page boolean
}: {
	date: Date;
	month?: WorkoutType[][];
	week?: WorkoutType[];
	db?: boolean;
}) {
	//display the month name
	let monthRow: ReactElement;
	let calendarGrid: ReactElement | ReactElement[];

	if (month) {
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
			<Week
				calendarWeek={date.getCalendar()[i]}
				week={week}
				key={i}
				month
				db={!!db}
				activeDate={date}
			/>
		));
	} else if (week) {
		const calendarWeek = date.getWeek();
		//for week view, count the number of days in the month of the first day of the week
		const daysInMonth1 = date
			.getWeek()
			.filter(
				(date: Date) => date.getMonth() === date.getWeek()[0].getMonth()
			).length as number;
		const daysInMonth2 = 7 - daysInMonth1; //the rest of the week is in the net month (may be 0)
		const monthDisplayShort = calendarWeek.map((day: Date) => {
			return day.toLocaleString(undefined, {
				month: 'short',
				year: '2-digit',
			});
		});
		const monthDisplayLong = calendarWeek.map((day: Date) => {
			return day.toLocaleString(undefined, {
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
			<Week
				calendarWeek={calendarWeek}
				week={week}
				db={!!db}
				month={!!month}
				activeDate={date}
			/>
		);
	} else {
		throw new Error(
			'Week or Month, and the respective calendars must be specified to Calendar component.'
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

	//date commanded by the back and fwd buttons (1 wk or 1 month)
	const backDate = week
		? new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
		: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
	const fwdDate = week
		? new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
		: new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

	let hrefPage: string;
	if (db) {
		hrefPage = 'add-workout';
	} else if (month) {
		hrefPage = 'schedule';
	} else {
		hrefPage = 'weekly';
	}

	const hrefBack = `/${hrefPage}/${backDate.getFullYear()}/${
		backDate.getMonth() + 1
	}/${backDate.getDate()}`;

	const hrefFwd = `/${hrefPage}/${fwdDate.getFullYear()}/${
		fwdDate.getMonth() + 1
	}/${fwdDate.getDate()}`;

	//date commanded by go to today button
	const today = new Date();
	const hrefToday = `/${hrefPage}/${today.getFullYear()}/${
		today.getMonth() + 1
	}/${today.getDate()}`;

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
			<LinkIf
				href={`/schedule/${date.getFullYear()}/${
					date.getMonth() + 1
				}/${date.getDate()}`}
				isLink={!db && !!week}
			>
				{monthRow}
			</LinkIf>
			<div className={styles.daysOfWeek}>{daysOfWeek}</div>
			{calendarGrid}
		</div>
	);
}
