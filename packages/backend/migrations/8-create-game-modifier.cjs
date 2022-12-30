"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("PassedGameModifier", {
            passedGameModifierId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameStateRid: {
                type: Sequelize.STRING,
            },
            modifier: {
                type: Sequelize.JSONB,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("PassedGameModifier");
    },
};
