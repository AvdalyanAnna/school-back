const Router = require('express')
const router = new Router()
const controller = require('@/app/Http/Controllers/test.controller')
const authMiddleware = require('../app/Http/Middleware/auth.check')

router.get('/get-exam-history', authMiddleware, controller.getExamHistory)
router.get('/:courseId', controller.getAllByCourseId)
router.post('/', controller.store)
router.post('/exam', authMiddleware, controller.exam)

module.exports = router
