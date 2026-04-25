import { prisma } from '../config/prisma.js'

export class UserController {
  async updateProfile(req, res) {
    try {
      const { username } = req.body

      const data = {}

      if (username) {
        data.username = username
      }

      if (req.file) {
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