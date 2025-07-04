import { DataTypes } from "sequelize";

export const roleMasterModel = (sequelize) => {
    console.log("Defining role_master model");

    const RoleMaster = sequelize.define('role_master', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        access_permission: {
            type: DataTypes.JSON,   
            allowNull: false
        },
       status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['active', 'inactive']],
                    msg: "Status must be either 'active' or 'inactive'"
                }
            }
        }
    }, {
        tableName: 'role_master',
        timestamps: false
    });

    return RoleMaster;
};
