import { HttpException, HttpStatus } from "@nestjs/common";
import { CustomMessages } from "src/exception/custom-messages";
import { DeleteResult, UpdateResult } from "typeorm";

export class QueryValidator {

    static validateUpdatedRaws(updateResult: UpdateResult, message: string = CustomMessages.GENERIC_NOT_FOUND): void {
        if (updateResult.affected == 0) {
            throw new HttpException(message, HttpStatus.NOT_FOUND);
        }
    }

    static validateDeletedRaws(deltedResult: DeleteResult, message: string = CustomMessages.GENERIC_NOT_FOUND): void {
        if (deltedResult.affected == 0) {
            throw new HttpException(message, HttpStatus.NOT_FOUND);
        }
    }

}