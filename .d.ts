declare global {
    interface Date {
        getWeekNumber(): number,
        getCalendar(): Date [][]
    }
}