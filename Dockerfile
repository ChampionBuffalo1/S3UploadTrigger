FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}
COPY package.json index.js ./
RUN npm install --omit=dev
CMD ["index.handler"]