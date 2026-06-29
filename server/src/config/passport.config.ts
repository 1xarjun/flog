import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/user.model";

passport.use(
  new Strategy(
    // Strategy options
    {
      usernameField: "email",
      passwordField: "password",
    },
    // verify function
    async (email, password, done) => {
      const user = await User.findByEmail(email);
      if (!user) return done(null, false);
      const verified = await user.verifyPassword(password);
      if (!verified) return done(null, false);
      return done(null, user); // only this gets to req.logIn
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).select("-hashedPassword");
  if (!user) return done(null, false);
  return done(null, user);
});
