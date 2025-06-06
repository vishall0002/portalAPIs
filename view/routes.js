// import express, { Router } from 'express';
import express from 'express';
import { addEmp, deleteEmployee, getAllEmp, singleEmployee} from '../controller/userController.js';

const router = express.Router();
router.get('/getAll', getAllEmp);
router.post('/addemp',addEmp)
router.get('/singleemployee/:empId',singleEmployee);
router.get('/deleteemployee/:empId',deleteEmployee);

export default router;
