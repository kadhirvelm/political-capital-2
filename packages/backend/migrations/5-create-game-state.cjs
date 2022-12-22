"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("GameState", {
            gameStateRid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            state: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            gameClock: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("GameState");
    },
};
