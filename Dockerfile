FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# wait-for-it.sh เพื่อรอ DB
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000
CMD ["./wait-for-it.sh", "mysql:3306", "--", "npm", "run", "dev"]
