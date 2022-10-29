import express, {Request, Response} from "express";
import {videosRouter} from "./routes/videos-router";
import {testingRouter} from "./routes/testing-router";
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())


app.get('/', (req: Request, res: Response) => {
    res.send('Bloggers Tube 2.0')
})

app.use("/testing", testingRouter)

app.use("/api/videos", videosRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})