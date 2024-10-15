'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: '../../../../images/1 Laveta Place.png',
        preview: true,
      },
      {
        spotId: 2,
        url: '../../../../images/Villa Montezuma.png',
        preview: true,
      },
      {
        spotId: 3,
        url: '../../../../images/Ballealy-Cottage06.png',
        preview: true,
      },
      {
        spotId: 4,
        url: '../../../../images/BaconsCastle.png',
        preview: true,
      },
      {
        spotId: 5,
        url: '../../../../images/Rosenheim_Mansion.png',
        preview: true,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
		options.tableName = "SpotImages";
		return queryInterface.bulkDelete(options, null, {});
	},
};
