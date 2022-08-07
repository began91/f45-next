import { MongoClient, ObjectId, MongoClientOptions } from 'mongodb';
import { WorkoutType } from 'src/helpers/CreateWorkout';
// import Workout from 'src/helpers/CreateWorkout.js';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let cachedClient = null;
let cachedDb = null;

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
	const options: MongoClientOptions = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	} as MongoClientOptions;
	const client = await MongoClient.connect(uri, options);
	const db = await client.db(dbName);

	cachedClient = client;
	cachedDb = db;
	return { client, db };
}

const options: MongoClientOptions = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
} as MongoClientOptions;
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export default clientPromise;

export async function getAllWorkouts() {
	const { db, client } = await connectToDatabase();
	const workouts = await db.collection('workouts').find({}).toArray();
	client.close();
	return workouts;
}

export async function getWorkoutByDate(
	year: number,
	month: number,
	date: number,
	unitOfTime: 'day' | 'week' | 'month' = 'day'
) {
	const newDate = new Date(year, month - 1, date);

	switch (unitOfTime) {
		case 'day':
			const { db, client } = await connectToDatabase();

			const workout = await db
				.collection('workouts')
				.findOne({ year, month, date });

			if (workout) {
				workout._id = '';
			}

			client.close();
			return workout;
		case 'week':
			const week = newDate.getWeek();

			const workoutWeek = week.map(
				async (date: Date) =>
					await getWorkoutByDate(
						date.getFullYear(),
						date.getMonth() + 1,
						date.getDate()
					)
			);

			return Promise.all(workoutWeek);
		// return workoutWeek;
		case 'month':
			const calendar = newDate.getCalendar();

			const workoutCalendar = calendar.map(async (week: Date[]) => {
				return await getWorkoutByDate(
					week[0].getFullYear(),
					week[0].getMonth() + 1,
					week[0].getDate(),
					'week'
				);
			});

			return Promise.all(workoutCalendar);
		default:
			return undefined;
	}
}

// export async function getWorkoutWeek(year,month,date) {
//     const {db,client} = await connectToDatabase();
//     const newDate = new Date(year,month-1,date);
//     const week = newDate.getWeek();
//     return week.map(async (date: Date)=>{
//         const workout = await db.collection('workouts').findOne({year, month, date});
//     })
// }
