import express from 'express'

import { uploadAvatar } from '../middlewares/uploadImage/multer.js'
import { verifyJWT } from '../middlewares/auth/auth.js'
import {
    forgotPassword,
    login,
    logout,
    resendLoginEmail,
    resetPassword,
    updatePassword,
} from '../controllers/authController.js'
import { createStaff } from '../controllers/staffController.js'

const router = express.Router()

router.post('/login', login)
router.post('/signup', uploadAvatar.single('avatar'), createStaff)
router.route('/logout').post(logout)

router.use(verifyJWT)

router.route('/resetPassword/:token').patch(resetPassword)
router.route('/forgotPassword').post(forgotPassword)
router.route('/updatePassword/:id').patch(updatePassword)
router.route('/resendEmail').post(resendLoginEmail)

export default router
