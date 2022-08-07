import { connectToDatabase } from 'lib/mongodb';

export default async function handler(req, res) {
    const { db } = await connectToDatabase();
    let body = req.body
    let {year,month,date,style} = body;
    switch (req.method) {
        case 'POST':
            //delete if theres already a workout for that date:
            await db.collection('workouts').deleteOne({year,month,date})

            console.log(`Received Posted workout: Style: ${style} Date:${month}/${date}/${year}`)
            
            await db.collection('archivedWorkouts').insertOne(body);
            let newWorkout = await db
                .collection('workouts')
                .insertOne(body);
            res.json(newWorkout);
            break;
        case 'GET':
            body = req.body;
            // if (year && month && date) {
            //     const workout = await db.collection('workouts').findOne({year,month,date})
            //     res.json({status:200,data:workout})
            // } else {
                const workouts = await db
                .collection('workouts')
                .find({})
                .limit(20)
                .toArray();
                res.json({ status: 200, data: workouts });
            // }
            break;
        default:
            break;
    }
}
