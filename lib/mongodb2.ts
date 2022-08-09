import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
} as MongoClientOptions;

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
	throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	let globalWithMongo = global as typeof globalThis & {
		_mongoClientPromise: Promise<MongoClient>;
	};

	if (!globalWithMongo._mongoClientPromise) {
		client = new MongoClient(uri, options);
		globalWithMongo._mongoClientPromise =
			client.connect() as Promise<MongoClient>;
	}
	clientPromise = globalWithMongo._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise as Promise<MongoClient>;
