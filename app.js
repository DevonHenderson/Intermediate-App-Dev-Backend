import express from "express"
import user from "./routes/user.js"

const app = express()

app.use("/api/user", user)

app.listen(3000, () => {
    console.log("Server listening on PORT: 3000")
})

export default app