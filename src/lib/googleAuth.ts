import passport from "passport";
import connectToDatabase from "./mongoose";
import User from "@/models/user";
import { generateToken } from "./auth";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      _req: object, 
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        if (!profile?.emails || profile.emails.length === 0) {
          throw new Error("No email associated with Google account");
        }

        const email = profile.emails[0].value;

        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          const token = generateToken({
            email: existingUser.email,
            id: existingUser._id,
          });
          return done(null, { user: existingUser, token });
        }

        // Create a new user
        const newUser = await User.create({
          googleId: profile.id,
          userName: profile.displayName,
          email: email,
          avatar: profile.photos?.[0]?.value || "",
        });

        const token = generateToken({
          email: newUser.email,
          id: newUser._id,
        });

        return done(null, { user: newUser, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
