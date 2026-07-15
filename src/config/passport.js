const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const passport = require("passport");
const Googleuser = require("../models/google");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await Googleuser.findOne({ googleId: profile.id });

      if (!user) {
        user = await Googleuser.create({
          googleId: profile.id,
          firstName: profile.displayName,
          emailId: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

module.exports = passport;