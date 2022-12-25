"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ResolveGameEvent", {
            resolveGameEventId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameStateRid: {
                type: Sequelize.STRING,
            },
            resolvesOn: {
                type: Sequelize.INTEGER,
            },
            eventDetails: {
                type: Sequelize.JSONB,
            },
            state: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("ResolveGameEvent");
    },
};
