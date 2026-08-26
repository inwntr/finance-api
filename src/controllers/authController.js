import { prisma } from '../config/prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthController {
 async register(req, res) {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const normalizedUsername = username
      .trim()
      .replace(/^@+/, '')
      .toLowerCase()

    const normalizedEmail = email
      .trim()
      .toLowerCase()

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: normalizedUsername }
        ]
      }
    })

    if (userExists) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword
      }
    })

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    })
  } catch (error) {
    return res.status(500).json({ "message": "Internal server error" })
  }
}

  async login(req, res) {
    try {
      const { login, password } = req.body

      if (!login || !password) {
        return res.status(400).json({ message: 'Login and password are required' })
      }

      const normalizedLogin = login.trim().toLowerCase()
      const usernameLogin = normalizedLogin.replace(/^@+/, '')

      const user = await prisma.user.findFirst({
  where: {
    OR: [
      { email: normalizedLogin },
      { username: usernameLogin }
    ]
  }
})

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      })
    } catch (error) {
      return res.status(500).json({ "message": "Internal server error" })
    }
  }
}
