const Router = require('express')
const router = new Router()
const controller = require('@/app/Http/Controllers/teacher.controller')

router.get('/', controller.getAll)

module.exports = router
