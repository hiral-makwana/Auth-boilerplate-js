import jwt from 'jsonwebtoken';
import { config } from '../helper/constant';

export function verifyToken(req: any, res: any, next: any) {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith("Bearer")) {
        try {
            if (authorization.split(" ")[1]) {
                const token = authorization.split(" ")[1];
                if (!token) {
                    return res.status(401).json({
                        status: false,
                        message: res.__("TOKEN_NOT_FOUND"),
                    });
                }

                jwt.verify(token, process.env.JWT_SECRET, (err: any, decodedToken: any) => {
                    if (err) {
                        return res.status(401).json({
                            status: false,
                            message: res.__("INVALID_TOKEN"),
                        });
                    }
                    req.user = decodedToken;
                    next();
                });
            }
        }
        catch (e) {
            console.error(e);
            return res.status(500).json({
                status: false,
                message: res.__("SERVER_ERR") + e.message,
            });
        }
    }
    else {
        return res.status(500).json({
            status: false,
            message: res.__("TOKEN_NOT_FOUND"),
        });
    }
}
