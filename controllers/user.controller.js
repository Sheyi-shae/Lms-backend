import db from "../libs/db.js";
import sendVerificationEmail from "../libs/email.verificationcode.js";

export default async function getAllUsers(req, res, next) {
    try {
        const users = await db.user.findMany();
        if (!users) {
            const error = new Error('No users found');
            error.status = 404;
            throw error;
        }
        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        });
    } catch (error) {
        next(error);
    }

}

export async function getUserByID(req, res, next) {
    const { id } = req.params;

    try {
        const user = await db.user.findUnique({
            where: { id },
            include: {
                teaching: true, //courses the user is teaching
                courses: true, //courses the user is enrolled in
            },
        });

        if (!user) {
            const error = new Error('User not found');
            error.status = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: `User with ${user.email} fetched successfully`,
            user
        })
    } catch (error) {
        next(error);
    }

}

export async function updateUserByID(req, res, next) {
    const { id} = req.params;
    const { name,phone, avatar,instructorTitle } = req.body;
    const userId = req.user.id; //gotten from the jwt token
  
    try {
      const user = await db.user.findUnique({
        where: { id},
      });
  
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
  
      if (user.id !== userId) {
        const error = new Error("You are not authorized to update this profile");
        error.status = 403;
        throw error;
      }
  
      const updatedUser = await db.user.update({
        where: { id },
        data: {
            name,phone ,avatar,instructorTitle
  
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function verifyUser(req, res, next) {
   
    const { otpValue} = req.body;
    const {id} = req.params 
    const userId = req.user.id; //gotten from the jwt token
    
  
    try {
      const user = await db.user.findUnique({
        where: { id},
      });
  
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
  
      
      if (user.isVerified) {
        const error = new Error("User is already verified");
        error.status = 400;
        throw error;
      }
      if (user.id !== userId) {
        const error = new Error("You are not authorized to verify this account");
        throw error;
      }
  if (user.verificationToken !== otpValue) {
        const error = new Error("Invalid verification token");
        error.status = 400;
        throw error;
      }
      const updatedUser = await db.user.update({
        where: { id },
        data: {
             isVerified: true,
             verificationToken: null,
  
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "Your account has been verified successfully",
         updatedUser
      });
    } catch (error) {
      next(error);
    }
  }


  export async function resendVerificationEmail(req, res, next) {
    const { id} = req.params; 
  
    try {
      const user = await db.user.findUnique({
        where: { id},
      });
  
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
  
      
      if (user.isVerified) {
        const error = new Error("User is already verified");
        error.status = 400;
        throw error;
      }
  
      // Generate a new verification token
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Update the user's verification token in the database
      await db.user.update({
        where: { id },
        data: {
          verificationToken,
        },
      });
      const email = user.email;
  
     await sendVerificationEmail(email, verificationToken);
  
      return res.status(200).json({
        success: true,
        message: "Verification email resent successfully",
        
      });
    } catch (error) {
      next(error);
    }
  }


  //update user interests here
export async function updateUserInterests(req, res, next) {
    const { selectedIds } = req.body; 
    const {id}= req.params
    console.log('selectedIds', selectedIds)

    try {
        const user = await db.user.findUnique({
            where: { id },
        });
        

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        if (user.id !== id) {
            const error = new Error("You are not authorized to update this profile");
            error.status = 403;
            throw error;
        }

const updatedUser = await db.user.update({
  where: { id },
  data: {
    selectedInterest: true,
    interests:selectedIds,
  },
});

 return res.status(200).json({
            success: true,
            message: "User interests updated successfully",
           data:updatedUser
        });
    } catch (error) {
        next(error);
    }
  }

