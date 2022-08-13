import logos from '../public/workout-logos/workout-logos';
import LinkIf from 'components/LinkIf';
import styles from 'components/Calendar.module.css';
import Image from 'next/image';
import cn from 'classnames';
import { WorkoutType } from 'src/helpers/CreateWorkout';
import { ReactElement } from 'react';

interface WeekType {
	week: WorkoutType[];
	calendarWeek: Date[];
	activeDate: Date;
}

function Week({ calendarWeek, week, activeDate }: WeekType) {
	//row in the calendar
	return (
		<div className={styles.week}>
			{week.map((workout, i) => (
				<DaySquare
					workout={workout}
					key={i}
					isActiveDate={
						calendarWeek[i].getMonth() === activeDate.getMonth() &&
						calendarWeek[i].getDate() === activeDate.getDate()
					}
					date={calendarWeek[i]}
				/>
			))}
		</div>
	);
}

interface DaySquareType {
	workout: WorkoutType;
	isActiveDate: boolean;
	date: Date;
}

function DaySquare({ workout, isActiveDate, date }: DaySquareType) {
	const isWorkout = !!workout;

	const logo = workout?.logo || logos.defaultLogo;
	const datePathString = `/${date.getFullYear()}/${
		date.getMonth() + 1
	}/${date.getDate()}`;

	let href: string = '/add-workout' + datePathString; //vary link based on current page view

	return (
		<LinkIf href={href} isLink={isWorkout}>
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

export default function Calendar({
	date, //date from state
	week, //weeklyWorkouts
}: {
	date: Date;
	week?: WorkoutType[];
}) {
	//display the month name
	let monthRow: ReactElement;
	let calendarGrid: ReactElement | ReactElement[];
	if (!week) throw new Error('Calendar needs a week of workouts');

	//for week view, count the number of days in the month of the first day of the week
	const daysInMonth1 = date
		.getWeek()
		.filter(
			(date: Date) => date.getMonth() === date.getWeek()[0].getMonth()
		).length as number;
	const daysInMonth2 = 7 - daysInMonth1; //the rest of the week is in the net month (may be 0)
	const monthDisplayShort = week.map((workout: WorkoutType) => {
		return new Date(workout.date).toLocaleString(undefined, {
			month: 'short',
			year: '2-digit',
		});
	});
	const monthDisplayLong = week.map((workout: WorkoutType) => {
		return new Date(workout.date).toLocaleString(undefined, {
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
		<Week calendarWeek={date.getWeek()} week={week} activeDate={date} />
	);

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

	const hrefBack = `/${
		week ? 'weekly' : 'schedule'
	}/${backDate.getFullYear()}/${
		backDate.getMonth() + 1
	}/${backDate.getDate()}`;

	const hrefFwd = `/${
		week ? 'weekly' : 'schedule'
	}/${fwdDate.getFullYear()}/${fwdDate.getMonth() + 1}/${fwdDate.getDate()}`;

	//date commanded by go to today button
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
