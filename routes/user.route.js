import { Router } from 'express';
import getAllUsers, { getUserByID, resendVerificationEmail, updateUserByID, updateUserInterests, verifyUser } from '../controllers/user.controller.js';
import { authenticateUser, authorizeRole, verifiedUser } from '../middlewares/auth.middleware.js';

const userRouter = Router();

//fetch all users
userRouter.get('/',authenticateUser, authorizeRole(["instructor"]), getAllUsers);
userRouter.get('/:id',authenticateUser,getUserByID)
userRouter.put('/:id',authenticateUser,updateUserByID)
userRouter.put('/verify-user/:id',authenticateUser,verifyUser)
userRouter.put('/resend/:id',authenticateUser,resendVerificationEmail)
//update user interests
userRouter.put('/interests/:id', authenticateUser, verifiedUser, updateUserInterests);

//userRouter.put('/interest/:id', authenticateUser, verifiedUser,updateUserInterest );


export default userRouter;