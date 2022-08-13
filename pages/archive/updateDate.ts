import { connectToDatabase } from 'lib/mongodb';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { db, client } = await connectToDatabase();

		const date = new Date(req.body);

		const result = await db.collection('workouts').findOneAndUpdate(
			{
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				date: date.getDate(),
			},
			{
				$set: { date: date.toISOString() },
				$unset: { year: 1, month: 1 },
			}
		);

		// client.close();

		res.status(201).json({ result, message: 'workout date updated' });
	}
}
