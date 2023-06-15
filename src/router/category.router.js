const Router = require('express')
const router = new Router()
const controller = require('@/app/Http/Controllers/category.controller')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,  '/Users/anna/eph/node/src/files')
    },
    filename: function (req, file, callback) {
        const filename = `file_${crypto.randomUUID()}_${file.originalname}` // Create custom filename (crypto.randomUUID available in Node 19.0.0+ only)
        callback(null, filename)
    },
})

const upload = multer({
    storage: storage
})

router.get('/', controller.getAll)
router.post('/', upload.any(), controller.create)
router.put('/:id', upload.any(), controller.update)
router.delete('/:id', controller.destroy)
router.get('/:slug', controller.getOne)
router.get('/:slug/courses', controller.getCourses)
module.exports = router
