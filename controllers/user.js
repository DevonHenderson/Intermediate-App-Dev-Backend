// Allows for the creation of a user

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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