"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("HistoricalGameState", {
            historicalGameStateRid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            gameRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            atResolutionRid: {
                type: Sequelize.STRING,
            },
            playerValues: {
                type: Sequelize.JSONB,
            },
            createdAt: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("HistoricalGameState");
    },
};
