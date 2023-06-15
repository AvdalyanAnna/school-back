const User = require('../../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { validationResult } = require('express-validator')
const roles = require('@/config/roles.json')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const History = require('../../Models/history')
const Lesson = require('../../Models/lesson')
require('dotenv').config()

const generateAccessToken = (userData) => {
    return jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '24h' })
}

// настройка паспорта
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({
                where: {
                    provider_id: profile.id,
                    provider: profile.provider,
                },
            })

            if (!user) {
                const hashPassword = bcrypt.hashSync(profile.id, 7)
                user = await User.create({
                    email: profile._json.email,
                    password: hashPassword,
                    first_name: profile._json.given_name,
                    last_name: profile._json.family_name,
                    role: roles.student,
                    provider: profile.provider,
                    provider_id: profile.id,
                })
            }

            const token = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            })

            done(null, token)
        }
    )
)

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'email', 'photos', 'name'],
        },
        async (accessToken, refreshToken, profile, done) => {
            let user = await User.findOne({
                where: {
                    provider_id: profile.id,
                    provider: profile.provider,
                },
            })

            if (!user) {
                const hashPassword = bcrypt.hashSync(profile.id, 7)
                user = await User.create({
                    email: profile._json.email || null,
                    first_name: profile._json.first_name || null,
                    last_name: profile._json.last_name || null,
                    password: hashPassword,
                    role: roles.student,
                    provider_id: profile.id,
                    provider: profile.provider,
                })
            }

            const token = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            })

            done(null, token)
        }
    )
)

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Registration error',
                    errors: errors.errors,
                })
            }
            const { email, password, role, first_name, last_name } = req.body

            const candidate = await User.findOne({
                where: { email, provider: null },
            })

            if (candidate) {
                return res.status(400).json({
                    message: 'Пользователь с таким email уже существует',
                })
            }
            const hashPassword = bcrypt.hashSync(password, 7)

            const user = await User.create({
                email,
                password: hashPassword,
                role: roles[role],
                first_name,
                last_name,
            })
            res.json({
                success: true,
                message: 'Пользователь успешно зарегистрирован',
            })
        } catch (error) {
            console.log(error)
            return res
                .status(400)
                .json({ success: false, message: 'Registration error', error })
        }
    }

    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Registration error',
                    errors: errors.errors,
                })
            }
            const { email, password, first_name, last_name } = req.body
            const candidate = await User.findOne({
                where: { email, provider: null },
            })

            if (candidate) {
                return res.status(400).json({
                    message: 'Пользователь с таким email уже существует',
                })
            }
            const hashPassword = bcrypt.hashSync(password, 7)

            const user = await User.create({
                email,
                password: hashPassword,
                role: 3,
                first_name,
                last_name,

            })
            res.json({
                success: true,
                message: 'Пользователь успешно зарегистрирован',
            })
        } catch (error) {
            console.log(error)
            return res
                .status(400)
                .json({ success: false, message: 'Registration error', error })
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Login error',
                    errors: errors.errors,
                })
            }
            const { email, password } = req.body

            const user = await User.findOne({ where: { email } })

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Пользователь не найден',
                })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Неверный пароль' })
            }
            const token = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            })

            return res
                .cookie('token', token, {
                    maxAge: 86400000,
                    httpOnly: true,
                    secure: false,
                })
                .json({ success: true, message: 'Успешная авторизация', token })
        } catch (error) {
            return res
                .status(400)
                .json({ success: false, message: 'Login error', error })
        }
    }

    async users(req, res) {
        try {
            console.log('Hello World!')
            res.json({ message: 'Hello World!' })
        } catch (error) {
            return res
                .status(400)
                .json({ success: false, message: 'Login error', error })
        }
    }

    async user(req, res) {
        try {
            const { id } = req.auth
            const user = await User.findOne({ where: { id } })

            const { password, ...data } = user.toJSON()
            return res.json({ data })
        } catch (error) {
            return res
                .status(400)
                .json({ success: false, message: 'Login error', error })
        }
    }

    async googleAuthCallback(req, res) {
        const token = req.user
        res.cookie('token', token, { maxAge: 86400000, httpOnly: true })
        return res.redirect(process.env.CLIENT_URL)
    }

    async facebookAuthCallback(req, res) {
        const token = req.user
        res.cookie('token', token, { maxAge: 86400000, httpOnly: true })
        return res.redirect(process.env.CLIENT_URL)
    }

    async logout(req, res) {
        req.cookie('token', '', { maxAge: 0, httpOnly: true })
        res.sendStatus(200)
    }

    async histories(req, res) {
        const { id } = req.auth

        const histories = await History.findAll({
            where: { userId: id },
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: Lesson,
                    as: 'lesson',
                    attributes: ['id', 'title', 'description', 'slug', 'image'],
                },
            ],
        })

        return res.json(histories)
    }
    async update(req, res) {
        const { id } = req.auth
        const { first_name, last_name, email, phone, skill, bio } = req.body
        const user = await User.update(
            {
                first_name,
                last_name,
                email,
                phone,
                skill,
                bio,
            },
            {
                where: { id },
            }
        )
        return res.json({ user, data: req.body })
    }
}

module.exports = new authController()
