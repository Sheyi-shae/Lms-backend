
import db from '../libs/db.js';
import jwt from 'jsonwebtoken';
import bycrypt from 'bcryptjs';
import crypto from 'crypto';
import sendVerificationEmail from '../libs/email.verificationcode.js';
export default async function authController(req,res,next) {
    const { name,email,password,phone } = req.body;
    
    try {
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // return res.status(400).json({ error: 'Email already exists' });
            const error = new Error('Email already exists');
            error.status = 409;
            throw error;
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);
        //generate random verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();



        const newUser = await db.user.create({
            data: {
                name,email,password:hashedPassword,phone,verificationToken,interests: []
            }
        });
        await sendVerificationEmail(email, verificationToken);

        return res.status(201).json({
            success: true,
            message: 'Registration successful, please log in to continue',
            data: newUser
        });
    } catch (error) {
       
        next(error)
    }
}



export async function signinController(req,res,next) {
    const { email,password} = req.body;
    
    try {
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            // return res.status(400).json({ error: 'Email already exists' });
            const error = new Error('Account does not exist');
            error.status = 409;
            throw error;
        }

        const validatePassword = await bycrypt.compare(password, user.password);    
        if (!validatePassword) {
            const error = new Error('Invalid password');
            error.status = 409;
            throw error;
        }

        
      const token=  jwt.sign( { id: user.id },
         process.env.JWT_SECRET, 
         {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
         // Set token in httpOnly cookie
       res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS only)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
          
        return res.status(201).json({
            success: true,
            message: 'login successful',
            data: {token,user}
        });
    } catch (error) {
        
        next(error)
    }

}


export async function verifyUserController(req,res,next) {
    const email=req.user.email
    const { id } = req.params;
        const { verificationToken} = req.body;
      
        try {
          const user = await prisma.user.findUnique({ where: { email } });
      
          if (!user || user.verificationToken !== verificationToken) {
         
            const error = new Error('Invalid verification code.');
            error.status = 401;
            throw error;
        }
      
          await prisma.user.update({
            where: { email },
            data: { isVerified: true,verificationToken: null },
          });
      
          res.json({ message: "Email verified successfully!" });
        } catch (error) {
            next(error)
        }
}



export const logoutUser = (req, res) => {
    console.log('Logging out user');
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

  