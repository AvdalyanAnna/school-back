const User = require('../../Models/User')
const roles = require('@/config/roles.json')
class LessonController {
    async getAll(req, res) {
        const users = await User.findAll({ where: { role: roles.teacher } })
        return res.json(users)
    }
}

module.exports = new LessonController()
