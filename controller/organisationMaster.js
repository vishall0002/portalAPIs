import { Op, fn, col, where as sqlWhere } from 'sequelize';
import { organisationMasterModel, organisationTypeModel, ministryModel} from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';

// -----------------------------
// Get All Organisations
// -----------------------------
export const getAllOrganisations = async (req, res) => {
  try {
    const records = await organisationMasterModel.findAll();
    if (!records.length) return sendResponse(res, 200, 1, 'No Organisations found');

    const formatted = records.map(org => ({
      ...org.toJSON(),
      id: vishal_encryption(org.id.toString()),
      organisation_type_id: vishal_encryption(org.organisation_type_id.toString()),
      ministry_id: vishal_encryption(org.ministry_id.toString())
    }));

    return sendResponse(res, 200, 0, '', formatted);
  } catch (error) {
    console.error('Error fetching organisations:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------ministryModel
// Get Single Organisation
// -----------------------------
export const getSingleOrganisation = async (req, res) => {
  try {
    const decryptedId = vishal_decryption(req.params.id);
    const org = await organisationMasterModel.findByPk(decryptedId);

    if (!org) return sendResponse(res, 404, 1, 'Organisation not found');

    const data = org.toJSON();
    data.id = vishal_encryption(data.id.toString());
    data.organisation_type_id = vishal_encryption(data.organisation_type_id.toString());
    data.ministry_id = vishal_encryption(data.ministry_id.toString());

    return sendResponse(res, 200, 0, 'Organisation fetched successfully', data);
  } catch (error) {
    console.error('Error fetching organisation:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// Add Organisation
// -----------------------------
export const addOrganisation = async (req, res) => {
  try {
    const { organisation_name, organisation_code, organisation_type_id, ministry_id } = req.body;

    if (!organisation_name || !organisation_code || !organisation_type_id || !ministry_id)
      return sendResponse(res, 400, 1, 'Missing required fields');

    const orgTypeId = vishal_decryption(organisation_type_id);
    const ministryId = vishal_decryption(ministry_id);


    console.log('Decrypted orgTypeId:', orgTypeId);
    console.log('Decrypted ministryId:', ministryId);

 



    const existing = await organisationMasterModel.findOne({
      where: sqlWhere(fn('LOWER', col('organisation_name')), organisation_name.toLowerCase())
    });

    if (existing) return sendResponse(res, 409, 1, 'Organisation already exists');


    const ministry = await ministryModel.findOne({ where: { id: ministryId } });
    if (!ministry) return sendResponse(res, 404, 1, 'Ministry not found');


    await organisationMasterModel.create({
      organisation_name,
      organisation_code,
      organisation_type_id: orgTypeId,
      ministry_id: ministryId,
      ministry_name: ministry.ministry_name 
    });

    return sendResponse(res, 200, 0, 'Organisation added successfully');
  } catch (error) {
    console.error('Error adding organisation:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// Update Organisation
// -----------------------------
export const updateOrganisation = async (req, res) => {
  try {
    const { organisation_name, organisation_code, organisation_type_id, ministry_id } = req.body;
    const encryptedId = req.params.id;

    if (!organisation_name || !organisation_code || !organisation_type_id || !ministry_id)
      return sendResponse(res, 400, 1, 'Missing required fields');

    const orgId = vishal_decryption(encryptedId);
    const orgTypeId = vishal_decryption(organisation_type_id);
    const minId = vishal_decryption(ministry_id);

    const existing = await organisationMasterModel.findByPk(orgId);
    if (!existing) return sendResponse(res, 404, 1, 'Organisation not found');

    const duplicate = await organisationMasterModel.findOne({
      where: {
        [Op.and]: [
          sqlWhere(fn('LOWER', col('organisation_name')), organisation_name.toLowerCase()),
          { id: { [Op.ne]: orgId } }
        ]
      }
    });
    if (duplicate) return sendResponse(res, 409, 1, 'Another organisation with the same name exists');

    await organisationMasterModel.update(
      {
        organisation_name,
        organisation_code,
        organisation_type_id: orgTypeId,
        ministry_id: minId
      },
      {
        where: { id: orgId }
      }
    );

    return sendResponse(res, 200, 0, 'Organisation updated successfully');
  } catch (error) {
    console.error('Error updating organisation:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// Delete Organisation
// -----------------------------
export const deleteOrganisation = async (req, res) => {
  try {
    const orgId = vishal_decryption(req.params.id);
    const existing = await organisationMasterModel.findByPk(orgId);

    if (!existing) return sendResponse(res, 404, 1, 'Organisation not found');

    await organisationMasterModel.destroy({ where: { id: orgId } });

    return sendResponse(res, 200, 0, 'Organisation deleted successfully');
  } catch (error) {
    console.error('Error deleting organisation:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};
