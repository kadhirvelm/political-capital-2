"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ActiveStaffer", {
            gameStateRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            playerRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            activeStafferRid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            stafferDetails: {
                type: Sequelize.JSONB,
            },
            state: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("ActiveStaffer");
    },
};
