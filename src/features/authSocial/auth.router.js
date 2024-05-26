import passport from "passport";
import express from "express";
import { googlePassportConfig } from "../../middleware/authGoogle.middleware.js";

const authRouter = express.Router();

authRouter.get(
  "/google",
  googlePassportConfig.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  googlePassportConfig.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or user profile
    res.redirect("/");
  }
);

// Route to log out
authRouter.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

export default authRouter;
