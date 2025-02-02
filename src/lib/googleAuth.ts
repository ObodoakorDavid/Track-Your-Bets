import passport from "passport";
import connectToDatabase from "./mongoose";
import User from "@/models/user";
import { generateToken } from "./auth";

interface GoogleProfile {
  id: string;
  emails: [{ value: string }];
  displayName: string;
  photos: [{ value: string }];
}

var GoogleStrategy = require("passport-google-oauth20");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (
      accessToke: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: any
    ) => {
      try {
        await connectToDatabase();
        const existingUser = await User.findOne({
          email: profile?.emails[0].value,
        });

        // Generate JWT token
        const token = generateToken({
          email: existingUser.email,
          id: existingUser._id,
        });

        if (existingUser) {
          return done(null, { user: existingUser, token });
        }

        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          userName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });

        return done(null, { user: newUser, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
