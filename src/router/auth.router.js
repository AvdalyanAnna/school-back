const Router = require('express')
const router = new Router()
const authMiddleware = require('../app/Http/Middleware/auth.check')
const controller = require('../app/Http/Controllers/auth.controller')
const { check } = require('express-validator')
const roles = require('@/config/roles.json')
const passport = require('passport')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/Users/anna/eph/node/src/files')
    },
    filename: function (req, file, callback) {
        const filename = `file_${crypto.randomUUID()}_${file.originalname}` // Create custom filename (crypto.randomUUID available in Node 19.0.0+ only)
        callback(null, filename)
    },
})

const upload = multer({
    storage: storage,
})
router.post(
    '/registration',
    [
        check('email', 'Incorrect email').isEmail(),
        check(
            'password',
            'Password must be longer than 6 and shorter than 20'
        ).isLength({ min: 6, max: 20 }),
        check('role', 'Role is not valid').isIn(roles),
    ],
    controller.registration
)
// router.post(
//     '/registration/teacher',
//     upload.any(),
//     controller.registrationTeacher
// )

router.post(
    '/login',
    [
        check('email', 'Incorrect email').isEmail(),
        check(
            'password',
            'Password must be longer than 6 and shorter than 20'
        ).isLength({ min: 6, max: 20 }),
    ],
    controller.login
)
router.get('/users', controller.users)

router.get('/user', authMiddleware, controller.user)

router.get('/histories', authMiddleware, controller.histories)
router.post('/update', authMiddleware, controller.update)

router.post('/logout', authMiddleware, controller.logout)

router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
    })
)
router.get(
    '/facebook',
    passport.authenticate('facebook', { session: false, scope: ['email'] })
)
// маршрут для обратного вызова Google
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }),
    controller.googleAuthCallback
)

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    controller.facebookAuthCallback
)
module.exports = router
