const passport = require('passport');

const chummaFunction = async (req, res) => {
    console.log(3);
    res.status(200).json({
        status: true,
        message: "Hello, you entered into a test router"
    });
};

const authenticateRoute = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) 
        {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
                error: err || "Invalid JWT token"
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = { chummaFunction, authenticateRoute };
