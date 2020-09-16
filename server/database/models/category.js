'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Food}) {
            // define association here
            Category.hasMany(Food, {
                foreignKey: 'category_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            })
        }
    };
    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                max: 200
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                max: 300
            }
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'Categories'
    });
    return Category;
};