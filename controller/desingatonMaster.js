import { Op, fn, col, where as sqlWhere } from 'sequelize';
import { designationMasterModel , organisationMasterModel } from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';


// -----------------------------
// getAllDesignations 
// -----------------------------

export const getAllDesignations = async (req, res) => {
  try {
    const records = await designationMasterModel.findAll();
    if (!records.length) return sendResponse(res, 200, 1, 'No designations found');

    const formatted = records.map(record => ({
      ...record.toJSON(),
      id: vishal_encryption(record.id.toString()),
      organisation_id: vishal_encryption(record.organisation_id.toString())
    }));

    return sendResponse(res, 200, 0, '', formatted);
  } catch (error) {
    console.error('Error fetching designations:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};


// -----------------------------
// addDesignation
// -----------------------------

export const addDesignation = async (req, res) => {
    try {
      const { designation_name, organisation_id } = req.body;

      if (!designation_name || !organisation_id) {
        return sendResponse(res, 400, 1, 'Missing required fields');
      }

      const orgId = vishal_decryption(organisation_id);

      const organisation = await organisationMasterModel.findOne({
        where: { id: orgId }
      });

      if (!organisation) {
        return sendResponse(res, 404, 1, 'Invalid organisation ID');
      }

      const exists = await designationMasterModel.findOne({
        where: sqlWhere(fn('LOWER', col('designation_name')), designation_name.toLowerCase())
      });

      if (exists) {
        return sendResponse(res, 409, 1, 'Designation already exists');
      }

      const newDesignation = await designationMasterModel.create({
        designation_name,
        organisation_id: orgId,
        organisation_name: organisation.organisation_name // added for refrence in future while fetching single designation detail 
      });

        await designationMasterModel.update(
          { designation_code: newDesignation.id },
          { where: { id: newDesignation.id } }
        );


      return sendResponse(res, 200, 0, 'Designation added successfully');
    } catch (error) {
      console.error('Error adding designation:', error);
      return sendResponse(res, 500, 2, 'Internal server error');
    }

  };


// -----------------------------
// getSingleDesignation
// -----------------------------



export const getSingleDesignation = async (req, res) => {
  try {
    const decryptedId = vishal_decryption(req.params.id);
    const designation = await designationMasterModel.findByPk(decryptedId);

    if (!designation) {
      return sendResponse(res, 404, 1, 'Designation not found');
    }

    const data = designation.toJSON();
    data.id = vishal_encryption(data.id.toString());
    data.organisation_id = vishal_encryption(data.organisation_id.toString());

    return sendResponse(res, 200, 0, 'Designation fetched successfully', data);
  } catch (error) {
    console.error('Error fetching designation:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};


// -----------------------------
// updateDesignation
// -----------------------------


export const updateDesignation = async (req, res) => {
  try {
    const { id: encryptedId } = req.params;
    const { designation_name, organisation_id } = req.body;

    if (!designation_name || !organisation_id) {
      return sendResponse(res, 400, 1, 'Missing required fields');
    }

    const decryptedId = vishal_decryption(encryptedId);
    const decryptedOrgId = vishal_decryption(organisation_id);

    const existing = await designationMasterModel.findByPk(decryptedId);
    if (!existing) {
      return sendResponse(res, 404, 1, 'Designation not found');
    }

    // Check for duplicate name (excluding current record)
    const duplicate = await designationMasterModel.findOne({
      where: {
        [Op.and]: [
          sqlWhere(fn('LOWER', col('designation_name')), designation_name.toLowerCase()),
          { id: { [Op.ne]: decryptedId } }
        ]
      }
    });

    if (duplicate) {
      return sendResponse(res, 409, 1, 'Another designation with the same name already exists');
    }

    await designationMasterModel.update(
      {
        designation_name,
        organisation_id: decryptedOrgId
      },
      {
        where: { id: decryptedId }
      }
    );

    return sendResponse(res, 200, 0, 'Designation updated successfully');
  } catch (error) {
    console.error('Error updating designation:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};
