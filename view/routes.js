// import express, { Router } from 'express';
import express from 'express';
import { addEmp, deleteEmployee, getAllEmp, singleEmployee} from '../controller/userController.js';
import { addModuleMaster, deletemodule, getAllModule, singleModule, updateModule } from '../controller/moduleMaster.js';

const router = express.Router();
router.get('/getAll', getAllEmp);
router.post('/addemp',addEmp)
router.get('/singleemployee/:empId',singleEmployee);
router.get('/deleteemployee/:empId',deleteEmployee);


//Rouer for modules masters

router.get('/getAllModule',getAllModule);
router.get('/singleModule/:id',singleModule);
router.post('/addmodule',addModuleMaster)
router.get('/deletemodule/:id',deletemodule);
router.put('/updatemodule/:id', updateModule);

//Rotuers for roles master



export default router;
