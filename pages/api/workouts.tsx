import { connectToDatabase } from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import CreateWorkout from 'src/helpers/CreateWorkout';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { db } = await connectToDatabase();
	let body = req.body;
	console.log(body);
	const { year, month, date, style } = body;
	switch (req.method) {
		case 'POST':
			//delete if theres already a workout for that date:
			await db.collection('workouts').deleteOne({ year, month, date });

			console.log(
				`Received Posted workout: Style: ${style} Date: ${month}/${date}/${year}`
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
					.toArray()
					.then((data) => {
						return data.map((workout) => {
							const { year, month, date, style, stationList } =
								workout;
							return CreateWorkout(
								year,
								month,
								date,
								style,
								stationList
							);
						});
					}),
			});
			break;
		default:
			break;
	}
}
