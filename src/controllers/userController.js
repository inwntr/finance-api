import { prisma } from '../config/prisma.js'
import fs from 'fs'
import path from 'path'

export class UserController {
  async updateProfile(req, res) {
    try {
      const { username } = req.body

      const currentUser = await prisma.user.findUnique({
        where: {
          id: req.userId
        }
      })

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      const data = {}

      if (username) {
        data.username = username
      }

      if (req.file) {
        if (currentUser.avatarUrl) {
          const oldAvatarPath = path.resolve(
            currentUser.avatarUrl.replace('/uploads/', 'uploads/')
          )

          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath)
          }
        }

        data.avatarUrl = `/uploads/${req.file.filename}`
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
      })

      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}