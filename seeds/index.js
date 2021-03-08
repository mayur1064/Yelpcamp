const mongoose = require('mongoose');
const campGround = require('../models/campGround');
const Campground = require('../models/campGround');
const cities = require('./cities')
const {descriptors,places} = require("./seedHelpers")

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample = (array) => {
    return array[Math.floor(Math.random()*array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<300;i++)
    {
       const random1000 = Math.floor(Math.random()*1000)
       const price = Math.floor(Math.random()*20) 
       const camp = new campGround({
           author : "602feda658ff59a8b4494a47",
           title : `${sample(descriptors)} ${sample(places)}`,
           location : `${cities[random1000].city} , ${cities[random1000].state}`,
           description : "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam alias, sequi dignissimos consectetur reprehenderit aspernatur nihil officiis quidem placeat nobis ratione debitis minima repudiandae doloremque cumque optio blanditiis praesentium! Facilis.",
           price,
           images : [
              {
                url: 'https://res.cloudinary.com/dvh924b56/image/upload/v1614271247/Yelpcamp/lwykkhs0m0p4oyicnvqr.jpg',
                filename: 'Yelpcamp/lwykkhs0m0p4oyicnvqr'
              },
              {
                url: 'https://res.cloudinary.com/dvh924b56/image/upload/v1614271247/Yelpcamp/lwykkhs0m0p4oyicnvqr.jpg',
                filename: 'Yelpcamp/lwykkhs0m0p4oyicnvqr'
              }
           ],
           "geometry" : { "type" : "Point", "coordinates" : [ cities[random1000].longitude,cities[random1000].latitude] }
           
       }) 
       await camp.save()
    }
    
}


seedDB()
.then(() => {
    mongoose.connection.close();
})


