import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LMS-media", 
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "pdf"], 
    resource_type: "auto",
  },
});

const upload = multer({ storage });

export { upload, cloudinary };
