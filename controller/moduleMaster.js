import { fn, col, where as sqlWhere } from 'sequelize';
import { moduleModel } from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';



// to get all the module list 
    export const getAllModule = async (req, res) => {
        try {
                const modules = await moduleModel.findAll();
                if (modules.length === 0) {
                return sendResponse(res, 200, 1, "No Records found");
            }
                const modifiedModules = modules.map((m) => ({
                ...m.toJSON(),
                id: vishal_encryption(m.id.toString())
            }));
                return sendResponse(res, 200, 0, "", modifiedModules);
            } catch (error) {
                console.error("Error fetching modules:", error);
                return sendResponse(res, 500, 2, "Internal server error");
            }
    };

// to delete single module 
    export const deletemodule = async (req, res) => {
        try {
            const decryptedId = vishal_decryption(req.params.id);
            const deletedCount = await moduleModel.destroy({ where: { id: decryptedId } });
            if (deletedCount === 0) {
                return sendResponse(res, 200, 1, "Unable to delete the module. Module not found.");
            }
                return sendResponse(res, 200, 0, "Module deleted successfully");
        } catch (error) {
                console.error('Error deleting module:', error);
                return sendResponse(res, 500, 2, 'Internal server error');
        }
    };

// add module in master module table 
    export const addModuleMaster = async (req, res) => {
        try {
            const module_name = req.body.module_name?.toLowerCase();
            const status = req.body.status?.toLowerCase();
            const permission = req.body.permission || {};

            // Valid values
            const validStatusValues = ['active', 'inactive'];

            // 1. Validate status
            if (!validStatusValues.includes(status)) {
                return sendResponse(res, 400, 1, 'Invalid status. Only active or inactive are allowed.');
            }

            // 2. Validate permission values
            const invalidPermissions = Object.entries(permission).filter(
                ([key, value]) => !validStatusValues.includes(String(value).toLowerCase())
            );

            if (invalidPermissions.length > 0) {
                const invalidKeys = invalidPermissions.map(([key]) => key).join(', ');
                return sendResponse(
                    res,
                    400,
                    1,
                    `Invalid permission values for keys: ${invalidKeys}. Only active or inactive are allowed.`
                );
            }

            // Normalize permission values
            const normalizedPermissions = Object.fromEntries(
                Object.entries(permission).map(([k, v]) => [
                    k.toLowerCase(),
                    String(v).toLowerCase(),
                ])
            );

            // Check for existing module
            const moduleExistingRecord = await moduleModel.findOne({
                where: sqlWhere(fn('LOWER', col('module_name')), module_name),
            });

            if (!moduleExistingRecord) {
                await moduleModel.create({ module_name, permission: normalizedPermissions, status });
                return sendResponse(res, 200, 0, 'Module inserted successfully');
            } else {
                return sendResponse(res, 200, 1, `${module_name} module already exists`);
            }

        } catch (error) {
            console.error('Error inserting module:', error);
            return sendResponse(res, 500, 2, 'Internal server error');
        }
    };


// single module detail 
    export const singleModule = async (req, res) => {
    try {
        const decryptedId = vishal_decryption(req.params.id);
        const moduleDetailSingle = await moduleModel.findOne({ where: { id: decryptedId } });
        if (!moduleDetailSingle) {
        return sendResponse(res, 200, 1, `Module does not exist in our system with id: ${req.params.id}`);
        }
            const responseData = {
            ...moduleDetailSingle.toJSON(),
            id: req.params.id 
        };
        return sendResponse(res, 200, 0, "Module fetched successfully", responseData);
    } catch (error) {
        console.error("Error fetching module:", error);
        return sendResponse(res, 500, 2, "Internal server error");
    }
    };


//update module single 
    export const updateModule = async (req, res) => {
        try {
            const decryptedId = vishal_decryption(req.params.id);
            const module_name = req.body.module_name?.toLowerCase();
            const status = req.body.status?.toLowerCase();
            const permission = req.body.permission || {};

            // Valid values
            const validStatusValues = ['active', 'inactive'];

            // Validate status
            if (!validStatusValues.includes(status)) {
                return sendResponse(res, 400, 1, 'Invalid status. Only "active" or "inactive" are allowed.');
            }

            // Validate permission values  
            const invalidPermissions = Object.entries(permission).filter(
                ([key, value]) => !validStatusValues.includes(String(value).toLowerCase())
            );

            if (invalidPermissions.length > 0) {
                const invalidKeys = invalidPermissions.map(([key]) => key).join(', ');
                return sendResponse(
                    res,
                    400,
                    1,
                    `Invalid permission values for keys: ${invalidKeys}. Only "active" or "inactive" are allowed.`
                );
            }

            // Normalize permission
            const normalizedPermissions = Object.fromEntries(
                Object.entries(permission).map(([k, v]) => [
                    k.toLowerCase(),
                    String(v).toLowerCase(),
                ])
            );

            // Fetch and update the module
            const moduleToUpdate = await moduleModel.findByPk(decryptedId);
            if (!moduleToUpdate) {
                return sendResponse(res, 200, 1, "Module not found");
            }

            await moduleToUpdate.update({
                module_name,
                permission: normalizedPermissions,
                status,
            });

            return sendResponse(res, 200, 0, "Module updated successfully");
        } catch (error) {
            console.error("Error updating module:", error);
            return sendResponse(res, 500, 2, "Internal server error");
        }
    };


