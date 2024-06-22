import express from "express"
import bodyParser from 'body-parser'
import homepage from "./routes/APIintro.js"
import user from "./routes/user.js"

const app = express()

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use("/", homepage)
app.use("/api/user", user)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`\nServer listening on PORT: ${PORT}`)
    console.log(`Localhost Link: http://localhost:${PORT}`)
})

export default app