import styles from '../styles/WeeklyDatePicker.module.css';
import DaySquare from './DaySquare';
import { getWorkoutByDate } from '../helpers/lists.js';

export default function DatePicker(props) {
    // const [displayCalendar,setDisplayCalendar] = useState(false);
    const [workouts, setWorkouts] = props.useWorkouts;
    const workout = workouts.byDate;

    const changeWeek = e => {
        const newDate = new Date(workout.date);
        newDate.setDate(newDate.getDate() + 7 * +e.target.value);
        setWorkouts({ ...workouts, byDate: getWorkoutByDate(newDate) });
    };

    const setToday = e => {
        setWorkouts({ ...workouts, byDate: getWorkoutByDate(new Date()) });
    };

    const currentYear = new Date().getFullYear();

    let week = [];
    week[0] = new Date(workout.date);
    week[0].setDate(workout.date.getDate() - workout.date.getDay());
    for (let i = 1; i <= 6; i++) {
        week[i] = new Date(workout.date);
        week[i].setDate(workout.date.getDate() - workout.date.getDay() + i);
    }
    const daysInMonth1 = week.filter(
        day => day.getMonth() === week[0].getMonth()
    ).length;
    const daysInMonth2 = 7 - daysInMonth1;
    const styleMonth1 = {
        flex: daysInMonth1 + ' 1 0',
    };
    const styleMonth2 = {
        flex: daysInMonth2 + ' 1 0',
    };

    const yearDisplay = week.map(day => {
        return day.getFullYear() === currentYear ? (
            ''
        ) : (
            <div>{day.toLocaleString(undefined, { year: 'numeric' })}</div>
        );
    });

    const splitWeek = !week.every(
        day => day.getMonth() === workout.date.getMonth()
    );

    return (
        <div id="DatePicker">
            <div id="dateSection">
                <button id="backWeek" value={-1} onClick={changeWeek}>
                    Prev
                    <br />
                    &lt;&lt;
                    <br />
                    Week
                </button>

                <div id="dateRow">
                    <div id="week">
                        {week.map(day => {
                            const activeDay =
                                day.getDay() === workout.date.getDay()
                                    ? 'active-day'
                                    : '';
                            return (
                                <DaySquare
                                    key={day.getDay()}
                                    date={day}
                                    activeDay={activeDay}
                                    useWorkouts={props.useWorkouts}
                                />
                            );
                        })}
                    </div>
                </div>
                <button id="nextWeek" value={1} onClick={changeWeek}>
                    Next
                    <br />
                    &gt;&gt;
                    <br />
                    Week
                </button>
            </div>
            <button id="goToToday" onClick={setToday}>
                Go To Today
            </button>
        </div>
    );
}
