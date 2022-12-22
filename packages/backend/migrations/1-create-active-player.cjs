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
                type: Sequelize.INTEGER,
            },
            approvalRating: {
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("ActivePlayer");
    },
};
