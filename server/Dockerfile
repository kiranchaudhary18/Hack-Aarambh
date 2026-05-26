FROM node:18-bullseye-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
# use npm ci for reproducible installs
RUN npm ci --no-audit --no-fund
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
