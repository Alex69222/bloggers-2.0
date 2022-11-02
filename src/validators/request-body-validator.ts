export enum VideoResolutionsEnum {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"

}

export enum BodyFieldsEnum {
    title = "title",
    author = "author",
    minAgeRestriction = "minAgeRestriction",
    availableResolutions = "availableResolutions",
    canBeDownloaded = "canBeDownloaded"
}

export type ErrorsObjectType = {
    errorsMessages: { message: string, field: string }[]
}

export const validateRequestBody = (body: { [key: string]: any }, ...fields: Array<string>): ErrorsObjectType => {

    const errorsObj: ErrorsObjectType = {
        errorsMessages: []
    }

    for (let field of fields) {
        if (field === BodyFieldsEnum.title) {
            try{
                if (!body[BodyFieldsEnum.title].trim()) {
                    errorsObj.errorsMessages.push(
                        {
                            field: BodyFieldsEnum.title,
                            message: "title should be provided"
                        }
                    )
                }
            }catch (e) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.title,
                        message: "title should be provided"
                    }
                )
            }

        } else if (field === BodyFieldsEnum.author) {
            if (!body[BodyFieldsEnum.author] || !body[BodyFieldsEnum.author].trim()) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.author,
                        message: "author should be provided"
                    }
                )
            }
        } else if (field === BodyFieldsEnum.minAgeRestriction) {
            if (body[BodyFieldsEnum.minAgeRestriction] && ((+body[BodyFieldsEnum.minAgeRestriction] < 1 && +body[BodyFieldsEnum.minAgeRestriction] > 18) || isNaN(+body[BodyFieldsEnum.minAgeRestriction]))) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.minAgeRestriction,
                        message: "minAgeRestriction should be a number between 1 and 18 or null"
                    }
                )
            }
        } else if (field === BodyFieldsEnum.availableResolutions) {
            if (!Array.isArray(body[BodyFieldsEnum.availableResolutions]) || body[BodyFieldsEnum.availableResolutions].length === 0) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.availableResolutions,
                        message: "Available resolutions should be provided"
                    }
                )
            }
            if (!errorsObj.errorsMessages.find(e => e.field === BodyFieldsEnum.availableResolutions)) {
                for (let res of body[BodyFieldsEnum.availableResolutions]) {
                    if (!(res in VideoResolutionsEnum)) {
                        errorsObj.errorsMessages.push(
                            {
                                field: BodyFieldsEnum.availableResolutions,
                                message: "Unsupported resolution was provided"
                            }
                        )
                        break
                    }
                }
            }
        }else if(field === BodyFieldsEnum.canBeDownloaded){
            if(body[BodyFieldsEnum.canBeDownloaded] && (typeof body[BodyFieldsEnum.canBeDownloaded] !== "boolean" )){
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.canBeDownloaded,
                        message: "You should provide only boolean value for canBeDownloaded field"
                    }
                )
            }
        }
    }
    return errorsObj
}