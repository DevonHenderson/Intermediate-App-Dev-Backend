// Allows for the creation of a user

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * Creates a new user with the provided information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message
 */
const createUser = async (req, res) =>{
    try{
        //Check if the request content is JSON
        const contentType = req.headers["content-type"]
        if (contentType != "application/json"){
            //Show error with message if incorrect
            return res.status(400).json({ 
                error: "Invalid request format",
                msg: "The request must be in JSON format (Content-Type: application/json)"
            })
        }

        //Create the user if the request was correct format
        await prisma.user.create({
            data: { ...req.body }
        })

        //Check that the user was created successfully
        const user = await prisma.user.findMany()
        return res.status(201).json({
            msg: "User created successfully",
            data: user //List of all users returned to show user has been added
        })

    } catch (err) {
        return res.status(500).json({
            msg: err.message,
          });
    }
}

/**
 * Gets a list of all users data
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        //removes error showing "Cannot get /user"
        if (users.length == 0){
            return res.status(404).json({ msg: "No users found" })
        }

        //If users are found, show them
        return res.status(200).json(users);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get a single user data using ID value (int)
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message
 */
const getUserByID = async (req, res) => {
    try{
        //See if request contains userID
        const userID = parseInt(req.params.id)
        if (!userID){
            return res.status(400).json({ error: "User ID in request is incorrect or missing" });
        }

        //Search for user using ID number
        const user = await prisma.user.findUnique({
            where: { id: userID}
        })

        //If user isnt found
        if (!user){
            return res.status(404).json({
                msg: `No user with ID: ${userID}`
            })
        }

        //User found, return the data
        return res.status(200).json({ data: user })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export {
    createUser,
    getAllUsers,
    getUserByID
}