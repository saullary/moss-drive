// const axios = require("axios");
import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getFileSize, limitTask } from "./helper";

const bucket = {
  client: null,
  getFileSize,
  limitTask,
  setClient(apiKey, apiSecret) {
    this.client = new S3({
      endpoint: "https://endpoint.4everland.co",
      region: "eu-west-2",
      credentials: {
        accessKeyId: apiKey,
        secretAccessKey: apiSecret,
      },
    });
  },
  checkClient() {
    if (!this.client) throw new Error("Please login first");
  },
  uploadFile(params, opts = {}) {
    const task = new Upload({
      client: this.client,
      queueSize: 3,
      params,
    });
    task.on("httpUploadProgress", (e) => {
      e.perc = ((e.loaded / e.total) * 100) | 0;
      // console.log(e.perc);
      const fn = opts.onProgress;
      fn && fn(e);
    });
    return task.done();
  },
  getPathInfo(name) {
    const mat = /^([^\/]+)(\/.+)?/.exec(name);
    if (!mat) throw new Error("illegal Bucket path");
    const Bucket = mat[1];
    const Prefix = (mat[2] || "").replace("/", "");
    return {
      Bucket,
      Prefix,
    };
  },
  async listBuckets() {
    const res = await this.client.listBuckets({});
    // console.log(res.Buckets); // [{Name, CreationDate}]
    return res.Buckets;
  },
  createBucket(Bucket) {
    return this.client.createBucket({
      Bucket,
    });
  },
  listObjects(params) {
    return this.client
      .listObjectsV2({
        Delimiter: "/",
        MaxKeys: 30,
        ...params,
      })
      .then((res) => {
        return {
          rows: [
            ...(res.CommonPrefixes || []).map((it) => ({
              name: it.Prefix.replace(params.Prefix, "").replace("/", ""),
              prefix: true,
              type: "folder",
            })),
            ...(res.Contents || []).map((it) => {
              const name = it.Key.replace(params.Prefix, "");
              const ext = /\.(\w+)$/.exec(name)[1];
              let type = "other";
              if (["png", "jpg", "jpeg", "gif", "svg", "ico", "webp"].includes(ext)) {
                type = "image";
              } else if (["mp3", "wav", "ogg"].includes(ext)) {
                type = "audio";
              } else if (["mp4", "mov", "webm", "mpg", "mpeg"].includes(ext)) {
                type = "video";
              }
              // else if (/txt|js|htm|css|java|kotlin|vue|json|sh|swift|md|go/.test(ext)) {
              //   type = "text";
              // }
              return {
                url: `https://${params.Bucket}.4everland.store/${it.Key}`,
                key: it.Key,
                name,
                type,
                size: it.Size,
                sizeUnit: getFileSize(it.Size),
                lastModified: it.LastModified,
                updatedAt: it.LastModified.format("date"),
                etag: it.ETag,
              };
            }),
          ],
        };
        //
      });
  },
};

export default bucket;

// bucket.listBuckets();
