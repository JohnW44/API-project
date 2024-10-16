'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Great spot!',
        stars: 5,
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Good spot!',
        stars: 4,
      },
      {
        userId: 3,
				spotId: 3,
				review: "Mediocre spot!",
				stars: 3,
			},
			{
				userId: 3,
				spotId: 3,
				review: "Terrible spot!",
				stars: 1,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Reviews";
		return queryInterface.bulkDelete(options, null, {});
	},
};
