import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { upload } from '../libs/multerConfig.js';

const uploadRouter = Router();


uploadRouter.post("/", authenticateUser, upload.single("file"), (req, res) => {
    try {
      res.json({ url: req.file.path });
    } catch (error) {
      res.status(500).json({ error: "File upload failed" });
    }
  });

export default uploadRouter;