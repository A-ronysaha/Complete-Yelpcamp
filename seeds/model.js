let mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/all_yelpCamp")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });

let Campground = require("../schemaModel/campground");
let City = require("./city");
let { places, descriptors } = require("./details");

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 30; i++) {
    let random = Math.floor(Math.random() * 1000);

    let camp = new Campground({
      location: `${City[random].city}, ${City[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "636b2fa9b2c1888581f0b9ce",
      description:
        "In nature, nothing is perfect and everything is perfectTrees can be contorted, bent in weird ways, and they are still beautiful. ",
      geometry: {
        type: "Point",
        coordinates: [
          City[random].longitude, 
          City[random].latitude
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/daqedg8xh/image/upload/v1668175822/Arghya_YelpCamp/pdw1eopy8yb9jfq2p9w5.jpg",
          filename: "Arghya_YelpCamp/pdw1eopy8yb9jfq2p9w5",
        },
        {
          url: "https://res.cloudinary.com/daqedg8xh/image/upload/v1668175831/Arghya_YelpCamp/heha5ubibwuhpbgc6l4m.jpg",
          filename: "Arghya_YelpCamp/heha5ubibwuhpbgc6l4m",
        },
        {
          url: "https://res.cloudinary.com/daqedg8xh/image/upload/v1668175828/Arghya_YelpCamp/kiursgmsw2j3xtnfbieo.jpg",
          filename: "Arghya_YelpCamp/kiursgmsw2j3xtnfbieo",
        },
      ],
    });

    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});
