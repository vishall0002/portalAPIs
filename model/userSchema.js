import { DataTypes } from "sequelize";

export const createUserModel = (sequelize) => {
    const employee = sequelize.define('employee', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                isLowercase: true
            }
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [10, 15] // Adjust length based on your requirements
            }
        },
        desingnation_code: {
            type: DataTypes.STRING,
            allowNull: true // set false if you do not want to enter null value by default. I am passing true just for checking purpose
        },
        designation_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organisation_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organisation_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        access_permission: {
            type: DataTypes.JSON, // or DataTypes.TEXT if it's stored as stringified JSON
            allowNull: true
        },
        empId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return employee;
};
