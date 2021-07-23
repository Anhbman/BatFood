const express = require('express');
const route = express.Router();

const foodController = require('../app/controller/FoodController');

route.get('/stored', foodController.storedFoods);
route.post('/:id/insert', foodController.insert);
route.get('/:id/edit', foodController.editFoods);
route.get('/create',foodController.createFood)
route.put('/:id',foodController.updateFood)
route.delete('/:id', foodController.deleteFoods);

module.exports = route;