const mongoose = require('mongoose');

async function dbConnect() {
    mongoose.connect('mongodb+srv://studentDashboard:RMS40ArMPPYcOBEM@cluster0.qygnrxp.mongodb.net/Inotebook')    //data base Name
    // mongoose.connect('mongodb://127.0.0.1:27017/Student-Dashbord')    //data base Name
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log("Mongo Error", err));
}
module.exports = dbConnect;