import { DataTypes } from 'sequelize';

export const masterMinistryModel = (sequelize) => {
    console.log('Defining master_ministry model');

    const MasterMinistry = sequelize.define('master_ministry', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ministry_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ministry_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ministry_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ministry_category', // table name as string
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        ministry_category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'master_ministry',
        timestamps: false,
    });

    return MasterMinistry;
};
