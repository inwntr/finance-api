import { prisma } from "../config/prisma.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export class UserController {
  async updateProfile(req, res) {
    try {
      const { username } = req.body;

      const currentUser = await prisma.user.findUnique({
        where: {
          id: req.userId
        }
      });

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const data = {};
      const normalizedUsername = username?.trim();

      if (normalizedUsername && normalizedUsername !== currentUser.username) {
        const usernameExists = await prisma.user.findUnique({
          where: {
            username: normalizedUsername
          }
        });

        if (usernameExists) {
          return res.status(409).json({ message: "Username already in use" });
        }

        data.username = normalizedUsername;
      }

      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        data.avatarUrl = result.secure_url;
      }

      const user = await prisma.user.update({
        where: {
          id: req.userId
        },
        data,
        select: {
          id: true,
          username: true,
          email: true,
          avatarUrl: true
        }
      });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
