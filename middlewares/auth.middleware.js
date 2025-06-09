import jwt  from "jsonwebtoken";
import db from "../libs/db.js";


export  const authenticateUser =async (req, res, next) => {
  //const token = req.header("Authorization")?.split(" ")[1];  // Get token from header

  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: "Access denied. Please log in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //uses id stored in the token fresh data from the db each time an
    //update is made
    const user = await db.user.findUnique({
      where: { id: decoded.id }
  });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
}

req.user = user;  // Attach fresh user data to request
next();
  } catch (error) {
    return res.status(403).json({ message: "Please log in again." });
  }
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user?.role)) {
      
      return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    next();
  };
};

export const verifiedUser = (req, res, next) => {
  if (!req.user?.isVerified) {
    return res.status(403).json({ message: "Please verify your email first." });
  }
  next();
};



