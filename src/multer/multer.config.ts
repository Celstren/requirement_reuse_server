import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { extname } from "path";

export const multerConfig:MulterOptions = {
    fileFilter:(req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(octet-stream|excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/)) {
            cb(null, true);
        } else {
            cb(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`), false);
        }
    }
}