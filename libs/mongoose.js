var mongoose = require('mongoose');

mongoose
  .connect('mongodb://wasya1212:wasya1212@ds341847.mlab.com:41847/village', { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected..."))
  .catch(err => console.error(err));

module.exports = mongoose;
