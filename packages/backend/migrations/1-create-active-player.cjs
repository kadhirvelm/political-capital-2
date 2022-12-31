"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ActivePlayer", {
            activePlayerId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameStateRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            playerRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            politicalCapital: {
                type: Sequelize.DOUBLE,
            },
            approvalRating: {
                type: Sequelize.DOUBLE,
            },
            lastUpdatedGameClock: {
                type: Sequelize.INTEGER,
            },
            isReady: {
                type: Sequelize.BOOLEAN,
            },
        });

        await queryInterface.addIndex("ActivePlayer", ["gameStateRid", "playerRid"]);
    },
    async down(queryInterface) {
        await queryInterface.dropTable("ActivePlayer");
    },
};
