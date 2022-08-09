import { MongoClient, MongoClientOptions, Db, ObjectId } from 'mongodb';
import { WorkoutType } from 'src/helpers/CreateWorkout';
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

let globalWithMongo = global as typeof globalThis & {
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
	const { db, client } = await connectToDatabase();
	const workouts = await db.collection('workouts').find({}).toArray();
	client.close();
	return workouts;
}

export async function getWorkoutByDate(
	year: number,
	month: number,
	date: number
) {
	// const newDate = new Date(year, month - 1, date);

	const { db, client } = await connectToDatabase();

	const workout = await db
		.collection('workouts')
		.findOne({ year, month, date });

	if (workout) {
		(await workout)._id = '';
	}

	client.close();
	return workout;
}

export async function getWorkoutByWeek(
	year: number,
	month: number,
	date: number
) {
	const newDate = new Date(year, month - 1, date);

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
}

export async function getWorkoutByMonth(
	year: number,
	month: number,
	date: number
) {
	const newDate = new Date(year, month - 1, date);
	const calendar = newDate.getCalendar();
	const workoutCalendar = calendar.map(async (week: Date[]) => {
		return getWorkoutByWeek(
			week[0].getFullYear(),
			week[0].getMonth() + 1,
			week[0].getDate()
		);
	});
	return Promise.all(workoutCalendar);
}

// export async function getWorkoutWeek(year,month,date) {
//     const {db,client} = await connectToDatabase();
//     const newDate = new Date(year,month-1,date);
//     const week = newDate.getWeek();
//     return week.map(async (date: Date)=>{
//         const workout = await db.collection('workouts').findOne({year, month, date});
//     })
// }
