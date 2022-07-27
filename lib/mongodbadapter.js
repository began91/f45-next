export async function MongoDBAdapter(connectToDatabase, options = {}) {
    const { db, client } = await connectToDatabase();
    const users = await db.collection('users');
}
