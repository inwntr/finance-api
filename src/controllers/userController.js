import bcrypt from "bcrypt";
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

const normalizedUsername = username
  ?.trim()
  .replace(/^@+/, "")
  .toLowerCase();

if (normalizedUsername && normalizedUsername !== currentUser.username) {
  const usernameExists = await prisma.user.findFirst({
    where: {
      username: normalizedUsername,
      NOT: {
        id: req.userId
      }
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

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Current password and new password are required"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password must be at least 6 characters"
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: req.userId
        }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordMatches = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatches) {
        return res.status(401).json({ message: "Current password is invalid" });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: req.userId
        },
        data: {
          password: passwordHash
        }
      });

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
