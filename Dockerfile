# 1. Node rasmiy image'dan foydalanamiz
FROM node:20-alpine

# 2. Ishchi papkani yaratamiz va unga o'tamiz
WORKDIR /app

# 3. Loyiha fayllarini nusxalash
COPY . .

# 4. Paketlarni nusxalash
COPY package*.json ./

# 5. Paketlarni o'rnatamiz
RUN npm install

# 6. TypeScript build qilamiz
RUN npm run build

# 7. Portni ochamiz
EXPOSE 3000

# 8. NestJS serverni ishga tushuramiz
CMD ["node", "dist/main.js"]
