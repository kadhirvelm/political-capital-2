"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ActiveResolution", {
            gameStateRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            activeResolutionRid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            resolutionDetails: {
                allowNull: false,
                type: Sequelize.JSONB,
            },
            state: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            createdOn: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("ActiveResolution");
    },
};
