const datesMatch = (date1: Date, date2: Date) =>
	date1.getUTCDate() === date2.getUTCDate();

const monthsMatch = (date1: Date, date2: Date) =>
	date1.getUTCMonth() === date2.getUTCMonth();

const yearsMatch = (date1: Date, date2: Date) =>
	date1.getUTCFullYear() === date2.getUTCFullYear();

export const areDatesEqual = (date1: Date, date2: Date) =>
	datesMatch(date1, date2) &&
	monthsMatch(date1, date2) &&
	yearsMatch(date1, date2);
