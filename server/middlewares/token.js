import { sign } from 'jsonwebtoken';

export function generateToken(payload) {
    sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        return token
    });
}