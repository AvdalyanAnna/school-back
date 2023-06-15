const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('module-alias/register')

const AuthRouter = require('./router/auth.router')
const CategoryRouter = require('./router/category.router')
const CourseRouter = require('./router/course.router')
const LessonRouter = require('./router/lesson.router')
const TeachersRouter = require('./router/teacher.router')
const TestRouter = require('./router/test.router')

require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(
    cors({
        origin: ['http://localhost:8080'],
        credentials: true,
    })
)

app.use(cookieParser())

app.use(express.json())

app.use('/api/auth', AuthRouter)
app.use('/api/categories', CategoryRouter)
app.use('/api/courses', CourseRouter)
app.use('/api/lessons', LessonRouter)
app.use('/api/teachers', TeachersRouter)
app.use('/api/tests', TestRouter)

const start = () => {
    try {
        app.listen(PORT, () =>
            console.log(`Server has been started on port ${PORT}...`)
        )
    } catch (e) {
        console.log(e)
    }
}

start()
