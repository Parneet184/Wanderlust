const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const user = require('../models/user.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(err =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};
    
const initDB = async () => {
    await Listing.deleteMany({});
    const userId = new mongoose.Types.ObjectId("68b6be04077db0ec87fbcc17");
    console.log(userId);   //this will printed when u run node init/index.js
    console.log("apri");
    // Map through the data and add the owner field to each listing object
    initData.data = initData.data.map((obj) => ({...obj, owner: userId })); 
    await Listing.insertMany(initData.data);
    console.log("Database initialized with data.");
};

initDB();