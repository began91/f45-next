import { connectToDatabase } from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import CreateWorkout from 'src/helpers/CreateWorkout';

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

			res.json(
				await db
					.collection('workouts')
					.findOneAndReplace({ date }, body)
			);
			// .deleteOne({ year, month, date });

			console.log(
				`Received Posted workout: Style: ${style} Date: ${date}`
			);

			await db.collection('archivedWorkouts').insertOne(body);
			// res.json(await db.collection('workouts').insertOne(body));
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
