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
        desingnation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        empId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    });

    return employee;
};


