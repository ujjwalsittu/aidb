import { env } from "../utils/env";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { BlobServiceClient } from "@azure/storage-blob";
import { Storage as GCSStorage } from "@google-cloud/storage";
import fs from "fs";

export class StorageManager {
  private s3?: S3Client;
  private azure?: BlobServiceClient;
  private gcs?: GCSStorage;

  constructor() {
    if (env.STORAGE_PROVIDER === "s3" || env.STORAGE_PROVIDER === "minio") {
      this.s3 = new S3Client({
        region: env.AWS.REGION,
        endpoint:
          env.STORAGE_PROVIDER === "minio"
            ? "http://localhost:9000"
            : undefined,
        credentials: {
          accessKeyId: env.AWS.KEY!,
          secretAccessKey: env.AWS.SECRET!,
        },
        forcePathStyle: env.STORAGE_PROVIDER === "minio", // Minio needs this
      });
    } else if (env.STORAGE_PROVIDER === "azure") {
      const connstr = `DefaultEndpointsProtocol=https;AccountName=${env.AZURE.ACCOUNT};AccountKey=${env.AZURE.KEY};EndpointSuffix=core.windows.net`;
      this.azure = BlobServiceClient.fromConnectionString(connstr);
    } else if (env.STORAGE_PROVIDER === "gcs") {
      this.gcs = new GCSStorage({
        keyFilename: env.GCP.CREDENTIALS,
      });
    }
  }

  // Upload a buffer/file/object to object storage
  async uploadObject(
    key: string,
    data: Buffer | string,
    contentType = "application/octet-stream"
  ): Promise<string> {
    if (this.s3) {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: env.AWS.BUCKET!,
          Key: key,
          Body: typeof data === "string" ? fs.createReadStream(data) : data,
          ContentType: contentType,
        })
      );
      return `s3://${env.AWS.BUCKET}/${key}`;
    } else if (this.azure) {
      const container = this.azure.getContainerClient(env.AZURE.CONTAINER!);
      const blob = container.getBlockBlobClient(key);
      const uploadRes =
        typeof data === "string"
          ? await blob.uploadFile(data)
          : await blob.uploadData(data);
      return blob.url;
    } else if (this.gcs) {
      const bucket = this.gcs.bucket(env.GCP.BUCKET!);
      const file = bucket.file(key);
      if (typeof data === "string") {
        await file.save(fs.readFileSync(data));
      } else {
        await file.save(data);
      }
      return `gs://${env.GCP.BUCKET}/${key}`;
    }
    throw new Error("No storage provider available");
  }

  // Download (returns Buffer)
  async downloadObject(key: string): Promise<Buffer> {
    if (this.s3) {
      const obj = await this.s3.send(
        new GetObjectCommand({ Bucket: env.AWS.BUCKET!, Key: key })
      );
      return await streamToBuffer(obj.Body as any);
    } else if (this.azure) {
      const container = this.azure.getContainerClient(env.AZURE.CONTAINER!);
      const blob = container.getBlockBlobClient(key);
      const download = await blob.download();
      return await streamToBuffer(download.readableStreamBody as any);
    } else if (this.gcs) {
      const bucket = this.gcs.bucket(env.GCP.BUCKET!);
      const file = bucket.file(key);
      const [contents] = await file.download();
      return contents;
    }
    throw new Error("No storage provider available");
  }

  // Remove object
  async deleteObject(key: string): Promise<void> {
    if (this.s3) {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: env.AWS.BUCKET!, Key: key })
      );
    } else if (this.azure) {
      const container = this.azure.getContainerClient(env.AZURE.CONTAINER!);
      const blob = container.getBlockBlobClient(key);
      await blob.deleteIfExists();
    } else if (this.gcs) {
      const bucket = this.gcs.bucket(env.GCP.BUCKET!);
      await bucket.file(key).delete({ ignoreNotFound: true });
    } else {
      throw new Error("No storage provider available");
    }
  }
}

// Helper: stream to buffer (for various SDKs)
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
