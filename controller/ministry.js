import { Op, fn, col, where as sqlWhere } from 'sequelize';
import { ministryModel , ministrycatModel} from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';





// to get all the ministry list from ministry master
    export const getallministry = async (req, res) => {
        try {
                const minstries = await ministryModel.findAll();
                if (minstries.length === 0) {
                return sendResponse(res, 200, 1, "No Records found");
            }
                const allministries = minstries.map((m) => ({
                ...m.toJSON(),
                id: vishal_encryption(m.id.toString()),
                ministry_category_id : vishal_encryption(m.ministry_category_id.toString())
            }));
                return sendResponse(res, 200, 0, "", allministries);
            } catch (error) {
                console.error("Error fetching modules:", error);
                return sendResponse(res, 500, 2, "Internal server error");
            }
    };

// to delete single category 
    export const deleteministry = async (req, res) => {
        try {
            const decryptedId = vishal_decryption(req.params.id);
            const deletedCount = await ministryModel.destroy({ where: { id: decryptedId } });
            if (deletedCount === 0) {
                return sendResponse(res, 200, 1, "Unable to delete the minsitry. ministry not found.");
            }
                return sendResponse(res, 200, 0, "Ministry deleted successfully");
        } catch (error) {
                console.error('Error deleting ministry:', error);
                return sendResponse(res, 500, 2, 'Internal server error');
        }
    };

// add ministry to master table    
    export const addministry = async (req, res) => {
        try {
            const {
                ministry_code,
                ministry_name,
                ministry_category_id: encryptedCategoryId,
                status,
            } = req.body;

            //  Validate Required Fields 
            const missingFields = [];
            if (!ministry_code || typeof ministry_code !== 'string') missingFields.push('ministry_code');
            if (!ministry_name || typeof ministry_name !== 'string') missingFields.push('ministry_name');
            if (!encryptedCategoryId || typeof encryptedCategoryId !== 'string') missingFields.push('ministry_category_id');
            if (!status || typeof status !== 'string') missingFields.push('status');

            if (missingFields.length) {
                return sendResponse(
                    res,
                    400,
                    1,
                    `Missing or invalid required fields: ${missingFields.join(', ')}`
                );
            }

            const normalizedStatus = status.toLowerCase();
            const allowedStatuses = ['active', 'inactive'];
            if (!allowedStatuses.includes(normalizedStatus)) {
                return sendResponse(
                    res,
                    400,
                    1,
                    `Invalid status value. Allowed: ${allowedStatuses.join(', ')}`
                );
            }

            //  Decrypt and Validate Category ID 
            let decryptedCategoryId;
            try {
                decryptedCategoryId = vishal_decryption(encryptedCategoryId);
            } catch (err) {
                return sendResponse(res, 400, 1, 'Invalid encrypted category ID. Decryption failed.');
            }

            if (!/^\d+$/.test(decryptedCategoryId)) {
                return sendResponse(res, 400, 1, 'Decrypted category ID must be a valid numeric string.');
            }

            //  Validate Category Existence 
            const category = await ministrycatModel.findByPk(decryptedCategoryId);
            if (!category) {
                return sendResponse(res, 400, 1, 'Provided category does not exist.');
            }

            //  Check for Duplicate Ministry Name (Case Insensitive) 
            const normalizedMinistryName = ministry_name.toLowerCase();
            const existingMinistry = await ministryModel.findOne({
                where: sqlWhere(fn('LOWER', col('ministry_name')), normalizedMinistryName),
            });

            if (existingMinistry) {
                return sendResponse(
                    res,
                    409,
                    1,
                    `Ministry name '${normalizedMinistryName}' already exists. Please use a different name.`
                );
            }

            //  Create Ministry Entry 
            await ministryModel.create({
                ministry_code: ministry_code.toLowerCase(),
                ministry_name: normalizedMinistryName,
                ministry_category_id: decryptedCategoryId,
                ministry_category_name: category.ministry_category?.toLowerCase() || null,
                status: normalizedStatus,
            });

            return sendResponse(res, 200, 0, 'Ministry added successfully');
        } catch (error) {
            console.error('Error inserting ministry:', error);
            return sendResponse(res, 500, 2, 'An unexpected error occurred while processing the request.');
        }
    };

