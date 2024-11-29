import express from 'express'
import {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderStatistics,
    getTotalAmountLast12Months,
    getOverallStatistics,
    getTotalProductLast12Months,
} from '../controllers/orderController.js'
import { verifyJWT } from '../middlewares/auth/auth.js'

const router = express.Router()

router.use(verifyJWT)

router.route('/').get(getAllOrders).post(createOrder)
router.route('/statistics').get(getOrderStatistics)
router.route('/total-amount-last-12-months').get(getTotalAmountLast12Months)
router.route('/total-product-last-12-months').get(getTotalProductLast12Months)
router.route('/overall-statistics').get(getOverallStatistics)
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder)

export default router
