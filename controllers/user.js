// Allows for the creation of a user and setting of best time/score

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * Creates a new user with the provided information.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message
 */
const createUser = async (req, res) => {
    try {
        //Check request format
        const contentType = req.headers["content-type"];
        if (contentType !== "application/json") {
            return res.status(400).json({
                error: "Invalid request format",
                msg: "The request must be in JSON format (Content-Type: application/json)"
            });
        }

        //Get name from request body
        const { username } = req.body;

        // Check if user with same username already exists
        let existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            // User already exists, return existing user's ID
            return res.status(200).json({
                msg: "User already exists",
                id: existingUser.id
            });
        }

        // Create the user if it doesn't already exist
        const newUser = await prisma.user.create({
            data: { ...req.body }
        });

        return res.status(201).json({
            msg: "User created successfully",
            id: newUser.id
        });
    } catch (err) {
        return res.status(500).json({
            msg: err.message,
        });
    }
};

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

/**
 * Checks for a users Unity score and adds/updates value if correct format
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message
 */
const updateUserScore = async (req, res) => {
    try {
        //Get ID and score values from request
        const userID = parseInt(req.params.id);
        const { unityBestScore } = req.body;

        //If score is incorrect format
        if (unityBestScore === undefined) {
            return res.status(400).json({ error: "Score is required" });
        }

        //Find the specified user
        const existingUser = await prisma.user.findUnique({
            where: { id: userID }
        });

        //Return message if ID doesnt link to correct user stored in DB
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        //Set score values to find highest score
        const currentScore = existingUser.unityBestScore || 0; // Default to 0 if no score exists
        const newScore = parseInt(unityBestScore);
        //Compare the two scores and set highest score for user
        //Dont update if score lower than previous best
        if (newScore > currentScore) {
            const updatedUser = await prisma.user.update({
                where: { id: userID },
                data: { unityBestScore: newScore }
            });
            return res.status(200).json({ msg: "Score updated successfully", data: updatedUser });
        } else {
            return res.status(200).json({ msg: "Score not updated. New score is not higher." });
        }
    } catch (err) {
        console.error("Error updating score:", err);
        return res.status(500).json({ error: err.message });
    }
};

/**
 * Checks for a users UE5 best time and adds/updates value if correct format
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and message
 */
const updateUserBestTime = async (req, res) => {
    try {
        //Get ID and time values from request
        const userID = parseInt(req.params.id);
        const { unrealBestTime } = req.body;

        //If time is incorrect format
        if (unrealBestTime === undefined) {
            return res.status(400).json({ error: "Best time is required" });
        }

        //Find the specified user
        const existingUser = await prisma.user.findUnique({
            where: { id: userID }
        });

        //Return message if ID doesnt link to correct user stored in DB
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        //Set time values to find highest score
        const currentBestTime = existingUser.unrealBestTime || Infinity; // Default to Infinity if no time exists
        const newBestTime = parseFloat(unrealBestTime);

        //Compare the two times and set lowest time for user
        //Dont update if time higher than previous best
        if (newBestTime < currentBestTime) {
            const updatedUser = await prisma.user.update({
                where: { id: userID },
                data: { unrealBestTime: newBestTime }
            });

            return res.status(200).json({ msg: "Best time updated successfully", data: updatedUser });
        } else {
            return res.status(200).json({ msg: "Best time not updated. New time is not better." });
        }
    } catch (err) {
        console.error("Error updating best time:", err);
        return res.status(500).json({ error: err.message });
    }
};

export {
    createUser,
    getAllUsers,
    getUserByID,
    updateUserScore,
    updateUserBestTime
}