const express = require('express');
const app = express();
const { upload } = require('../middlewares/upload');
const productUpload = upload('products').fields([{ name: 'image' }]);
const complaintUpload = upload('complaints').fields([{ name: 'image' }]);
const blogUpload = upload('blogs').fields([{ name: 'image' }]);
const userUpload = upload('users').fields([{ name: 'image' }]);
const generalUpload = upload('blogs').fields([{ name: 'image' }]);
const userController = require('../controllers/users');
const packageController = require('../controllers/packages');
const eventController = require('../controllers/events');
const complaintController = require('../controllers/complaints');
const blogController = require('../controllers/blogs');
const employeeController = require('../controllers/employee');
const scheduleController = require('../controllers/schedules');
const collectionRequestController = require('../controllers/collection_request');
const subscriptionController = require('../controllers/subscriptions');
const transactionController = require('../controllers/transaction');

app.post('/user/signup', userUpload, userController.createUser);
app.post('/user/login', userController.Login);
app.get('/users', userController.fetchUsers);
app.get('/user/:id', userController.fetchUserByID);
app.patch('/user/:id', userUpload, userController.updateUser);
app.delete('/user/:id', userController.deleteUser);
app.patch('/user/change_password/:id', userController.updatePassword);

app.post('/package', packageController.createPackageController);
app.get('/package', packageController.getPackageController);
app.patch('/package/:id', packageController.updatePackageController);
app.delete('/package/:id', packageController.deletePackageController);

app.post('/transaction', transactionController.createTransactionController);
app.get('/transaction', transactionController.getTransactionController);
app.patch('/transacion/:id', transactionController.updateTransactionController);
app.delete(
  '/transaction/:id',
  transactionController.deleteTransactionController,
);

app.post('/event', eventController.createEventController);
app.get('/event', eventController.getEventController);
app.patch('/event/:id', eventController.updateEventController);
app.delete('/event/:id', eventController.deleteEventController);

app.post(
  '/complaint',
  complaintUpload,
  complaintController.createComplaintController,
);
app.get('/complaint', complaintController.getComplaintController);
app.patch(
  '/complaint/:id',
  complaintUpload,
  complaintController.updateComplaintController,
);
app.delete('/complaint/:id', complaintController.deleteComplaintController);

app.post('/blog', blogUpload, blogController.createBlogController);
app.get('/blog', blogController.getBlogController);
app.patch('/blog/:id', blogUpload, blogController.updateBlogController);
app.delete('/blog/:id', blogController.deleteBlogController);

app.post('/upload', generalUpload, (req, res) => {
  return ReS(
    res,
    { message: 'Image uploaded', data: req.files['image'][0].path },
    status_codes_msg.CREATED.code,
  );
});

app.post('/employee', employeeController.createEmployeeController);
app.get('/employee', employeeController.getEmployeeController);
app.patch('/employee/:id', employeeController.updateEmployeeController);
app.delete('/employee/:id', employeeController.deleteEmployeeController);

app.post('/schedule', scheduleController.createScheduleController);
app.get('/schedule', scheduleController.getScheduleController);
app.patch('/schedule/:id', scheduleController.updateScheduleController);
app.delete('/schedule/:id', scheduleController.deleteScheduleController);

app.post('/subscription', subscriptionController.createSubscriptionController);
app.get('/subscription', subscriptionController.getSubscriptionController);
app.patch(
  '/subscription/:id',
  subscriptionController.updateSubscriptionController,
);
app.delete(
  '/subscription/:id',
  subscriptionController.deleteSubscriptionController,
);

app.post(
  '/collection_request',
  collectionRequestController.createCollectionRequestController,
);
app.get(
  '/collection_request',
  collectionRequestController.getCollectionRequestController,
);
app.patch(
  '/collection_request/:id',
  collectionRequestController.updateCollectionRequestController,
);
app.delete(
  '/collection_request/:id',
  collectionRequestController.deleteCollectionRequestController,
);

module.exports = app;
