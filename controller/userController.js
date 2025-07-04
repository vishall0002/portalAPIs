


import { where } from "sequelize";
import { userModel } from "../postgres/postgres.js";
import { sendResponse } from "./responseHandler.js"; 
// import { designationMasterModel } from '../model/designationMaster.js';
// import { organisationMasterModel } from '../model/organisationMaster.js';


import { designationMasterModel , organisationMasterModel } from "../postgres/postgres.js";
import { response } from "express";
import { vishal_decryption } from "./encryption.js";


//to get all the employee details
    export const getAllEmp = async (req, res) => {
        try {
            const users = await userModel.findAll();


             console.log("line numbe 19 ends here");
            console.log(users);
            console.log("line numbe 21 ends here");

            // vihsalllll();
            if (users.length === 0) {
                return sendResponse(res, 200, 1, "No Records found");
            }
            return sendResponse(res, 200, 0, "", users);
        } catch (error) {
            console.error("Error fetching users:", error);
            return sendResponse(res, 500, 2, "Internal server error");
        }
    };


// to add any employee 
    export const addEmp = async (req, res) => {
        const {
            name,
            email,
            mobile,
            designation_code, // ✅ Correct spelling
            organisation_id,
            status = 'inactive',
            role,
            access_permission,
            empId
        } = req.body;

        try {
            // Check if designation code exists
            const designation = await designationMasterModel.findOne({
                where: { designation_code: designation_code } 
            });

            if (!designation) {
                return sendResponse(res, 400, 1, "Invalid designation code");
            }

            // Check if organisation ID exists
            const organisation = await organisationMasterModel.findOne({
                where: { id:  vishal_decryption(organisation_id)  }
            });

            if (!organisation) {
                return sendResponse(res, 400, 1, "Invalid organisation ID");
            }

            // Check for existing employee
            const userExistingRecord = await userModel.findOne({ where: { empId } });

            if (userExistingRecord) {
                return sendResponse(res, 409, 1, "Employee ID already exists");
            }

            await userModel.create({
                name,
                email,
                mobile,
                designation_code,
                designation_name: designation.designation_name,
                organisation_name: organisation.organisation_name,
                organisation_id,
                status,
                role,
                access_permission,
                empId
            });
            return sendResponse(res, 200, 0, "Employee added successfully");

        } catch (error) {
            console.error("Error inserting employee:", error);
            return sendResponse(res, 500, 2, "Internal server error");
        }
    };



//    export const addEmp = async (req, res) => {
//     const {
//         name,
//         email,
//         mobile,
//         desingnation_code, // as per your schema (typo preserved)
//         designation_name,
//         organisation_name,
//         organisation_id,
//         status = 'active',
//         role,
//         access_permission,
//         empId
//     } = req.body;

//     try {
//         // Check if employee with given empId already exists
//         const userExistingRecord = await userModel.findOne({ where: { empId } });

//         if (!userExistingRecord) {
//             await userModel.create({
//                 name,
//                 email,
//                 mobile,
//                 desingnation_code,
//                 designation_name,
//                 organisation_name,
//                 organisation_id,
//                 status,
//                 role,
//                 access_permission,
//                 empId
//             });

//             return sendResponse(res, 200, 0, "Data inserted successfully");
//         } else {
//             return sendResponse(res, 200, 1, "Employee ID already exists");
//         }
//     } catch (error) {
//         console.error("Error inserting employee:", error);
//         return sendResponse(res, 500, 2, "Internal server error");
//     }
// };



// to get the data of the particular employee

    export const singleEmployee = async (req, res) => {
        const { empId } = req.params;

        try {
            const employeeDetail = await userModel.findOne({ where: { empId } });

            if (!employeeDetail) {
                return sendResponse(res, 200, 1, `Employee does not exist in our system with empId: ${empId}`);
            }

            return sendResponse(res, 200, 0, "Employee fetched successfully", employeeDetail);
            
        } catch (error) {
            console.error("Error fetching employee:", error);
            return sendResponse(res, 500, 2, "Internal server error");
        }
    };


//to delete the employee 

    export const deleteEmployee = async (req, res) => {
        const { empId } = req.params;

        try {
            const deletedCount = await userModel.destroy({ where: { empId } });

            if (deletedCount === 0) {
                return sendResponse(res, 200, 1, "Unable to delete the employee. Employee not found.");
            }

            return sendResponse(res, 200, 0, "Employee deleted successfully");
        } catch (error) {
            console.error("Error in deleting the employee:", error);
            return sendResponse(res, 500, 2, "Internal server error");
        }
    };
