const { DataTypes, Model, Sequelize } = require('sequelize')
const sequelize = require('../../config/sequelize')
const roles = require('@/config/roles.json')

class User extends Model {
    isAdmin() {
        return this.role === roles.admin
    }

    isStudent() {
        return this.role === roles.student
    }

    isTeacher() {
        return this.role === roles.teacher
    }

    toJSON() {
        const json = super.toJSON()
        json.roleName = this.roleName
        return json
    }

    get roleName() {
        const flip = (data) =>
            Object.fromEntries(
                Object.entries(data).map(([key, value]) => [value, key])
            )

        const arr = flip(roles)
        console.log(arr[this.role])
        return arr[this.role]
    }
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        skill: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        provider_id: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: roles.student,
        },
    },
    {
        sequelize,
        toJSON: {
            getters: true,
        },
    }
)

module.exports = User
