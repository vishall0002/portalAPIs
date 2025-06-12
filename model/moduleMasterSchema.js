import { DataTypes } from "sequelize";

export const moduleMasterModel = (sequelize) => {
    console.log("Defining module_masters model");

    const ModuleMaster = sequelize.define('module_masters', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        module_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        permission: {
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
        tableName: 'module_masters',
        timestamps: false
    });

    return ModuleMaster;
};
