import moongoose from "mongoose"; 

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
};

declare global {
    var mongooseCache: {
        conn: typeof moongoose | null;
        promise: Promise<typeof moongoose> | null;
    }
}

const cache = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

export const connectdb = async () => {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        cache.promise = moongoose.connect(MONGODB_URI,{bufferCommands: false});
    }

    try{
        cache.conn = await cache.promise;
    }catch(err){
        cache.promise = null;
        console.error("Failed to connect to MongoDB: ", err);
        throw err;
    }
    console.info("Connected to MongoDB");
    return cache.conn;
}