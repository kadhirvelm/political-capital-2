"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Player", {
            playerRid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            browserIdentifier: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            name: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("Player");
    },
};
