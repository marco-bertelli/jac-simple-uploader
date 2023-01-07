import { uploadFile } from "./uploader/s3.js";

// uplaoding my file from local directory
const uploadedFileUrl = await uploadFile('./test.png', 'marco_test.png')

console.log(`upload finish: ${uploadedFileUrl.Location}`);