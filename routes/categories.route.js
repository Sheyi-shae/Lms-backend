import { Router } from 'express';
import { authenticateUser, verifiedUser } from '../middlewares/auth.middleware.js';
import { createCategory, getAllCategories } from '../controllers/category.controller.js';



const categoryRouter = Router();
categoryRouter.post('/', authenticateUser,
    verifiedUser,createCategory);

  
categoryRouter.get('/all',getAllCategories);


export default categoryRouter