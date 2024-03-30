# S3 Lambda

Lambda Function for Adding Encoding Tasks to the RabbitMQ Instance on CreateObject Event in AWS S3.
> [!IMPORTANT]
> Since we're using RabbitMQ's priority feature, The `x-max-priority` must be set to some reasonable number, like `5`, and it should also be passed in `channel.assertQueue()` for the consumer.

# Hosting on AWS Lambda

The project needs [`amqplib`](https://www.npmjs.com/package/amqplib) in order to interact with [RabbitMQ](https://www.rabbitmq.com/) which isn't already present in the lambda environment.
So we have to add the library as a layer in lambda for the function.

## Adding Layers to Lambda

Follow the instructions below to create a lambda layer for adding `amqplib` to the function.

```bash
mkdir nodejs
cp -r node_modules/ nodejs/
zip -r amqplib.zip nodejs/
```

Now go to AWS Lambda to create a new lambda layer with `amqplib.zip`.
Once the layer has been created, assign it to the desired lambda function.

> [!NOTE]
> We could containerize the lambda function and run it on AWS without any layer management by using ECR. I have added a Dockerfile just for that; however, I haven't personally tested it. [Read More](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)

