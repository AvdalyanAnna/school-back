'use strict'
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../../config/sequelize')
const Course = require('./course')
const History = require('./history')

class Lesson extends Model {}
Lesson.init(
    {
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'courses',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Lesson',
    }
)

Lesson.belongsTo(Course, { foreignKey: 'courseId', as: 'course' })
Course.hasMany(Lesson, { as: 'lessons', foreignKey: 'courseId' })

// History.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' })
// Lesson.belongsTo(History, { as: 'histories', foreignKey: 'lessonId' })

module.exports = Lesson
