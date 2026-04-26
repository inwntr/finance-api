import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { UserController } from '../controllers/userController.js'
import { upload } from '../config/multer.js'

const userRoutes = Router()
const userController = new UserController()

userRoutes.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'Authorized',
    userId: req.userId
  })
})

userRoutes.patch(
  '/profile',
  authMiddleware,
  upload.single('avatar'),
  userController.updateProfile
)

userRoutes.patch(
  '/password',
  authMiddleware,
  userController.updatePassword
)

export default userRoutes
