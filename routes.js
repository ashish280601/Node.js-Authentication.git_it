import express from "express";
import userRouter from "./src/features/users/user.router.js";
import authRouter from "./src/features/authSocial/auth.router.js";

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({   
        message: "Welcome to the Home Page!",
        status: true
    })
})

router.use('/api/user', userRouter);

// google router
router.use('/api/auth', authRouter)


// middleware to handle routes not found
router.use((req, res) => {
    return res.status(404).json({
        message: "APIs not found",
        status: false
    })
})

// Example of a protected route
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: `Hello, ${req.user.name}` });
  });

export default router;
