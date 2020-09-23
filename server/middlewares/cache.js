import redis from 'redis';
import {parse} from "dotenv";

// Redis port
const redis_port = process.env.REDIS_PORT || 6565;

// Initiate redis client
const redis_client = redis.createClient(redis_port);


export async function addToCache(id, data) {
    await redis_client.setex(id, 3600, JSON.stringify(data));
    console.log('data added to cache');
}

export async function checkCache(req, res, id, next) {
    await redis_client.get(id, (err, data) => {
        if (err) {
            throw err;
        }

        if (data == null) {
            next();
        } else {
            console.log('DATA retrieved from cache');
            res.send(JSON.parse(data));
        }
    });
    return JSON.parse(data);
}




