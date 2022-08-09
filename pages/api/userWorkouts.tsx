import { connectToDatabase } from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
// import { WorkoutType } from 'src/helpers/CreateWorkout';

// type Data = {
//     whateverIsInData: types
// }

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { db } = await connectToDatabase();
	let body = req.body;
	const { year, month, date, style } = body;
	switch (req.method) {
		case 'POST':
			console.log(
				`Received Posted workout: Style: ${style} Date:${month}/${date}/${year}`
			);

			await db.collection('archivedWorkouts').insertOne(body);
			res.json(await db.collection('workouts').insertOne(body));
			break;
		case 'GET':
			body = req.body;
			// if (year && month && date) {
			//     const workout = await db.collection('workouts').findOne({year,month,date})
			//     res.json({status:200,data:workout})
			// } else {
			res.json({
				status: 200,
				data: await db
					.collection('workouts')
					.find({})
					.limit(20)
					.toArray(),
			});
			// }
			break;
		default:
			break;
	}
}
