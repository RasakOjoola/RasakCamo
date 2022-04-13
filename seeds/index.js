const express = require('express');
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers')
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { title } = require('process');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


main().catch(err => console.log("OH NO MONGO CONNECTION ERROR", err));

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Database COnnected")
}
const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({})
    for (i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '6252d0b0e8071cec17f27c54',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat reprehenderit doloribus consectetur enim est recusandae ad, nobis consequuntur error eos velit impedit officiis reiciendis. Doloribus ipsam exercitationem aspernatur perferendis et!',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/unkind/image/upload/v1649711031/Rasak%20Camp/iktezoobznmfv7tcrzda.jpg',
                    filename: 'Rasak Camp/bwobfjmuupkooa5ez0zt',
                },
                {
                    url: 'https://res.cloudinary.com/unkind/image/upload/v1649711032/Rasak%20Camp/bswa1vznlfzd2t512dpu.jpg',
                    filename: 'Rasak Camp/ourcfcdiaxcakyfbgjdt',
                }
            ]
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
});
