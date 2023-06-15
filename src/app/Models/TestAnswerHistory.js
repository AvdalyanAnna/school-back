'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')
// const Course = require('./course')

class TestAnswerHistory extends Model {}

TestAnswerHistory.init(
    {
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'courses',
                key: 'id',
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        percent: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'TestAnswerHistory',
    }
)

// CourseTest.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })
// Course.hasMany(CourseTest, { as: 'courseTests', foreignKey: 'courseId' })

module.exports = TestAnswerHistory
