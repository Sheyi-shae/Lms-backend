import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRouter from './routes/auth.route.js';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import errorHandler from './middlewares/error.middleware.js';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.route.js';
import enrollmentRouter from './routes/enroll.route.js';
import uploadRouter from './routes/upload.route.js';
import certificateRouter from './routes/cert.route.js';
import categoryRouter from './routes/categories.route.js';

//load env
dotenv.config();
const prisma = new PrismaClient();


const app = express();
// Middleware


const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // This is required for sending cookies
  })
);



app.use(express.json()); //parse json request body
app.use(express.urlencoded({ extended: false }));
 app.use(cookieParser());
//routes
app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/course',courseRouter);
app.use('/api/enroll',enrollmentRouter);
app.use('/api/upload',uploadRouter); 
app.use('/api/certificate',certificateRouter) 
app.use('/api/category',categoryRouter);

app.get('/', (req, res) => {
  res.json('Welcome to the backend server!');
})


//db connect check 
async function checkDB() {
    try {
      await prisma.$connect();
      console.log("✅ MongoDB connected successfully!");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
    }
  }
  checkDB();
// Error Handling Middleware (MUST be last)
app.use(errorHandler);

app.listen(process.env.PORT || 5500, () => {
 
    console.log(`Server is listening on port ${process.env.PORT}`);
});
