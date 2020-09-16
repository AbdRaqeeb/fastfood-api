'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Food}) {
            // define association here
            Admin.hasMany(Food, {
                foreignKey: 'admin_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    };
    Admin.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 200,
                min: 2
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 6
            }
        },
        phone: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Admin'
        }
    }, {
        sequelize,
        modelName: 'Admin',
        tableName: 'Admins'
    });
    return Admin;
};