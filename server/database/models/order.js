'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Cook, User, OrderDetail}) {
            // define association here
            Order.belongsTo(Cook, {
                foreignKey: 'cook_id'
            });

            Order.belongsTo(User, {
                foreignKey: 'user_id',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });

            Order.hasMany(OrderDetail, {
                foreignKey: 'order_id',
                onDelete: 'CASCADE'
            });
        }
    };
    Order.init({
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0
        },
        reference: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        comments: {
            type: DataTypes.STRING,
            validate: {
                max: 200
            },
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                max: 200
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM({
                values: ['pending', 'processing', 'ready']
            }),
            allowNull: false,
            defaultValue: 'pending'
        },
        delivery: {
            type: DataTypes.ENUM({
                values: ['eat in house', 'delivery']
            }),
            allowNull: false,
            defaultValue: 'eat in house'
        },
        rating: {
            type: DataTypes.ENUM({
                values: ['poor', 'fair', 'nice', 'excellent']
            }),
            allowNull: true
        },
        cook_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Orders'
    });
    return Order;
};