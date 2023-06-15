'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')
const Course = require('./course')
const CourseTest = require('./CourseTest')

class TestAnswer extends Model {}

TestAnswer.init({
  title: DataTypes.STRING,
  courseTestId: {
    type: DataTypes.INTEGER,
    references: {
        model: 'CourseTest',
        key: 'id'
    }
  },
  is_right: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'TestAnswer',
});

TestAnswer.belongsTo(CourseTest, { foreignKey: 'courseTestId', as: 'courseTest' })
CourseTest.hasMany(TestAnswer, { foreignKey: 'courseTestId', as: 'testAnswers' })

module.exports = TestAnswer;
