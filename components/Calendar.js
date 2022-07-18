import { getWorkoutByDate } from '../src/helpers/lists';
import logos from '../public/workout-logos/workout-logos';
import Link from 'next/link';
import styles from '../styles/Calendar.module.css';
import Image from 'next/image';
import cn from 'classnames';

function Week({ week, month, setDate }) {
    return (
        <div className={styles.week}>
            {week.map((date, i) => (
                <DaySquare
                    date={date}
                    key={i}
                    month={month}
                    setDate={setDate}
                />
            ))}
        </div>
    );
}

function DaySquare({ date, month, setDate }) {
    const workout = getWorkoutByDate(date) || {};
    const logo = workout.logo || logos.defaultLogo;

    return (
        <Link href={month ? '/weekly' : '/daily'}>
            <div
                onClick={() => setDate(date)}
                className={cn(styles.daySquare, {
                    [styles.notThisMonth]: !date.isThisMonth && month,
                })}
                title={workout.displayStyle}
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
        </Link>
    );
}

export default function Calendar({ useDate: [date, setDate], month, week }) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
        (day, i) => (
            <div className={styles.daySquare} key={i}>
                {day}
            </div>
        )
    );

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

    const calendar = date
        .getCalendar()
        .filter(
            week =>
                month ||
                week.some(
                    day =>
                        day.getDate() === date.getDate() &&
                        day.getMonth() === date.getMonth()
                )
        );

    let monthRow = '';
    if (month) {
        monthRow = (
            <div className={styles.monthRow}>
                {date.toLocaleString(undefined, {
                    month: 'long',
                    year: 'numeric',
                })}
            </div>
        );
    } else {
        const daysInMonth1 = calendar[0].filter(
            day => day.getMonth() === calendar[0][0].getMonth()
        ).length;
        const daysInMonth2 = 7 - daysInMonth1;
        const yearDisplay = calendar[0].map(
            day => '-' + day.toLocaleString(undefined, { year: '2-digit' })
        );

        monthRow =
            daysInMonth2 === 0 ? (
                <div className={styles.monthRow}>
                    {calendar[0][0].toLocaleString(undefined, {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
            ) : (
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
            <Link href="/schedule">{monthRow}</Link>
            <div className={styles.daysOfWeek}>{daysOfWeek}</div>
            {calendar.map((week, i) => (
                <Week week={week} key={i} month={month} setDate={setDate} />
            ))}
        </div>
    );
}
