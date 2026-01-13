import mongoose from "mongoose";

let cached = global.mongooseCache;

if(!cached){
    cached = global.mongooseCache = {connection: null, promise: null};
}

export async function connectToDB(){
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set');

    if(cached.connection){
        return cached.connection;
    }

    if(!cached.promise){
        cached.promise = mongoose.connect(process.env.MONGO_URI!);
    }

    try{
        cached.connection = await cached.promise;
        cached.promise = global.mongooseCache.promise = null;
    }
    catch(error){
        console.error("Error while connecting to database: ", error);
        cached.connection = global.mongooseCache.connection = null;
        cached.promise = global.mongooseCache.promise = null;
        throw error;
    }
    
    return cached.connection;
}