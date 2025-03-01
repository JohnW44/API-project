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
				address: "123 Disney Lane",
				city: "San Francisco",
				state: "California",
				country: "United States of America",
				lat: 37.7645358,
				lng: -122.4730327,
				name: "App Academy",
				description: "Place where web developers are created",
				price: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
			},
      {
        ownerId: 2,
        address: "456 Elm St",
        city: "New York",
        state: "New York",
        country: "United States of America",
        lat: 40.7128,
        lng: -74.0060,
        name: "Modern Apartment",
        description: "A modern apartment with a view of the city skyline.",
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3,
        address: "789 Oak St",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.0522,
        lng: -118.2437,
        name: "Seaside Villa",
        description: "A luxurious villa by the Pacific Ocean.",
        price: 200.00,
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