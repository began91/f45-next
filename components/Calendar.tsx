import { getWorkoutByDate } from '../src/helpers/lists';
import logos from '../public/workout-logos/workout-logos';
import LinkIf from 'components/LinkIf';
import styles from 'components/Calendar.module.css';
import Image from 'next/image';
import cn from 'classnames';
import {WorkoutType} from 'src/helpers/CreateWorkout'

//Calendar outputs a month or week of dates around the date provided in state

function Week({ week, month, db, setDate ,activeDate}) {//row in the calendar
    return (
        <div className={styles.week}>
            {week.map((date, i) => (
                <DaySquare
                    date={date}
                    key={i}
                    month={month}
                    setDate={setDate}
                    db={db}
                    isActiveDate={date.getMonth() === activeDate.getMonth() && date.getDate() === activeDate.getDate()}
                />
            ))}
        </div>
    );
}

function DaySquare({ date, month, setDate, db , isActiveDate}) {
    const workout = getWorkoutByDate(date);
    let isWorkout = !(typeof workout === "undefined");
   
    const logo = workout?.logo || logos.defaultLogo;
    const datePathString = `/${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;

    let href: string;//vary link based on current page view
    if (month) {
        href = '/weekly';
    } else if (db) {
        href = '/add-workout';
    } else {
        href = '/daily'+datePathString;
    }

    return (
        <LinkIf href={href} isLink={!db && isWorkout} >
            <div
                onClick={() => setDate(date)}
                className={cn(styles.daySquare, {
                    [styles.notThisMonth]: !date.isThisMonth && month,
                    [styles.activeDate]: isActiveDate,
                    [styles.noWorkout]: !isWorkout
                })}
                title={workout?.displayStyle || "No workout"}
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
    useDate: [date, setDate],//date from state
    //booleans
    month,//month view
    week,//week view
    db,//db update page
}: {useDate: [date: Date, setDate: React.Dispatch<React.SetStateAction<Date>>], month?: boolean, week?: boolean, db?: boolean}) {


    // array of arrays of the weeks
    const calendar = date
        .getCalendar()//custom date prototype provided in /pages/_app.js
        .filter(//if its month view, use every week
            week =>
                month ||
                week.some(//otherwise only use the week containing the date in state
                    day =>
                        day.getDate() === date.getDate() &&
                        day.getMonth() === date.getMonth()
                )
        );
        //display the month name
        let monthRow;
        if (month) {//for month view, simply display the month of the date in state, including year.
            monthRow = (
                <div className={styles.monthRow}>
                    {date.toLocaleString(undefined, {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
            );
        } else {//for week view, count the number of days in the month of the first day of the week
            const daysInMonth1 = calendar[0].filter(
                (day: Date) => day.getMonth() === calendar[0][0].getMonth()
            ).length;
            const daysInMonth2 = 7 - daysInMonth1;//the rest of the week is in the net month (maybe 0)
            const yearDisplay = calendar[0].map(//add -YY to string, more customizable than doing in conjunction with later display
                day => '-' + day.toLocaleString(undefined, { year: '2-digit' })
            );
    
            monthRow =
                daysInMonth2 === 0 ? (//if all in one month, simply display month and year as above
                    <div className={styles.monthRow}>
                        {calendar[0][0].toLocaleString(undefined, {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                ) : (//if split between two months, sidebyside divs with flex grow set to the number of days and flex basis set to 0
                    <div className={styles.splitMonthRow}>
                        <div
                            className={styles.subMonth}
                            style={{ flexGrow: daysInMonth1 }}
                            onClick={() => setDate(calendar[0][0])}
                        >
                            {calendar[0][0].toLocaleString(undefined, {
                                month: 'short',
                            })}
                            {yearDisplay[0]}
                        </div>
    
                        <div
                            className={styles.subMonth}
                            style={{ flexGrow: daysInMonth2 }}
                            onClick={() => setDate(calendar[0][6])}
                        >
                            {calendar[0][6].toLocaleString(undefined, {
                                month: 'short',
                            })}
                            {yearDisplay[6]}
                        </div>
                    </div>
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

    //increment the date forward or backward by one week or month, depending on the view
    const incrementDate = e => {
        const newDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        month && newDate.setMonth(date.getMonth() + +e.target.value);
        week && newDate.setDate(date.getDate() + +e.target.value * 7);
        setDate(newDate);
    };

    //buttons for incrementing the date
    const highButtons = (
        <div className={styles.highButtons}>
            <button value={-1} onClick={incrementDate}>
                &lt;&lt;
            </button>
            <button onClick={() => setDate(new Date())}>Go To Today</button>
            <button value={1} onClick={incrementDate}>
                &gt;&gt;
            </button>
        </div>
    );


    


    return (
        <div className="calendar">
            {highButtons}
            <LinkIf href="/schedule" isLink={!db && week}>{monthRow}</LinkIf>
            <div className={styles.daysOfWeek}>{daysOfWeek}</div>
            {calendar.map((week, i) => (
                <Week
                    week={week}
                    key={i}
                    month={month}
                    setDate={setDate}
                    db={db}
                    activeDate={date}
                />
            ))}
        </div>
    );
}
