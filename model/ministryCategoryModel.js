import { DataTypes } from "sequelize";

export const ministryCategoryModel = (sequelize) => {
    console.log("Defining ministry_category model");

    const MinistryCategory = sequelize.define('ministry_category', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ministry_category: {
            type: DataTypes.STRING,
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
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'ministry_category',
        timestamps: false
    });

    return MinistryCategory;
};

