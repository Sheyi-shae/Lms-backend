import { Router } from 'express';

import authController, { logoutUser, signinController, verifyUserController } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/sign-up', authController);
authRouter.post('/sign-in', signinController);
authRouter.post('/verify-user',authenticateUser,verifyUserController);
authRouter.post('/logout',logoutUser);
authRouter.get("/user", authenticateUser, async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default authRouter;