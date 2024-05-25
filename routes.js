import express from "express";
import userRouter from "./src/features/users/user.router.js";
import authRouter from "./src/features/authSocial/auth.router.js";

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({
        message: "Node.js Authentication",
        status: true
    })
})

router.use('/api/user', userRouter);
router.use('/api/auth', authRouter)


// middleware to handle routes not found
router.use((req, res) => {
    return res.status(404).json({
        message: "APIs not found",
        status: false
    })
})

export default router;
