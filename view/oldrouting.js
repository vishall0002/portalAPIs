// import express, { Router } from 'express';
import express from 'express';
import { addEmp, deleteEmployee, getAllEmp, singleEmployee} from '../controller/userController.js';
import { addModuleMaster, deletemodule, getAllModule, singleModule, updateModule } from '../controller/moduleMaster.js';
import { addrolemaster, allrolemaster, deleterole, singleRole, updateRoleMaster } from '../controller/roleMaster.js';
import { addministrycategory, deletecategoryfrommaster, getallministrycategory, singleministrycategory, updatesinglecategory } from '../controller/ministryCategory.js';
import { addministry, deleteministry, getallministry, singleministry } from '../controller/ministry.js';

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
router.post('/addrolemaster',addrolemaster);
router.get('/allroles',allrolemaster);
router.get('/deleterole/:id',deleterole);
router.put('/updaterole/:id',updateRoleMaster)



//Routes for ministry category master
router.post('/addministrycategorymaster',addministrycategory);
router.get('/ministrycategorymasterall',getallministrycategory);
router.get('/singleminstrycategory/:id', singleministrycategory);
router.get('/deletemisnitrycategory/:id',deletecategoryfrommaster);
router.put('/updateministrycategory/:id',updatesinglecategory);


//master ministry 
router.post('/addministry',addministry);
router.get('/getministry',getallministry);
router.get('/singleministry/:id',singleministry);
router.get('/deleteministry/:id',deleteministry);



export default router;
