import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";

export class CommonValidator {

    static validateObjectFound<T>(obj: T, message: string = CustomMessages.GENERIC_NOT_FOUND) {
        if (!obj) {
            throw new HttpException(message, HttpStatus.NOT_FOUND);
        }
        return obj;
    }

    static validateNotNull<T>(obj: T, message: string = CustomMessages.GENERIC_NOT_NULL) {
        if (!obj) {
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
        }
        return obj;
    }

    static validateString(obj: String, message: string = CustomMessages.GENERIC_INVALID_STRING) {
        if (obj && obj.length > 0) {
            return obj;
        }
        throw new HttpException(message, HttpStatus.BAD_REQUEST);        
    }

}