const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB_NAME}`);
mongoose.connection
  .once("open", () => {
    console.log("DB connected");
  })
  .on("error", (error)=> {
    console.log("error is:", error);
  });


const userSchema = mongoose.Schema({
    userName: String,
    password: String
})

module.exports = mongoose.model('User', userSchema)