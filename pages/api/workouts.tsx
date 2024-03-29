import { connectToDatabase } from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { db } = await connectToDatabase();
	let body = req.body;
	console.log('body');
	console.log(body);
	const { date, style } = body;
	switch (req.method) {
		case 'POST':
			//delete if theres already a workout for that date:
			await db.collection('workouts').deleteOne({ date });

			console.log(
				`Received Posted workout: Style: ${style} Date: ${date}`
			);

			await db.collection('archivedWorkouts').insertOne(body);
			res.json(await db.collection('workouts').insertOne(body));
			break;
		case 'GET':
			body = req.body;

			res.json({
				status: 200,
				data: await db
					.collection('workouts')
					.find({})
					// .limit(20)
					.project({ _id: 0 })
					.toArray(),
			});
			break;
		default:
			break;
	}
}
