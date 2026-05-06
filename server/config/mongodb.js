import mongoose from "mongoose";

const connectDB = async ()=>{


    mongoose.connection.on('connected', ()=> console.log("Database connected successfully"));
    


    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
}

export default connectDB;





















// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// };

// export default connectDB;


// fvnfvkl