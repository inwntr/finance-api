import multer from 'multer'
import { randomUUID } from 'crypto'

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

  filename: (req, file, cb) => {
    const uniqueName = `${randomUUID()}-${file.originalname}`
    cb(null, uniqueName)
  }
})
