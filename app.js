import express from "express"
import user from "./routes/user.js"

const app = express()

app.use("/api/user", user)

app.listen(5432, () => {
    console.log("Server listening on PORT: 5432")
})

export default app