// single ministry from ministry master  
   export const singleministry = async (req, res) => {
    try {
        const decryptedId = vishal_decryption(req.params.id);
        const ministry = await ministryModel.findOne({ where: { id: decryptedId } });

        if (!ministry) {
            return sendResponse(res, 200, 1, `Ministry does not exist in our system with id: ${req.params.id}`);
        }

        const data = ministry.toJSON();

      
        data.id = vishal_encryption(String(data.id));
        data.ministry_category_id = vishal_encryption(String(data.ministry_category_id));


        return sendResponse(res, 200, 0, "Ministry fetched successfully", data);
    } catch (error) {
        console.error("Error fetching ministry:", error);
        return sendResponse(res, 500, 2, "Internal server error");
    }
};



//update category single 

export const updateMinistry = async (req, res) => {
    try {
        const { id: encryptedId } = req.params;
        const {
            ministry_code,
            ministry_name,
            ministry_category_id: encryptedCategoryId,
            status,
        } = req.body;

        // Validate Required Fields
        const missingFields = [];
        if (!encryptedId || typeof encryptedId !== 'string') missingFields.push('id (in params)');
        if (!ministry_code || typeof ministry_code !== 'string') missingFields.push('ministry_code');
        if (!ministry_name || typeof ministry_name !== 'string') missingFields.push('ministry_name');
        if (!encryptedCategoryId || typeof encryptedCategoryId !== 'string') missingFields.push('ministry_category_id');
        if (!status || typeof status !== 'string') missingFields.push('status');

        if (missingFields.length) {
            return sendResponse(
                res,
                400,
                1,
                `Missing or invalid required fields: ${missingFields.join(', ')}`
            );
        }

        const normalizedStatus = status.toLowerCase();
        const allowedStatuses = ['active', 'inactive'];
        if (!allowedStatuses.includes(normalizedStatus)) {
            return sendResponse(
                res,
                400,
                1,
                `Invalid status value. Allowed: ${allowedStatuses.join(', ')}`
            );
        }

        // Decrypt and validate ID
        let decryptedId;
        try {
            decryptedId = vishal_decryption(encryptedId);
        } catch (err) {
            return sendResponse(res, 400, 1, 'Invalid encrypted ministry ID.');
        }

        if (!/^\d+$/.test(decryptedId)) {
            return sendResponse(res, 400, 1, 'Decrypted ministry ID must be a valid numeric string.');
        }

        // Decrypt and validate category ID
        let decryptedCategoryId;
        try {
            decryptedCategoryId = vishal_decryption(encryptedCategoryId);
        } catch (err) {
            return sendResponse(res, 400, 1, 'Invalid encrypted category ID.');
        }

        if (!/^\d+$/.test(decryptedCategoryId)) {
            return sendResponse(res, 400, 1, 'Decrypted category ID must be a valid numeric string.');
        }

        // Check if ministry exists
        const existingMinistry = await ministryModel.findByPk(decryptedId);
        if (!existingMinistry) {
            return sendResponse(res, 404, 1, 'Ministry not found.');
        }

        // Validate category existence
        const category = await ministrycatModel.findByPk(decryptedCategoryId);
        if (!category) {
            return sendResponse(res, 400, 1, 'Provided category does not exist.');
        }

        const normalizedMinistryName = ministry_name.toLowerCase();
        const normalizedMinistryCode = ministry_code.toLowerCase();

        // Check for duplicates in other ministries
        const duplicateMinistry = await ministryModel.findOne({
            where: {
                [Op.or]: [
                    sqlWhere(fn('LOWER', col('ministry_name')), normalizedMinistryName),
                    sqlWhere(fn('LOWER', col('ministry_code')), normalizedMinistryCode),
                ],
                id: { [Op.ne]: decryptedId },
            },
        });

        if (duplicateMinistry) {
            return sendResponse(
                res,
                409,
                1,
                'Another ministry with the same name or code already exists.'
            );
        }

        // Perform update
        await ministryModel.update(
            {
                ministry_code: normalizedMinistryCode,
                ministry_name: normalizedMinistryName,
                ministry_category_id: decryptedCategoryId,
                ministry_category_name: category.ministry_category?.toLowerCase() || null,
                status: normalizedStatus,
            },
            { where: { id: decryptedId } }
        );

        return sendResponse(res, 200, 0, 'Ministry updated successfully');
    } catch (error) {
        console.error('Error updating ministry:', error);
        return sendResponse(res, 500, 2, 'An unexpected error occurred while updating the ministry.');
    }
};


