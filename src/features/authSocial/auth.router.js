import express from "express";

const authRouter = express().router();

authRouter.get('/google', passportConfig.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
passportConfig.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect to dashboard or user profile
        res.redirect('/dashboard');
    }
);

export default authRouter;