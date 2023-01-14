"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Notification", {
            notificationId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameStateRid: {
                type: Sequelize.STRING,
            },
            notificationDetails: {
                type: Sequelize.JSONB,
            },
            toPlayerRid: {
                type: Sequelize.STRING,
            },
            createdOn: {
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.STRING,
            },
        });

        await queryInterface.addIndex("Notification", ["gameStateRid"]);
    },
    async down(queryInterface) {
        await queryInterface.dropTable("Notification");
    },
};
