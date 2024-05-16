import { Router }  from "express"

import {
    createUser
} from "..controllers/user.js"

const router = Router()

router.post("/", createUser)

export default router