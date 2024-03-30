import path from "node:path";
import amqplib from "amqplib";

if (!process.env.RABBIT_MQ_HOST) {
  throw new Error("Rabbit mq not provided");
}

const Queue = process.env.RABBIT_MQ_QUEUE || "fast-encoder";

/**
 * @type {import("amqplib").Connection}
 */
const conn = await amqplib.connect(process.env.RABBIT_MQ_HOST);
const channel = await conn.createChannel();

const validSuffix = [".mp4", ".mkv", ".webm", ".avi", ".mov"];
/**
 *  @type {import("aws-lambda").Handler<import("aws-lambda").S3CreateEvent>}
 */
export const handler = async (event, _context) => {
  for (const record of event.Records) {
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    if (!validSuffix.includes(path.extname(key))) continue;
    channel.sendToQueue(
      Queue,
      Buffer.from(
        JSON.stringify({
          key,
          size: record.s3.object.size,
          bucket: record.s3.bucket.name,
        })
      )
    );
  }

  const response = { statusCode: 200 };
  return response;
};
