// env reading package
import * as dotenv from 'dotenv';

dotenv.config()

const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3BucketName = process.env.S3_BUCKET_NAME;

export { accessKeyId, secretAccessKey, s3BucketName }