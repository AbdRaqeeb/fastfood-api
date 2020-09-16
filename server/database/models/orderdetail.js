'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Order}) {
            // define association here
            OrderDetail.belongsTo(Order, {
                foreignKey: 'order_id'
            });
        }
    };
    OrderDetail.init({
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        food_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        food_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'OrderDetail',
        tableName: 'OrderDetails'
    });
    return OrderDetail;
};