/* 
Step to create a social authentication
1. To create an google developer tools credential project to get client & secret id
2. Install the passport & passport-google-auth20.
3. Configure the GoogleStrategy
4. Create a function to save the data of an google username and email
5. Check wheather the data is already exist or not if not then create else use the existing data.

Link --> https://github.com/jaredhanson/passport-google-oauth2?tab=readme-ov-file
*/

// importing the social google library
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { UserModel } from "../users/user.repository";

// configuring my google authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/api/auth/google",
      scope: ["profile"],
      state: true,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      // Find or create user in database based on google profile
      UserModel.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          // create a user if not found in a database.
          const newUser = new UserModel({
            googleId: profile.id,
            name: profile.displayName,
          });
          newUser.save((err, savedUser) => {
            if (err) {
              return cb(err);
            }
            return cb(null, savedUser);
          });
        } else {
          // Return the existing user if found in the database
          return cb(null, user);
        }
      });
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
