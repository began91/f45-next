import { connectToDatabase } from 'lib/mongodb';

export default async function handler(req, res) {
    const { db } = await connectToDatabase();
    switch (req.method) {
        case 'POST':
            let bodyObject = JSON.parse(req.body);
            let newPost = await db.collection('comments').insertOne(bodyObject);
            res.json(newPost.ops[0]);
            break;
        case 'GET':
            const posts = await db
                .collection('users')
                .find({})
                .limit(20)
                .toArray();
            res.json({ status: 200, data: posts });
            break;
        default:
            break;
    }
}
