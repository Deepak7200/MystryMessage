import dns from "node:dns/promises";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(
            process.env.MONGODB_URI || ""
        );

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error);
        throw error;
    }
}

export default dbConnect;