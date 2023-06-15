const Course = require('@/app/Models/course.js')
const Category = require('@/app/Models/category.js')
const User = require('@/app/Models/User.js')
const History = require('@/app/Models/history.js')
const Lesson = require('@/app/Models/lesson.js')

class CourseController {
    async getAll(req, res) {
        const authId = req.auth.id
        const courses = await Course.findAll({
            include: [
                {
                    as: 'category',
                    model: Category,
                    attributes: ['title', 'slug', 'description', 'image'],
                },
                {
                    as: 'teacher',
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },
            ],
        })

        const progressPromises = courses.map(async (course) => {
            const courseLessonsCount = await Lesson.count({
                where: {
                    courseId: course.id,
                },
            })

            const courseHistoryCount = await History.count({
                where: {
                    userId: authId,
                    courseId: course.id,
                },
            })

            const progress = (courseHistoryCount / courseLessonsCount) * 100

            return {
                course,
                progress,
                courseLessonsCount,
                courseHistoryCount,
            }
        })

        const progressResults = await Promise.all(progressPromises)

        return res.json(progressResults)
    }

    async getOne(req, res) {
        const { slug } = req.params
        const authId = req.auth.id

        const course = await Course.findOne({
            where: { slug },
            include: [
                {
                    as: 'category',
                    model: Category,
                    attributes: ['title', 'slug', 'description', 'image'],
                },
                {
                    as: 'teacher',
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },
            ],
        })

        const courseHistoryCount = await History.findAll({
            where: {
                userId: authId,
                courseId: course.id,
            },
        })

        const history_lessons_id = courseHistoryCount.map((item) => {
            return item.lessonId
        })

        return res.json({ course, history_lessons_id })
    }

    async create(req, res) {
        const { title, slug, description, categoryId, userId } = req.body
        let image = null
        if (req.files[0]) image = req.files[0].filename
        const candidate = await Course.findOne({
            where: { slug },
        })
        if (candidate) {
            return res
                .status(400)
                .json({ message: 'Курс с таким slug уже существует' })
        }
        try {
            const course = await Course.create({
                title,
                slug,
                description,
                image,
                categoryId,
                userId,
            })
            return res.json({
                course,
                success: true,
                message: 'Курс успешно создан',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при создании курса',
            })
        }
    }

    async update(req, res) {
        const { id } = req.params
        const { title, slug, description, categoryId, userId } = req.body
        let image = null
        if (req.files[0]) image = req.files[0].filename
        try {
            const candidate = await Course.findOne({
                where: { id },
            })
            if (candidate && candidate.id === +id) {
                if (!image) image = candidate.image
                const course = await Course.update(
                    {
                        title,
                        slug,
                        description,
                        image,
                        categoryId,
                        userId,
                    },
                    {
                        where: { id },
                    }
                )
                return res.json({
                    success: true,
                    message: 'Курс успешно обновлен',
                })
            }
            res.json({
                success: false,
                message: 'Категория не найдена',
            })
        } catch (e) {
            res.json({
                success: false,
                message: 'Ошибка при обновлении курса',
            })
        }
    }

    async destroy(req, res) {
        const { id } = req.params
        try {
            const candidate = await Course.findOne({
                where: { id },
            })
            if (candidate && candidate.id === +id) {
                await Course.destroy({
                    where: { id },
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

    async getProgress(req, res) {
        const courseLessonsCount = await Lesson.count({
            where: {
                courseId: req.params.id,
            },
        })

        const courseHistoryCount = await History.count({
            where: {
                userId: req.auth.id,
                courseId: req.params.id,
            },
        })

        return res.json({
            progress: (courseHistoryCount / courseLessonsCount) * 100,
            courseLessonsCount,
            courseHistoryCount,
        })
    }
}

module.exports = new CourseController()
