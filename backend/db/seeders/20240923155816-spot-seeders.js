"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
	async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
		await queryInterface.bulkInsert(options, [
			{
				ownerId: 1,
				address: "1 Laveta Place, Nyack, NY 10960",
				city: "Nyack",
				state: "New York",
				country: "United States of America",
				lat: 41.0951,
				lng: -73.9200,
				name: "The Haunted House",
				description: "A house with a dark past",
				price: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
			},
      {
        ownerId: 2,
        address: "1925 K st, San Diego, CA 92102",
        city: "San Diego",
        state: "California",
        country: "United States of America",
        lat: 32.7157,
        lng: -117.1611,
        name: "Villa Montezuma",  
        description: "Historic house with ghost sightings and paranormal activities",
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3,
        address: "2 Castle Lane, Glenarm, Ballymena, BT44 0BQ",
        city: "Ballymena",
        state: "Northern Ireland",
        country: "United Kingdom",
        lat: 54.8000,
        lng: -6.2833,
        name: "The Haunted castle",
        description: "A Spooky and romantic getaway!",
        price: 200.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 4,
        address: "465 Bacons Castle Trail, Surry, VA 23883",
        city: "Surry",
        state: "Virginia",
        country: "United States of America",
        lat: 37.2696,
        lng: -76.5998,
        name: "Bacons Castle",
        description: "A historic castle with a dark past",
        price: 120.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 5,
        address: "1120 Westchester Pl, Los Angeles, CA 90019",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.0503,
        lng: -118.3173,
        name: "Rosenheim Mansion",
        description: "LA is scary enough!",
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
		]);
	},

	async down(queryInterface, Sequelize) {
		options.tableName = "Spots";
		return queryInterface.bulkDelete(options, null, {});
	},
};