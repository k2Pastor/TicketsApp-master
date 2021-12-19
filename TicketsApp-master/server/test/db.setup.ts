import {MongoMemoryServer} from "mongodb-memory-server-core";
// @ts-ignore
import mongoose from "mongoose";

let db: MongoMemoryServer;

export async function connect() {
    db = await MongoMemoryServer.create();
    const uri = db.getUri();
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10,
    }
    await mongoose.connect(uri, options);
}

export async function closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await db.stop();
}

export async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}
