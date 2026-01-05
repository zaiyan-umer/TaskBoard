import type { Mongoose } from "mongoose";

declare global{
    var mongooseCache: {
        connection: Mongoose | null,
        promise: Promise<Mongoose> | null
    }
}

export {}