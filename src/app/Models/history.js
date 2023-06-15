'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')
const User = require('./User')
// const Course = require('./course')
const Lesson = require('./lesson')

class History extends Model {}

History.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'course',
                key: 'id',
            },
        },
        lessonId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'lesson',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'History',
    }
)

History.belongsTo(User, { foreignKey: 'userId', as: 'user' })
History.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' })

module.exports = History
