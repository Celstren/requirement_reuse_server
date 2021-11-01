import { HttpException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { CustomMessages } from "./custom-messages";

interface HttpCustomException {
    status:number,
    exception:CustomException
}

export class CustomException {

    @ApiProperty()
    message: string;

    @ApiProperty({ default: new Date().toISOString() })
    timestamp: string;

    @ApiProperty()
    path: string;

    static fromApplicationException(exception: any,url:string):HttpCustomException {
        let status = 500;
        let message = exception.message ?? CustomMessages.UNKNOWN_ERROR;
        if (exception instanceof HttpException) {
            status = exception.getStatus()
            message = exception.getResponse()['message']
            if (Array.isArray(message)) message = message.join(", ")
        }
        const customException: CustomException = new CustomException();
        customException.message = message;
        customException.timestamp = new Date().toISOString();
        customException.path = url;
        return  {status,exception:customException}
    }
}