import { fn, col, where as sqlWhere } from 'sequelize';
import { roleModel } from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { moduleModel } from '../postgres/postgres.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';



// add role in master role table 
   export const addrolemaster = async (req, res) => {
    try {
        const name = req.body.name?.toLowerCase();
        const status = req.body.status?.toLowerCase();
        const requestedModules = req.body.permission || [];

        const validStatusValues = ['active', 'inactive'];

        // validate status
        if (!validStatusValues.includes(status)) {
            return sendResponse(res, 400, 1, 'Invalid status. Only active or inactive are allowed.');
        }

        // validate permission is an array
        if (!Array.isArray(requestedModules) || requestedModules.length === 0) {
            return sendResponse(res, 400, 1, 'Permission must be a non-empty array of module names.');
        }

        // fetch modules from the moduleModel
        const modules = await moduleModel.findAll({
            where: {
                module_name: requestedModules.map(m => m.toLowerCase())
            }
        });

        // check if any valid module found
        if (!modules || modules.length === 0) {
            return sendResponse(res, 400, 1, 'No valid modules found for the provided permissions.');
        }

        // build nested access_permission structure
        let access_permission = {};

        for (const mod of modules) {
            const moduleName = mod.module_name.toLowerCase();
            const permissions = mod.permission || {};

            const filteredPermissions = Object.entries(permissions).filter(
                ([, value]) => validStatusValues.includes(String(value).toLowerCase())
            );

            if (filteredPermissions.length > 0) {
                access_permission[moduleName] = Object.fromEntries(
                    filteredPermissions.map(([k, v]) => [k.toLowerCase(), String(v).toLowerCase()])
                );
            }
        }

        // if no valid permissions after filtering
        if (Object.keys(access_permission).length === 0) {
            return sendResponse(res, 400, 1, 'No valid permissions found in the selected modules.');
        }

        // check if role already exists
        const existingRole = await roleModel.findOne({
            where: sqlWhere(fn('LOWER', col('name')), name),
        });

        if (existingRole) {
            return sendResponse(res, 200, 1, `${name} role already exists`);
        }

        // create new role
        await roleModel.create({
            name,
            access_permission,
            status
        });

        return sendResponse(res, 200, 0, 'Role inserted successfully');

    } catch (error) {
        console.error('Error inserting module:', error);
        return sendResponse(res, 500, 2, 'Internal server error');
    }
};


//all role in master role table 

export const allrolemaster = async (req, res) => {
    try {
        const roles = await roleModel.findAll();
        if (roles.length === 0) {
            return sendResponse(res, 200, 1, "No Record found");
        } else {
            const modifiedRoles = roles.map((m) => ({
                ...m.toJSON(),
                id: vishal_encryption(m.id.toString()) 
            }));
            return sendResponse(res, 200, 0, "",modifiedRoles);
        }
    } catch (error) {
        console.error('Error fetching roles:', error);
        return sendResponse(res, 500, 2, 'Internal server error');
    }
}



//delete role from role master 

   export const deleterole = async (req, res) => {
        try {
            const decryptedId = vishal_decryption(req.params.id);
            const deletedCount = await roleModel.destroy({ where: { id: decryptedId } });
            if (deletedCount === 0) {
                return sendResponse(res, 200, 1, "Unable to delete the role. Role not found.");
            }
                return sendResponse(res, 200, 0, "Role deleted successfully");
        } catch (error) {
                console.error('Error deleting role:', error);
                return sendResponse(res, 500, 2, 'Internal server error');
        }
    };



//single role master 

  export const singleRole = async (req, res) => {
    try {
        const decryptedId = vishal_decryption(req.params.id);
        const moduleDetailSingle = await roleModel.findOne({ where: { id: decryptedId } });
        if (!moduleDetailSingle) {
        return sendResponse(res, 200, 1, `Role does not exist in our system with id: ${req.params.id}`);
        }
            const responseData = {
            ...moduleDetailSingle.toJSON(),
            id: req.params.id 
        };
        return sendResponse(res, 200, 0, "Role fetched successfully", responseData);
    } catch (error) {
        console.error("Error fetching role:", error);
        return sendResponse(res, 500, 2, "Internal server error");
    }
    };


// update role in role master table 

export const updateRoleMaster = async (req, res) => {
    try {
        const decryptedId = vishal_decryption(req.params.id);
        const name = req.body.name?.toLowerCase();
        const status = req.body.status?.toLowerCase();
        const requestedModules = req.body.permission || [];

        const validStatusValues = ['active', 'inactive'];

        // Validate status
        if (!validStatusValues.includes(status)) {
            return sendResponse(res, 400, 1, 'Invalid status. Only active or inactive are allowed.');
        }

        // Validate permission is an array
        if (!Array.isArray(requestedModules) || requestedModules.length === 0) {
            return sendResponse(res, 400, 1, 'Permission must be a non-empty array of module names.');
        }

        // Fetch relevant modules
        const modules = await moduleModel.findAll({
            where: {
                module_name: requestedModules.map(m => m.toLowerCase())
            }
        });

        if (!modules || modules.length === 0) {
            return sendResponse(res, 400, 1, 'No valid modules found for the provided permissions.');
        }

        // Build access_permission structure
        let access_permission = {};

        for (const mod of modules) {
            const moduleName = mod.module_name.toLowerCase();
            const permissions = mod.permission || {};

            const filteredPermissions = Object.entries(permissions).filter(
                ([, value]) => validStatusValues.includes(String(value).toLowerCase())
            );

            if (filteredPermissions.length > 0) {
                access_permission[moduleName] = Object.fromEntries(
                    filteredPermissions.map(([k, v]) => [k.toLowerCase(), String(v).toLowerCase()])
                );
            }
        }

        if (Object.keys(access_permission).length === 0) {
            return sendResponse(res, 400, 1, 'No valid permissions found in the selected modules.');
        }

        // Find existing role
        const existingRole = await roleModel.findByPk(decryptedId);

        if (!existingRole) {
            return sendResponse(res, 404, 1, 'Role not found.');
        }

        // Update role
        await existingRole.update({
            name,
            access_permission,
            status
        });

        return sendResponse(res, 200, 0, 'Role updated successfully');

    } catch (error) {
        console.error('Error updating role:', error);
        return sendResponse(res, 500, 2, 'Internal server error');
    }
};
