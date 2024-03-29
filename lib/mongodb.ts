import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { areDatesEqual } from 'src/helpers/areDatesEqual';
// import CreateWorkout, { WorkoutType } from 'src/helpers/CreateWorkout';
// import Workout from 'src/helpers/CreateWorkout.js';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

let cachedClient: MongoClient;
let cachedDb: Db;

if (!uri) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

if (!dbName) {
	throw new Error(
		'Please define the MONGODB_DB environment variable inside .env.local'
	);
}

export async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		return { client: cachedClient, db: cachedDb };
	}
	console.log('connecting to db');
	const options = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	} as MongoClientOptions;
	const client = await MongoClient.connect(uri, options);
	const db = client.db(dbName);

	cachedClient = client;
	cachedDb = db;
	return { client, db };
}

const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
} as MongoClientOptions;
let client;
let clientPromise;

const globalWithMongo = global as typeof globalThis & {
	_mongoClientPromise: Promise<MongoClient>;
};

if (process.env.NODE_ENV === 'development') {
	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options);
		globalWithMongo._mongoClientPromise = client.connect();
	}
	clientPromise = globalWithMongo._mongoClientPromise;
} else {
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export default clientPromise;

export async function getAllWorkouts() {
	const { db } = await connectToDatabase();
	const workouts = await db
		.collection('workouts')
		.find({})
		.project({ _id: 0 })
		.toArray();

	// client.close();
	return Promise.all(workouts);
}

export async function getWorkoutByDate(date: Date) {
	// const newDate = new Date(year, month - 1, date);

	const { db } = await connectToDatabase();

	const minDate = new Date(date);
	minDate.setUTCHours(0, 0, 0, 0);
	const maxDate = new Date(date);
	maxDate.setUTCHours(23, 59, 59, 999);

	const workout = await db.collection('workouts').findOne(
		{
			date: {
				$gte: minDate.toISOString(),
				$lte: maxDate.toISOString(),
			},
		},
		{ projection: { _id: 0 } }
	);

	// console.log(workout);

	// client.close();
	return workout;
}

export async function getWorkoutByWeek(date: Date) {
	const week = date.getWeek();

	const { db } = await connectToDatabase();

	const minDate = week[0];
	minDate.setUTCHours(0, 0, 0, 0);
	const maxDate = week[6];
	maxDate.setUTCHours(23, 59, 59, 999);

	const workouts = await db
		.collection('workouts')
		.find({
			date: { $gte: minDate.toISOString(), $lte: maxDate.toISOString() },
		})
		.project({ _id: 0 })
		.toArray();

	return Promise.all(
		week.map(
			(date) =>
				workouts.find((workout) =>
					areDatesEqual(new Date(workout.date), date)
				) || null
		)
	);
}

export async function getWorkoutByMonth(date: Date) {
	const calendar = date.getCalendar();

	const { db } = await connectToDatabase();

	const minDate = calendar[0][0];
	minDate.setUTCHours(0, 0, 0, 0);
	const maxDate = calendar[calendar.length - 1][6];
	maxDate.setUTCHours(23, 59, 59, 999);

	const workouts = await db
		.collection('workouts')
		.find({
			date: {
				$gte: minDate.toISOString(),
				$lte: maxDate.toISOString(),
			},
		})
		.project({ _id: 0 })
		.toArray();

	return Promise.all(
		calendar.map((week) =>
			week.map(
				(date) =>
					workouts.find((workout) =>
						areDatesEqual(new Date(workout.date), date)
					) || null
			)
		)
	);
}

export async function getUniqueWorkoutStyles() {
	const { db } = await connectToDatabase();

	const uniqueStyles = await db.collection('workouts').distinct('style');

	return uniqueStyles;
}

// export async function getWorkoutWeek(year,month,date) {
//     const {db,client} = await connectToDatabase();
//     const newDate = new Date(year,month-1,date);
//     const week = newDate.getWeek();
//     return week.map(async (date: Date)=>{
//         const workout = await db.collection('workouts').findOne({year, month, date});
//     })
// }
