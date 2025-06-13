/* import  {Sequelize} from 'sequelize'
import {createUserModel} from '../model/userSchema.js';
import { roleMasterModel } from '../model/rolesMasterSchema.js';  // you do not need to add rolesMasterSchema.js. Ignore all the files rel. to this file.
import { moduleMasterModel } from '../model/moduleMasterSchema.js';  // you do not need to add moduleMasterSchema.js. Ignore all the files rel. to this file.
import { ministryCategoryModel } from '../model/ministryCategoryModel.js';
import { masterMinistryModel } from '../model/masterMinistryModel.js';

const sequelize = new Sequelize('postgres', 'postgres', 'postgres123', {
    host: 'localhost',
    dialect: 'postgres' 
  });

  let userModel = null;
  let roleModel = null;
 let moduleModel = null;
 let ministrycatModel= null;
 let ministryModel = null;

  console.log('📁 postgres.js loaded');
  const connection = async () => {
    try {
      console.log('➡ Starting DB connection'); // Add this
      await sequelize.authenticate();
      console.log('Connected to DB');
      
      console.log('📦 Defining models...');
      userModel = createUserModel(sequelize);

      console.log("ministry category model define");
      ministrycatModel = ministryCategoryModel(sequelize);


      console.log("master ministry model..");;
      ministryModel = masterMinistryModel(sequelize);
      
      
      roleModel = roleMasterModel(sequelize)
      moduleModel = moduleMasterModel(sequelize);

      console.log('Before sync');
      await sequelize.sync({ alter: true });
      console.log('After sync - models synced');
    } catch (error) {
      console.error('❌ DB connection error:', error);
    }
  };
  

  export {
    connection,userModel,roleModel,moduleModel,ministrycatModel,ministryModel
  }
  */

  import { Sequelize } from 'sequelize';
import { createUserModel } from '../model/userSchema.js';
import { roleMasterModel } from '../model/rolesMasterSchema.js';
import { moduleMasterModel } from '../model/moduleMasterSchema.js';
import { ministryCategoryModel } from '../model/ministryCategoryModel.js';
import { masterMinistryModel } from '../model/masterMinistryModel.js';

const sequelize = new Sequelize('postgres', 'postgres', 'postgres123', {
  host: 'localhost',
  dialect: 'postgres',
});

let userModel = null;
let roleModel = null;
let moduleModel = null;
let ministrycatModel = null;
let ministryModel = null;

console.log('📁 postgres.js loaded');

const connection = async () => {
  try {
    console.log('➡ Starting DB connection');
    await sequelize.authenticate();
    console.log('Connected to DB');

    console.log('📦 Defining models...');
    userModel = createUserModel(sequelize);
    ministrycatModel = ministryCategoryModel(sequelize);
    ministryModel = masterMinistryModel(sequelize);
    roleModel = roleMasterModel(sequelize);
    moduleModel = moduleMasterModel(sequelize);

    // Setup associations here
    ministryModel.belongsTo(ministrycatModel, {
      foreignKey: 'ministry_category_id',
      targetKey: 'id',
      as: 'category',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    console.log('Before sync');
    await sequelize.sync({ alter: true });
    console.log('After sync - models synced');

  } catch (error) {
    console.error('❌ DB connection error:', error);
  }
};

export {
  connection,
  userModel,
  roleModel,
  moduleModel,
  ministrycatModel,
  ministryModel,
};
