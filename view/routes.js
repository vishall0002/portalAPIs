import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware.js';


import {
  addEmp, deleteEmployee, getAllEmp, singleEmployee
} from '../controller/userController.js';

import {
  addModuleMaster, deletemodule, getAllModule, singleModule, updateModule
} from '../controller/moduleMaster.js';

import {
  addrolemaster, allrolemaster, deleterole, singleRole, updateRoleMaster
} from '../controller/roleMaster.js';

import {
  addministrycategory, deletecategoryfrommaster, getallministrycategory, singleministrycategory, updatesinglecategory
} from '../controller/ministryCategory.js';

import {
  addministry, deleteministry, getallministry, singleministry ,updateMinistry
} from '../controller/ministry.js';

import {
  getAllDesignations,
  addDesignation,
  getSingleDesignation,
  updateDesignation
} from '../controller/desingatonMaster.js';


import {
  getAllOrganisations,
  getSingleOrganisation,
  addOrganisation,
  updateOrganisation,
  deleteOrganisation
} from '../controller/organisationMaster.js';


const router = express.Router();

// ==========================
// Protected Route (for testing)          ******************** NOT IMPLEMENTED YET **************
// ==========================
  router.get('/check-auth', authenticateToken, (req, res) => {
    return res.json({
      message: 'Token is valid. Authorized user.',
      user: req.user,
    });
  });

// ==========================
// Employee Routes
// ==========================
router.get('/employees', getAllEmp);
router.post('/employees', addEmp);
router.get('/employees/:empId', singleEmployee);
router.delete('/employees/:empId', deleteEmployee);

// ==========================
// Module Master Routes
// ==========================
router.get('/modules', getAllModule);
router.post('/modules', addModuleMaster);
router.get('/modules/:id', singleModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deletemodule);

// ==========================
// Role Master Routes
// ==========================
router.get('/roles', allrolemaster);
router.post('/roles', addrolemaster);
router.get('/roles/:id', singleRole);
router.put('/roles/:id', updateRoleMaster);
router.delete('/roles/:id', deleterole);

// ==========================
// Ministry Category Master Routesconst data = designation.toJSON();
// ==========================
router.get('/ministry-categories', getallministrycategory);
router.post('/ministry-categories', addministrycategory);
router.get('/ministry-categories/:id', singleministrycategory);
router.put('/ministry-categories/:id', updatesinglecategory);
router.delete('/ministry-categories/:id', deletecategoryfrommaster);

// ==========================
//  Ministry Master Routes
// ==========================
router.get('/ministries', getallministry);
router.post('/ministries', addministry);
router.get('/ministries/:id', singleministry);
router.delete('/ministries/:id', deleteministry);
router.put('/ministry-masters/:id', updateMinistry);


// ==========================
//  Designation Master Routes
// ==========================
router.get('/designations', getAllDesignations);
router.post('/designations', addDesignation);
router.get('/designations/:id', getSingleDesignation);
router.put('/designations/:id', updateDesignation);



// ==========================
//  organisation Master Routes
// ==========================
router.get('/organisations', getAllOrganisations);
router.get('/organisations/:id', getSingleOrganisation);
router.post('/organisations', addOrganisation);
router.put('/organisations/:id', updateOrganisation);
router.delete('/organisations/:id', deleteOrganisation);

export default router;

