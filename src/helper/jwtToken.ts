import jwt from 'jsonwebtoken'
import { config } from './constant';
import * as dotenv from 'dotenv';
dotenv.config();
// function to generate token
const generateToken = function (user: any) {
    try {
        let payload = user
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXIPIRATION_TIME })
        return token
    }
    catch (e: any) {
        console.log(e)
    }
}

export { generateToken }