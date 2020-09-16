'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Food extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Admin, Category}) {
            // define association here
            Food.belongsTo(Admin, {
                foreignKey: 'admin_id'
            });

            Food.belongsTo(Category, {
                foreignKey: 'category_id'
            });
        }
    };
    Food.init({
        food_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
        },
        unit_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0
        },
        cooking_duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Food',
        tableName: 'Foods'
    });
    return Food;
};