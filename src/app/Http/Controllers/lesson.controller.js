const Lesson = require('@/app/Models/lesson.js')
const Course = require('@/app/Models/course.js')
const History = require('@/app/Models/history.js')
const sequelize = require('../../../config/sequelize')
const {auth} = require("mysql/lib/protocol/Auth");

class LessonController {
    async getAll(req, res) {
        const lessons = await Lesson.findAll({
            order: [['id', 'DESC']],
            include: [
                {
                    as: 'course',
                    model: Course,
                    attributes: ['title', 'slug', 'description', 'image'],
                },
            ],
        })
        return res.json(lessons)
    }

    async getOne(req, res) {
        const authId = req.auth.id
        const {slug} = req.params

        const lesson = await Lesson.findOne({
            where: {slug},
            include: [
                {
                    as: 'course',
                    model: Course,
                    attributes: ['title', 'slug', 'description', 'image'],
                },
            ],
        })

        const nextLesson = await Lesson.findOne({
            where: {level: lesson.level + 1, courseId: lesson.courseId},
        })

        const lastLesson = await Lesson.findOne({
            where: {level: lesson.level - 1, courseId: lesson.courseId},
        })

        const lessonHistory = await History.findOne({
            where: {
                userId: authId,
                lessonId: lesson.id
            }
        })

        if (lessonHistory) {
            await History.destroy({
                where: {
                    userId: authId,
                    lessonId: lesson.id
                }
            })
        }

        await History.create({
            userId: authId,
            courseId: lesson.courseId,
            lessonId: lesson.id,
        })

        return res.json({lesson, nextLesson, lastLesson})
    }

    async create(req, res) {
        const {title, slug, description, courseId} = req.body

        let image = null
        if (req.files && req.files[0]) image = req.files[0].filename

        const candidate = await Lesson.findOne({
            where: {slug},
        })

        if (candidate) {
            return res
                .status(400)
                .json({message: 'Урок с таким slug уже существует'})
        }
        try {
            const lesson = await Lesson.create({
                title,
                slug,
                description,
                image,
                level: 1,
                courseId: +courseId,
            })
            return res.json({
                title,
                slug,
                description,
                image,
                level: 1,
                courseId,
                success: true,
                message: 'Урок успешно создан',
            })
        } catch (e) {
            res.json({
                success: false,
                e,
                message: 'Ошибка при создании урока',
            })
        }
    }

    async update(req, res) {
        const {id} = req.params
        const {title, slug, description, courseId} = req.body
        let image = null
        if (req.files[0]) image = req.files[0].filename
        try {
            const findLesson = await Lesson.findOne({where: {courseId}})
            if (!image) image = findLesson.image
            const lesson = await Lesson.update(
                {
                    title,
                    slug,
                    description,
                    image,
                    level: findLesson.level + 1 || 1,
                    courseId,
                },
                {
                    where: {id},
                }
            )
            return res.json({
                success: true,
                message: 'Урок успешно обновлен',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при обновлении урока',
            })
        }
    }

    async destroy(req, res) {
        const {id} = req.params
        try {
            const candidate = await Lesson.findOne({
                where: {id},
            })
            if (candidate && candidate.id === +id) {
                await Lesson.destroy({
                    where: {id},
                })
                res.json({
                    success: true,
                    message: 'удалена',
                })
            }

            res.json({
                success: false,
                message: 'Ошибка при удалении',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при удалении',
            })
        }
    }

    async getCourseLesson(req, res) {
        const {id} = req.params
        const lessons = await Lesson.findAll({
            where: {courseId: id},
            order: [['level', 'ASC']],


        })

        return res.json(lessons)
    }
}

module.exports = new LessonController()
