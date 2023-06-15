const { json } = require('body-parser')
const CourseTest = require('../../Models/CourseTest')
const TestAnswer = require('../../Models/TestAnswer')
const Course = require('../../Models/course')
const TestAnswerHistory = require('../../Models/TestAnswerHistory')

class TestController {
    async getAllByCourseId(req, res) {
        const courseId = req.params.courseId
        const tests = await CourseTest.findAll({
            where: { courseId },
            order: [['id', 'DESC']],
            include: [
                {
                    model: TestAnswer,
                    as: 'testAnswers',
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title'],
                },
            ],
        })

        return res.json(tests)
    }

    async store(req, res) {
        const { title, courseId, answers } = req.body

        const courseTest = await CourseTest.create({
            title,
            courseId,
        })

        const testId = courseTest.id

        for (const answer of answers) {
            await TestAnswer.create({
                courseTestId: testId,
                title: answer.title,
                is_right: answer.is_right,
            })
        }

        await courseTest.reload({
            include: {
                model: TestAnswer,
                as: 'testAnswers',
            },
        })

        return res.json({
            message: 'Тест успешно создан',
            success: true,
            data: courseTest,
        })
    }

    async exam(req, res) {
        const courseId = req.body.courseId
        const answers = req.body.answers
        const userId = req.auth.id

        const tests = await CourseTest.findAll({
            where: {
                courseId,
            },
            include: [{ model: TestAnswer, as: 'testAnswers' }],
        })

        const testCount = tests.length

        const rightAnswerCount = await TestAnswer.count({
            where: {
                id: answers,
                is_right: true,
            },
        })

        //
        const percent = Math.round((rightAnswerCount / testCount) * 100)

        // await TestAnswerHistory.create({
        //     userId,
        //     courseId,
        //     percent,
        // })
        return res.json({success: true,percent, testCount,rightAnswerCount})
    }

    async getExamHistory(req, res) {
        const authId = req.auth.id
        const courseId = req.body.courseId

        let where = {}
        if (courseId) {
            where.courseId = courseId
        }

        const answersHistory = await TestAnswerHistory.findAll({
            where: {
                userId: authId,
                ...where,
            },
        })

        return res.json({
            success: true,
            data: answersHistory,
        })
    }
}

module.exports = new TestController()
