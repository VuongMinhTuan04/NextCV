import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const url = process.env.DATABASE_CONNECTIONSTRING as string;

        await mongoose.connect(url);

        console.log("[SUCCESS] Connection Success");
    } catch (error) {
        console.error("[ERROR] Connection Error: ", error);
        process.exit(1);
    }
}

export default connectDB;
