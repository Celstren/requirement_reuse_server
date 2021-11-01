import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { Timestamp } from "typeorm";

export class DateValidator {

    static getValidatedFromTo(from: string, to: string): {
        'from': Date,
        'to': Date
    } {
        let fromTimestamp, toTimestamp: Date;
        if (from) {
            fromTimestamp = new Date(from);
            toTimestamp = to ? new Date(to) : new Date();
            if (!fromTimestamp) {
                throw new HttpException(CustomMessages.INVALID_CREATED_FROM_VALUE, HttpStatus.BAD_REQUEST); 
            } else if (!toTimestamp) {
                throw new HttpException(CustomMessages.INVALID_CREATED_TO_VALUE, HttpStatus.BAD_REQUEST); 
            }
        }
        return {
            'from': fromTimestamp,
            'to': toTimestamp,
        };
    }

}