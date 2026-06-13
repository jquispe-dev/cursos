FROM node:22-alpine

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --chown=app:app package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=app:app server.js .

USER app

EXPOSE 5000
CMD ["node", "server.js"]
