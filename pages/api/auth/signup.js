import { connectToDatabase } from 'lib/mongodb';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
    // https://dev.to/dawnind/authentication-with-credentials-using-next-auth-and-mongodb-part-1-m38
    const { db, client } = await connectToDatabase();

    if ((req.method = 'POST')) {
        const { email, password } = req.body;
        // validate entries (may want more robust email checking)
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Invalid Data' });
            return;
        }

        //check if user already exists
        const checkExisting = await db
            .collection('users')
            .findOne({ email: email });

        if (checkExisting) {
            res.status(422).json({ message: 'User already exists' });
            client.close();
            return;
        }

        const status = await db
            .collection('users')
            .insertOne({ ...req.body, password: await hash(password, 12) });

        res.status(201).json({ message: 'User created', ...status });
        client.close();
    } else {
        res.status(500).json({ message: 'Route not valid' });
    }
}
