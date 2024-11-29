import express from 'express'
import {
    getStaffs,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
} from '../controllers/staffController.js'

import { uploadAvatar } from '../middlewares/uploadImage/multer.js'
import { verifyJWT } from '../middlewares/auth/auth.js'
import { restrictTo, updatePassword } from '../controllers/authController.js'

const router = express.Router()

router.use(verifyJWT)

router
    .route('/')
    .get(getStaffs)
    .post(uploadAvatar.single('avatar'), createStaff)

router
    .route('/:id')
    .get(getStaffById)
    .patch(uploadAvatar.single('avatar'), updateStaff)
    .delete(restrictTo('admin'), deleteStaff)

export default router
