const datesMatch = (date1: Date, date2: Date) =>
	date1.getDate() === date2.getDate();
const monthsMatch = (date1: Date, date2: Date) =>
	date1.getMonth() === date2.getMonth();
const yearsMatch = (date1: Date, date2: Date) =>
	date1.getFullYear() === date2.getFullYear();
export const areDatesEqual = (date1: Date, date2: Date) =>
	datesMatch(date1, date2) &&
	monthsMatch(date1, date2) &&
	yearsMatch(date1, date2);
