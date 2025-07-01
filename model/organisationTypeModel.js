import { DataTypes } from 'sequelize';

export const createOrganisationTypeModel = (sequelize) => {
  return sequelize.define('organisation_type', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organisation_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type_description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'organisation_type',
    timestamps: false
  });
};
