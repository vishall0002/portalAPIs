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
            type: DataTypes.JSON,   // 👈 JSON format
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false
        }
    }, {
        tableName: 'module_masters',
        timestamps: false
    });

    return ModuleMaster;
};
