/*
ПІП
2.дата народження
3.порядковий номер
4.судимість
5.місце роботи
6.місце навчання
7.пенціонер чи не
8.дата смерті
9.порядковий номер будинку
*/

var mongoose = require('../libs/mongoose');

var ResidentSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        fName: String,
        mName: String,
        lName: String
    },
    birth: Date,
    conviction: {
        status: Boolean,
        description: String
    },
    work: String,
    study: String,
    pensioner: Boolean,
    dateOfDeath: {
        type: Date,
        required: false
    },
    avatar: {
        type: String,
        required: false,
        default: 'avatar.png'
    },
    houseNumber: mongoose.Schema.Types.ObjectId,
    passport: String,
    building: mongoose.Schema.Types.ObjectId,
    documents: [{
        title: String,
        filename: String
    }]
});

var Resident = module.exports = mongoose.model('Resident', ResidentSchema);

module.exports.createResident = function(newResident, callback) {
    newResident.save(callback);
}