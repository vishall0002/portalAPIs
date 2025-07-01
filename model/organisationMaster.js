
import { DataTypes } from 'sequelize';


export const createOrganisationMasterModel = (sequelize) => {
  return sequelize.define('organisation_master', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organisation_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organisation_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    organisation_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'organisation_type',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    ministry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'master_ministry',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    ministry_name: {
      type: DataTypes.STRING,
      allowNull: false // or true if optional
    }
  }, {
    tableName: 'organisation_master',
    timestamps: false
  });
};
