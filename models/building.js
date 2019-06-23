/*
Таблиця будинки
1.порядковий номер
2.населений пункт
3.вулиця
4.номер на вулиці
5.площа проживання
6.площа для СГ культур(город чи сад)
7.площа задіяна для бізнесу
8.Загальна площа
9.порядкові номера жителів
10.порядкові номера власників
*/

var mongoose = require('../libs/mongoose');

var BuildingSchema = mongoose.Schema({     //ну тут об'єкт бази будинки, а що не зрозуміло?
    village: String,
    street: String,
    number: String,      //типу таблиця??
    allArea: Number,    // та
    area: Number,
    sgArea: Number,
    businessArea: Number,
    forestArea: Number,
    owners: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    residents: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});

var Building = module.exports = mongoose.model('Building', BuildingSchema);

module.exports.createBuilding = function(newBuilding, callback) {
    newBuilding.save(callback);
}