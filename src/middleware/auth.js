const jwt = require('jsonwebtoken');

function userAuth(req, res, next) {
    const { authorization } = req.headers;
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

                jwt.verify(token, global.config.JWT_SECRET, (err, decodedToken) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            return res.status(401).json({
                                status: false,
                                message: res.__("TOKEN_EXPIRED"),
                            });
                        }
                        return res.status(401).json({
                            status: false,
                            message: res.__("INVALID_TOKEN") + err,
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

module.exports = { userAuth };
