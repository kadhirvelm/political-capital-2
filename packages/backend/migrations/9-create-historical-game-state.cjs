"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("HistoricalGameState", {
            historicalGameStateId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameStateRid: {
                type: Sequelize.STRING,
            },
            gameClock: {
                type: Sequelize.INTEGER,
            },
            snapshot: {
                type: Sequelize.JSONB,
            },
        });

        await queryInterface.addIndex("HistoricalGameState", ["gameStateRid"]);
    },
    async down(queryInterface) {
        await queryInterface.dropTable("HistoricalGameState");
    },
};
