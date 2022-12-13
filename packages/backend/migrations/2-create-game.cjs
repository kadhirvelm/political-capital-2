"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Game", {
            gameRid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            isRunning: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            playerRids: {
                type: Sequelize.JSONB,
            },
            gameState: {
                type: Sequelize.JSONB,
            },
            createdAt: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("Game");
    },
};
