import express from "express"

import { 
    APIintro
 } from "../controllers/APIintro.js"

const router = express.Router()

router.get("/", APIintro)

export default router