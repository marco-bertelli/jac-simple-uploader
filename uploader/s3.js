import s3 from '@auth0/s3';
import fs from 'fs';

import { accessKeyId, secretAccessKey, s3BucketName } from '../config.js';

export const uploadFile = (originalFilePath, wishedName = null) => {
    if (!wishedName) {
        throw new Error('please provide a valid file name to upload');
    }

    const filePath = wishedName;
    const s3Options = {
        accessKeyId,
        secretAccessKey,
        s3BucketName
    };
    return new Promise((resolve, reject) => {
        const s3Client = s3.createClient({
            multipartUploadThreshold: 20971520, // this is the default (20 MB)
            multipartUploadSize: 15728640, // this is the default (15 MB)
            s3Options: s3Options
        });
        const uploader = s3Client.uploadFile({
            localFile: originalFilePath,

            s3Params: {
                ACL: 'public-read',
                Bucket: s3BucketName,
                Key: filePath,
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            }
        });

        uploader.on('error', function (err) {
            console.error('unable to upload:', err.stack);
            reject(err);
        });

        uploader.on('progress', function () {
            console.log('progress', uploader.progressAmount, uploader.progressTotal);
        });

        uploader.on('end', function () {
            console.log('Uploaded to Amazon S3!');

            fs.unlink(originalFilePath, function (err) {
                if (err) {
                    // throw err;
                    console.error(`Could NoT delete file at ${originalFilePath}`);
                } else {
                    // console.log(`Successfully deleted ${originalFilePath}`);
                }
            });

            resolve({
                Location: `https://${s3BucketName}.s3.amazonaws.com/${filePath}`
            });
        });
    });
};
