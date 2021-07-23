const express = require('express');
const route = express.Router();

const manageController = require('../app/controller/ManageController');

route.delete('/personnel/:id', manageController.deletePersonnel);
route.delete('/customer/:id', manageController.deleteCustomer);
route.get('/customer', manageController.showCustomer);
route.get('/customer/create', manageController.createCustomer);
route.get('/customer/:id', manageController.showCustomerID);
route.get('/personnel', manageController.showPersonnel);
route.get('/personnel/create', manageController.createPersonnel);
route.post('/customer/insert', manageController.insertCustomer);
route.post('/personnel/:id/insert', manageController.insertPersonnel);
route.get('/customer/:id/edit', manageController.editCustomer);
route.put('/customer/:id/update', manageController.updateCustomer);
route.get('/personnel/:id/edit', manageController.editPersonnel);
route.put('/personnel/:id/update', manageController.updatePersonnel);





module.exports = route;