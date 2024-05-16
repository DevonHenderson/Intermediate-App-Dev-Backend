import express from "express"

import {
    createUser,
    getAllUsers,
    getUserByID
} from "../controllers/user.js"

const router = express.Router()
                                // Endpoint examples
router.post("/", createUser)    // 
router.get("/", getAllUsers)    // /api/user
router.get("/:id", getUserByID) // /api/user/1

export default router