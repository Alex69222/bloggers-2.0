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
    canBeDownloaded = "canBeDownloaded",
    publicationDate = "publicationDate"
}

export type ErrorsObjectType = {
    errorsMessages: { message: string, field: string }[]
}
let dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
export const validateRequestBody = (body: { [key: string]: any }, ...fields: Array<string>): ErrorsObjectType => {

    const errorsObj: ErrorsObjectType = {
        errorsMessages: []
    }

    for (let field of fields) {
        if (field === BodyFieldsEnum.title) {

            if (typeof body[BodyFieldsEnum.title] !== 'string') {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.title,
                        message: "title should be provided as a string"
                    }
                )
            } else if (!body[BodyFieldsEnum.title].trim()) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.title,
                        message: "title should be provided"
                    }
                )
            } else if (body[BodyFieldsEnum.title].length > 40) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.title,
                        message: "title length should be maximum 40 symbols"
                    }
                )
            }


        } else if (field === BodyFieldsEnum.author) {
            if(typeof body[BodyFieldsEnum.author] !== "string"){
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.author,
                        message: "author should be provided as a string"
                    }
                )
            } else if (!body[BodyFieldsEnum.author].trim()) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.author,
                        message: "author should be provided"
                    }
                )
            }else if(body[BodyFieldsEnum.author].length > 20){
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.author,
                        message: "author length can be 20 symbols max"
                    }
                )
            }
        } else if (field === BodyFieldsEnum.minAgeRestriction) {
            if(typeof (+body[BodyFieldsEnum.minAgeRestriction]) !== 'number' &&  body[BodyFieldsEnum.minAgeRestriction] !== null &&  body[BodyFieldsEnum.minAgeRestriction] !== undefined){
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.minAgeRestriction,
                        message: "minAgeRestriction should be a number or null"
                    }
                )
            }else if( typeof +body[BodyFieldsEnum.minAgeRestriction] === 'number' && (+body[BodyFieldsEnum.minAgeRestriction] < 1 || +body[BodyFieldsEnum.minAgeRestriction] > 18)){
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
        } else if (field === BodyFieldsEnum.canBeDownloaded) {
            if (body[BodyFieldsEnum.canBeDownloaded] && (typeof body[BodyFieldsEnum.canBeDownloaded] !== "boolean")) {
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.canBeDownloaded,
                        message: "You should provide only boolean value for canBeDownloaded field"
                    }
                )
            }
        } else if(field === BodyFieldsEnum.publicationDate){
            if(body[BodyFieldsEnum.publicationDate] &&
                (typeof body[BodyFieldsEnum.publicationDate] !== "string" || !dateRegex.test(body[BodyFieldsEnum.publicationDate]))
                ){
                errorsObj.errorsMessages.push(
                    {
                        field: BodyFieldsEnum.publicationDate,
                        message: "Publication date should be a date-string"
                    }
                )
            }
        }
    }
    return errorsObj
}