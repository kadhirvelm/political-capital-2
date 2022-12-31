"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ActiveResolutionVote", {
            activeResolutionVoteId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gameStateRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            activeResolutionRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            activeStafferRid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            vote: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        await queryInterface.addIndex("ActiveResolutionVote", ["gameStateRid"]);
    },
    async down(queryInterface) {
        await queryInterface.dropTable("ActiveResolutionVote");
    },
};
