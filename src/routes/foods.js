const express = require('express');
const route = express.Router();

const foodController = require('../app/controller/FoodController');


route.get('/stored', foodController.storedFoods);
route.get('/create',foodController.createFood);
route.post('/insert', foodController.insert);
route.get('/:id', foodController.showFoodID);
route.get('/:id/edit', foodController.editFoods);
route.put('/:id',foodController.updateFood);
route.delete('/:id', foodController.deleteFoods);

module.exports = route;