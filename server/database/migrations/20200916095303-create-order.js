'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            order_id: {
                type: Sequelize.INTEGER
            },
            amount: {
                type: Sequelize.DECIMAL
            },
            reference: {
                type: Sequelize.STRING
            },
            comments: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            user_id: {
                type: Sequelize.INTEGER
            },
            phone: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.ENUM({
                    values: ['pending', 'processing', 'ready']
                })
            },
            delivery: {
                type: Sequelize.ENUM({
                    values: ['eat in house', 'delivery']
                })
            },
            rating: {
                type: Sequelize.ENUM({
                    values: ['poor', 'fair', 'nice', 'excellent']
                })
            },
            cook_id: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Orders');
    }
};