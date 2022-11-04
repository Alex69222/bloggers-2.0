import {Request, Response, Router} from "express";
import {BodyFieldsEnum, validateRequestBody, VideoResolutionsEnum} from "../validators/request-body-validator";

export type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: null | number
    createdAt: string
    publicationDate: string
    availableResolutions: Array<VideoResolutionsEnum>
}
let id = 4
export let videos: Array<VideoType> = [
    {
        id: 1,
        title: "Video 1",
        author: "Author 1",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-10-29T12:31:29.424Z",
        publicationDate: "2022-10-29T12:31:29.424Z",
        availableResolutions: [
            VideoResolutionsEnum.P1440
        ]
    },
    {
        id: 2,
        title: "Video 2",
        author: "Author 2",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2022-11-29T12:31:29.424Z",
        publicationDate: "2022-11-29T12:31:29.424Z",
        availableResolutions: [
            VideoResolutionsEnum.P1440
        ]
    },
    {
        id: 3,
        title: "Video 3",
        author: "Author 3",
        canBeDownloaded: false,
        minAgeRestriction: 18,
        createdAt: "2021-11-29T12:31:29.424Z",
        publicationDate: "2021-11-29T12:31:29.424Z",
        availableResolutions: [
            VideoResolutionsEnum.P1440
        ]
    }
]
export const videosRouter = Router({})

videosRouter.get("/", (req: Request, res: Response) => {
    if (req.query.title) {
        const searchString = req.query.title.toString()
        res.send(videos.filter(v => v.title.indexOf(searchString) > -1))
    } else {
        res.send(videos)
    }
})
videosRouter.get("/:id", (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)
    if (!video) return res.send(404)
    res.send(video)
})
videosRouter.delete("/:id", (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)

    if (!video) return res.send(404)

    videos = videos.filter(v => v !== video)
    res.send(204)
})
videosRouter.post("/", (req: Request, res: Response) => {
    const errorsObj = validateRequestBody(req.body, BodyFieldsEnum.title, BodyFieldsEnum.author, BodyFieldsEnum.minAgeRestriction, BodyFieldsEnum.availableResolutions)
    if (errorsObj.errorsMessages.length) return res.status(400).send(errorsObj)
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const canBeDownloaded = req.body.canBeDownloaded || false
    const minAgeRestriction = req.body.minAgeRestriction || null
    let now = new Date()
    const newVideo = {
        id: id,
        title,
        author,
        canBeDownloaded,
        minAgeRestriction,
        createdAt: now.toISOString(),
        publicationDate: new Date(now.setDate(now.getDate() + 1)).toISOString(),
        availableResolutions
    }
    videos.push(newVideo)
    id++;

    res.status(201).send(newVideo)
})

videosRouter.put("/:id", (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.id)
    if (!video) return res.send(404)

    const errorsObj = validateRequestBody(req.body, BodyFieldsEnum.title, BodyFieldsEnum.author, BodyFieldsEnum.minAgeRestriction, BodyFieldsEnum.availableResolutions, BodyFieldsEnum.canBeDownloaded, BodyFieldsEnum.publicationDate)
    if (errorsObj.errorsMessages.length) return res.status(400).send(errorsObj)
    const title: string = req.body.title
    const author: string = req.body.author
    const availableResolutions: Array<VideoResolutionsEnum> = req.body.availableResolutions
    const canBeDownloaded: boolean = req.body.canBeDownloaded
    const minAgeRestriction: null | number = req.body.minAgeRestriction
    const publicationDate: string = req.body.publicationDate

    videos = videos.map((v) : VideoType => {
        if (v.id === +req.params.id) {
            return {
                id: video!.id,
                createdAt: video!.createdAt,
                title,
                author,
                availableResolutions,
                canBeDownloaded: canBeDownloaded || video!.canBeDownloaded,
                minAgeRestriction: minAgeRestriction || video!.minAgeRestriction,
                publicationDate: publicationDate || video!.publicationDate
            }
        } else {
            return v
        }
    })
    res.send(204)

})