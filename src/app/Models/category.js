'use strict'
const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')

// const Course = require('./course')

class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //     // define association here
    // }
}

Category.init(
    {
        title: {
            type: DataTypes.STRING,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: DataTypes.STRING,
        image: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'Category',
    }
)


module.exports = Category
