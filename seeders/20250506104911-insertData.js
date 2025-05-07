"use strict";

const {signBcrypt} = require("../helpers/bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const dataUser = require("../db/users.json").map((el) => {
      delete el.id;
      el.updatedAt = el.createdAt = new Date();
      el.password = signBcrypt(el.password);
      return el;
    });
    const dataTicket = require("../db/tickets.json").map((el) => {
      delete el.id;
      el.updatedAt = el.createdAt = new Date();
      return el;
    });
    const dataTransaction = require("../db/transactions.json").map((el) => {
      delete el.id;
      el.updatedAt = el.createdAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Users", dataUser);
    await queryInterface.bulkInsert("Tickets", dataTicket);
    await queryInterface.bulkInsert("Transactions", dataTransaction);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Transactions", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Tickets", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
