const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const USER_MODEL = require('../models/userModel');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },

        async(accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                let user = await USER_MODEL.findOne({email});

                if(!user){
                    user = await USER_MODEL.create({
                        fullname: profile.displayName,
                        email,
                        password: "GOOGLE_AUTH",
                        profileImage: {
                            url: profile.photos?.[0]?.value || "",
                            public_id: ""
                        }
                    });
                }

                return done(null,user);
            } catch (error) {
                return done(error,null);
            }
        }
    )
)
module.exports = passport;