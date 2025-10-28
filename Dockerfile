# ---------- Build Stage ----------
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 與 yarn.lock
COPY package.json yarn.lock* ./

# 安裝依賴
RUN yarn install --frozen-lockfile

# 複製專案所有檔案（包含 .env）
COPY . .

# 確保環境變數可用
ENV NODE_ENV=production

# 使用 yarn 執行 build
# 若 rolldown-vite 出錯，這行會幫你顯示更清楚的錯誤訊息
RUN yarn build

# ---------- Nginx Stage ----------
FROM nginx:1.27-alpine

# 複製靜態檔案
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 Nginx 設定
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
