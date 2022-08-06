import { MongoClient, ObjectId } from 'mongodb';
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
    const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    };
    const client = await MongoClient.connect(uri, options);
    const db = await client.db(dbName);

    cachedClient = client;
    cachedDb = db;
    return { client, db };
}

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
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
    client.close()
    return workouts;
}

export async function getWorkoutByDate( year, month, date) {
    // year = 2022;
    // month = 7;
    // date = 27;
    const { db, client } = await connectToDatabase();
    const workout = await db
        .collection('workouts')
        .findOne({year: +year, month: +month, date: +date});
    // console.log(workout);
    

    if (!workout) {
        client.close();
        throw new Error(
            `No workout found with attributes: {year: ${year}, month: ${month}, date: ${date}}`
        );
    }
    workout._id='';
    client.close();
    return workout;
}
