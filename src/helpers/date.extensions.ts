declare global {
	interface Date {
		getWeek(): Date[];
		getCalendar(): Date[][];
		getWeekNumber(): number;
	}
}

Date.prototype.getWeek = function (this: Date) {
	const d = new Date(this.getFullYear(), this.getMonth(), this.getDate()); //create new date object
	let dayNum = d.getDay();
	d.setUTCDate(d.getUTCDate() - dayNum); //d is now equal to start of the week.
	let week: Date[] = [];
	for (let i = 0; i < 7; i++) {
		week[i] = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
	}
	return week;
};

Date.prototype.getCalendar = function (this: Date) {
	const d = new Date(this.getFullYear(), this.getMonth(), this.getDate());
	const monthStart = new Date(this.getFullYear(), this.getMonth(), 1);
	const calendarStart = new Date(
		this.getFullYear(),
		this.getMonth(),
		1 - monthStart.getDay()
	);
	const monthEnd = new Date(this.getFullYear(), this.getMonth() + 1, 0);
	const calendarEnd = new Date(
		this.getFullYear(),
		this.getMonth(),
		monthEnd.getDate() + (6 - monthEnd.getDay())
	);

	const numWeeks =
		(calendarEnd.getWeekNumber() - calendarStart.getWeekNumber() + 52) % 52;

	const weekStarts = [];

	for (let i = 0; i < numWeeks; i++) {
		weekStarts[i] = new Date(
			calendarStart.getFullYear(),
			calendarStart.getMonth(),
			calendarStart.getDate() + i * 7
		);
	}

	return weekStarts.map((weekStart) => {
		let week = [];
		for (let i = 0; i < 7; i++) {
			week[i] = new Date(
				weekStart.getFullYear(),
				weekStart.getMonth(),
				weekStart.getDate() + i
			);
			week[i].isThisMonth = week[i].getMonth() === this.getMonth();
		}
		return week;
	});
};

Date.prototype.getWeekNumber = function (this: Date) {
	let d = new Date(
		Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
	);
	let dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export {};
