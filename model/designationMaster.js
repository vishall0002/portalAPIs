import { DataTypes } from 'sequelize';

export const createDesignationMasterModel = (sequelize) => {
    return sequelize.define('designation_master', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        designation_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organisation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'organisation_master',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        organisation_name: {
            type: DataTypes.STRING,
            allowNull: true // you can set false if you do not want it to be set null by default
        },
        designation_code: {
            type: DataTypes.STRING,
            allowNull: true // you can set false if you do not want it to be set null by default
        }
    }, {
        tableName: 'designation_master',
        timestamps: false
    });
};
