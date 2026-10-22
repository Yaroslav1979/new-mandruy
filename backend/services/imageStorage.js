const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { randomUUID } = require("crypto");

const bucket = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploadImage(buffer) {
  const key = `places/${randomUUID()}.jpg`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: `${publicUrl}/${key}`,
  };
}

async function deleteImageByUrl(url) {
  if (!publicUrl || !url?.startsWith(`${publicUrl}/`)) {
    return false;
  }

  const key = decodeURIComponent(new URL(url).pathname.replace(/^\/+/, ""));

  await r2.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  return true;
}

module.exports = {
  uploadImage,
  deleteImageByUrl,
};
