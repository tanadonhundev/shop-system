# ใช้ Node LTS
FROM node:20-alpine

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json + yarn.lock / package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมด
COPY . .

# build Next.js
RUN npm run build

# expose port
EXPOSE 3000

# รัน Next.js
CMD ["npm", "run", "start"]
