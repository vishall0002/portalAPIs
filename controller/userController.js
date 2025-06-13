


import { where } from "sequelize";
import { userModel } from "../postgres/postgres.js";
import { sendResponse } from "./responseHandler.js"; 
// import { response } from "express";


//to get all the employee details
    export const getAllEmp = async (req, res) => {
        try {
            const users = await userModel.findAll();

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
        const { name, email, desingnation, empId } = req.body;
        try {
            // Check if employee with given empid already exists
            const userExistingRecord = await userModel.findOne({ where: { empId } });
            if (!userExistingRecord) {
                await userModel.create({ name, email, desingnation, empId });
                return sendResponse(res, 200, 0, "Data inserted successfully");
            } else {
                return sendResponse(res, 200, 1, "Employee ID already exists");
            }
        } catch (error) {
            console.error("Error inserting employee:", error);
            return sendResponse(res, 500, 2, "Internal server error");
        }
    };


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
