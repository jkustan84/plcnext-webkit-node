const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
require('dotenv').config();

let cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};

let opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            let user = JSON.parse(fs.readFileSync('./config/user.json'));

            if (user.userId == jwt_payload.userId){
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    );
};