import { organisationTypeModel } from '../postgres/postgres.js';
import { sendResponse } from './responseHandler.js';
import { vishal_encryption, vishal_decryption } from './encryption.js';
import { Op, fn, col, where as sqlWhere } from 'sequelize';

// -----------------------------
// GET All Organisation Types
// -----------------------------
export const getAllOrganisationTypes = async (req, res) => {
  try {
    const types = await organisationTypeModel.findAll();
    if (!types.length) return sendResponse(res, 200, 1, 'No Organisation Types found');

    const formatted = types.map(type => ({
      ...type.toJSON(),
      id: vishal_encryption(type.id.toString())
    }));

    return sendResponse(res, 200, 0, '', formatted);
  } catch (error) {
    console.error('Error fetching organisation types:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// GET Single Organisation Type
// -----------------------------
export const getSingleOrganisationType = async (req, res) => {
  try {
    const id = vishal_decryption(req.params.id);
    const type = await organisationTypeModel.findByPk(id);

    if (!type) return sendResponse(res, 404, 1, 'Organisation type not found');

    const data = type.toJSON();
    data.id = vishal_encryption(data.id.toString());

    return sendResponse(res, 200, 0, 'Organisation type fetched', data);
  } catch (error) {
    console.error('Error fetching organisation type:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// POST Add Organisation Type
// -----------------------------
export const addOrganisationType = async (req, res) => {
  try {
    const { organisation_type, type_description } = req.body;

    if (!organisation_type)
      return sendResponse(res, 400, 1, 'Organisation type name is required');

    const existing = await organisationTypeModel.findOne({
      where: sqlWhere(fn('LOWER', col('organisation_type')), organisation_type.toLowerCase())
    });

    if (existing) return sendResponse(res, 409, 1, 'Organisation type already exists');

    await organisationTypeModel.create({ organisation_type, type_description });

    return sendResponse(res, 200, 0, 'Organisation type added');
  } catch (error) {
    console.error('Error adding organisation type:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// PUT Update Organisation Type
// -----------------------------
export const updateOrganisationType = async (req, res) => {
  try {
    const { organisation_type, type_description } = req.body;
    const id = vishal_decryption(req.params.id);

    if (!organisation_type)
      return sendResponse(res, 400, 1, 'Organisation type name is required');

    const type = await organisationTypeModel.findByPk(id);
    if (!type) return sendResponse(res, 404, 1, 'Organisation type not found');

    const duplicate = await organisationTypeModel.findOne({
      where: {
        [Op.and]: [
          sqlWhere(fn('LOWER', col('organisation_type')), organisation_type.toLowerCase()),
          { id: { [Op.ne]: id } }
        ]
      }
    });

    if (duplicate) return sendResponse(res, 409, 1, 'Another organisation type with same name exists');

    await organisationTypeModel.update(
      { organisation_type, type_description },
      { where: { id } }
    );

    return sendResponse(res, 200, 0, 'Organisation type updated');
  } catch (error) {
    console.error('Error updating organisation type:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};

// -----------------------------
// DELETE Organisation Type
// -----------------------------
export const deleteOrganisationType = async (req, res) => {
  try {
    const id = vishal_decryption(req.params.id);

    const type = await organisationTypeModel.findByPk(id);
    if (!type) return sendResponse(res, 404, 1, 'Organisation type not found');

    await organisationTypeModel.destroy({ where: { id } });

    return sendResponse(res, 200, 0, 'Organisation type deleted');
  } catch (error) {
    console.error('Error deleting organisation type:', error);
    return sendResponse(res, 500, 2, 'Internal server error');
  }
};
