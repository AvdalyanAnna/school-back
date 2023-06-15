'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')
const Course = require('./course')

class CourseTest extends Model {}

CourseTest.init(
    {
        title: DataTypes.STRING,
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'courses',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'CourseTest',
    }
)

CourseTest.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })
Course.hasMany(CourseTest, { as: 'courseTests', foreignKey: 'courseId' })

module.exports = CourseTest
