'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')
const Category = require('./category')
const User = require('./User')
const History = require('./history')

class Course extends Model {}

Course.init(
    {
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'category',
                key: 'id',
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: DataTypes.STRING,
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
        image: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'course',
    }
)

Course.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })
Category.hasMany(Course, { as: 'courses', foreignKey: 'categoryId' })

Course.belongsTo(User, { foreignKey: 'userId', as: 'teacher' })

// console.log(History.hasMany, Category.hasMany)
// console.log({ History }, { Category })
//Course.hasMany(History, { as: 'course_history', foreignKey: 'courseId' })

module.exports = Course
