import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { S3FileDTO } from './dto/s3-file.dto';

@Injectable()
export class S3ClientService {
    readonly s3:S3

    constructor(){
        this.s3 = new S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        })
    }

    async uploadFile(file:S3FileDTO){
        return await this.s3.upload({
            Bucket: process.env.S3_BUCKET,
            Key:file.fileName,
            Body: file.body,
            ACL: "public-read",
            ContentType: file.contentType,
        }).promise()
    }
}
