import { Op, fn, col, where as sqlWhere } from 'sequelize';
import { ministrycatModel } from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';





// to get all the category from ministry category master
    export const getallministrycategory = async (req, res) => {
        try {
                const category = await ministrycatModel.findAll();
                if (category.length === 0) {
                return sendResponse(res, 200, 1, "No Records found");
            }
                const modifiedCategories = category.map((m) => ({
                ...m.toJSON(),
                id: vishal_encryption(m.id.toString())
            }));
                return sendResponse(res, 200, 0, "", modifiedCategories);
            } catch (error) {
                console.error("Error fetching modules:", error);
                return sendResponse(res, 500, 2, "Internal server error");
            }
    };

// to delete single category 
    export const deletecategoryfrommaster = async (req, res) => {
        try {
            const decryptedId = vishal_decryption(req.params.id);
            const deletedCount = await ministrycatModel.destroy({ where: { id: decryptedId } });
            if (deletedCount === 0) {
                return sendResponse(res, 200, 1, "Unable to delete the category. category not found.");
            }
                return sendResponse(res, 200, 0, "Category deleted successfully");
        } catch (error) {
                console.error('Error deleting category:', error);
                return sendResponse(res, 500, 2, 'Internal server error');
        }
    };

// add module in master module table 
    export const addministrycategory = async (req, res) => {
        try {
            const ministry_category = req.body.ministry_category?.toLowerCase();
            const status = req.body.status?.toLowerCase();
        
            // Valid values
            const validStatusValues = ['active', 'inactive'];

            // 1. Validate status
            if (!validStatusValues.includes(status)) {
                return sendResponse(res, 400, 1, 'Invalid status. Only active or inactive are allowed.');
            }

           

            // Check for existing module
            const moduleExistingRecord = await ministrycatModel.findOne({
                where: sqlWhere(fn('LOWER', col('ministry_category')), ministry_category),
            });

            if (!moduleExistingRecord) {
                await ministrycatModel.create({ ministry_category,  status });
                return sendResponse(res, 200, 0, 'ministry category inserted successfully');
            } else {
                return sendResponse(res, 200, 1, `${ministry_category} ministry category already exists`);
            }

        } catch (error) {
            console.error('Error inserting module:', error);
            return sendResponse(res, 500, 2, 'Internal server error');
        }
    };


// single ministry categorupdatesinglecategoryy  
    export const singleministrycategory = async (req, res) => {
    try {
        const decryptedId = vishal_decryption(req.params.id);
        const category = await ministrycatModel.findOne({ where: { id: decryptedId } });
        if (!category) {
        return sendResponse(res, 200, 1, `Category does not exist in our system with id: ${req.params.id}`);
        }
            const responseData = {
            ...category.toJSON(),
            id: req.params.id 
        };
        return sendResponse(res, 200, 0, "Category fetched successfully", responseData);
    } catch (error) {
        console.error("Error fetching category:", error);
        return sendResponse(res, 500, 2, "Internal server error");
    }
    };


//update category single 
   export const updatesinglecategory = async (req, res) => {
    try {
        const decryptedId = vishal_decryption(req.params.id);
        const ministry_category = req.body.ministry_category?.toLowerCase();
        const status = req.body.status?.toLowerCase();

        const validStatusValues = ['active', 'inactive'];
        if (!validStatusValues.includes(status)) {
            return sendResponse(res, 400, 1, 'Invalid status. Only "active" or "inactive" are allowed.');
        }

        // Check for existing ministry_category with same name but different ID
        const existingCategory = await ministrycatModel.findOne({
            where: {
                ministry_category: ministry_category,
                id: { [Op.ne]: decryptedId },  // Exclude current record
            },
        });

        if (existingCategory) {
            return sendResponse(res, 409, 1, "This ministry category already exists with another ID. Try using a different name.");
        }

        const moduleToUpdate = await ministrycatModel.findByPk(decryptedId);
        if (!moduleToUpdate) {
            return sendResponse(res, 404, 1, "Category not found");
        }

        await moduleToUpdate.update({
            ministry_category,
            status,
        });

        return sendResponse(res, 200, 0, "Category updated successfully");
    } catch (error) {
        console.error("Error updating category:", error);
        return sendResponse(res, 500, 2, "Internal server error");
    }
};

