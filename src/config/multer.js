import multer from 'multer'
import path from 'path'
import { randomUUID } from 'crypto'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

export const upload = multer({ storage })