import  {Sequelize} from 'sequelize'
import {createUserModel} from '../model/userSchema.js';
import { roleMasterModel } from '../model/rolesMasterSchema.js';
import { moduleMasterModel } from '../model/moduleMasterSchema.js';

const sequelize = new Sequelize('postgres', 'postgres', 'postgres123', {
    host: 'localhost',
    dialect: 'postgres' 
  });

  let userModel = null;
  let roleMastersModel = null;
  let moduleMastersModel = null;

  console.log('📁 postgres.js loaded');
  const connection = async () => {
    try {
      console.log('➡ Starting DB connection'); // Add this
      await sequelize.authenticate();
      console.log('✅ Connected to DB');
      
      console.log('📦 Defining models...');
      userModel = createUserModel(sequelize);
      
      roleMastersModel = roleMasterModel(sequelize)
      moduleMastersModel = moduleMasterModel(sequelize);

      console.log('⚙️ Before sync');
      await sequelize.sync({ alter: true });
      console.log('✅ After sync - models synced');
    } catch (error) {
      console.error('❌ DB connection error:', error);
    }
  };
  

  export {
    connection,userModel,roleMasterModel,moduleMasterModel
  }
  