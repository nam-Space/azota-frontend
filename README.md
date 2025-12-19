# Azota Frontend – Website Thi Trắc Nghiệm Trực Tuyến

## 📌 Tổng quan dự án

**Azota Frontend** là phần giao diện người dùng (Client-side) của hệ thống thi trắc nghiệm Azota, được xây dựng bằng **Next.js** và **TypeScript**. Frontend chịu trách nhiệm hiển thị giao diện, xử lý luồng người dùng, gọi API tới backend NestJS và quản lý trạng thái đăng nhập, làm bài thi.

Dự án hướng tới việc xây dựng một nền tảng thi trắc nghiệm:

-   Trực quan, dễ sử dụng
-   Hiệu năng cao
-   Dễ mở rộng và bảo trì

---

## 🎯 Mục tiêu hệ thống

-   Xây dựng giao diện thi trắc nghiệm **hiện đại – thân thiện – responsive**
-   Hỗ trợ nhiều vai trò người dùng (student / teacher / admin)
-   Tích hợp xác thực JWT với backend
-   Hỗ trợ đa ngôn ngữ (vi / en)
-   Dễ dàng deploy lên môi trường production

---

## 🚀 Công nghệ & Thư viện sử dụng

### Core

-   **Next.js** – React Framework (SSR / CSR)
-   **React 18**
-   **TypeScript**

### State & Data

-   **Axios** – Gọi REST API
-   **JWT** – Authentication

### Routing & i18n

-   **Next.js Routing**
-   **Middleware** (bảo vệ route)
-   **i18n Routing** (`/vi`, `/en`)

### UI & Styling

-   **CSS / SCSS / TailwindCSS** _(tuỳ cấu hình)_
-   **Responsive Design**

### Dev Tools

-   **ESLint**
-   **Prettier**
-   **Environment Variables (.env)**

---

## 🧱 Kiến trúc Frontend

Frontend được thiết kế theo tư duy **Component-based Architecture**:

```
Page  →  Layout  →  Component  →  Service(API)
                     ↓
                   Utils / Hooks
```

### Nguyên tắc áp dụng

-   Tách UI và logic gọi API
-   Component tái sử dụng
-   Service chịu trách nhiệm giao tiếp backend
-   Hooks xử lý logic dùng chung

---

## 📂 Cấu trúc thư mục chi tiết

```bash
azota-frontend/
├── public/                    # Ảnh, icon, static files
├── src/
│   ├── components/            # Component tái sử dụng (Button, Modal, ...)
│   ├── pages/                 # Routing của Next.js
│   │   ├── index.tsx          # Trang chủ
│   │   ├── login.tsx          # Đăng nhập
│   │   ├── register.tsx       # Đăng ký
│   │   ├── exam/
│   │   │   └── [id].tsx       # Làm bài thi
│   │   └── result/
│   │       └── [id].tsx       # Xem kết quả
│   ├── layouts/               # Layout (AuthLayout, MainLayout)
│   ├── services/              # Axios service, API layer
│   ├── hooks/                 # Custom hooks
│   ├── utils/                 # Helper functions
│   ├── constants/             # Hằng số, enum
│   ├── styles/                # CSS / SCSS
│   └── middleware.ts          # Middleware bảo vệ route
├── .env.local                 # Biến môi trường
├── next.config.js             # Cấu hình Next.js
├── package.json
└── README.md
```

---

## 🔐 Authentication & Authorization

### Cơ chế hoạt động

1. Người dùng đăng nhập
2. Backend trả về **JWT Access Token**
3. Token được lưu tại `localStorage` hoặc `cookie`
4. Axios tự động đính kèm token vào header

```http
Authorization: Bearer <access_token>
```

### Bảo vệ route

-   Middleware kiểm tra token
-   Nếu chưa đăng nhập → redirect `/login`
-   Kiểm soát quyền truy cập theo role

---

## 📝 Luồng làm bài thi

1. Người dùng đăng nhập
2. Chọn đề thi
3. Load danh sách câu hỏi từ API
4. Làm bài & lưu trạng thái
5. Nộp bài
6. Hiển thị kết quả

---

## 🌐 Routing & Đa ngôn ngữ (i18n)

### Routing chính

-   `/` – Trang chủ
-   `/login` – Đăng nhập
-   `/register` – Đăng ký
-   `/exam/[id]` – Làm bài thi
-   `/result/[id]` – Xem kết quả

### Đa ngôn ngữ

-   `/vi` – Tiếng Việt (default)
-   `/en` – English

---

## 🔌 Kết nối Backend

Backend NestJS repository:
👉 [https://github.com/nam-Space/azota-backend](https://github.com/nam-Space/azota-backend)

### Axios config mẫu

```ts
axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

---

## ⚙️ Cài đặt & Chạy project

### 1️⃣ Clone repository

```bash
git clone https://github.com/nam-Space/azota-frontend.git
cd azota-frontend
```

---

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

---

### 3️⃣ Cấu hình môi trường (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=AZOTA
```

---

### 4️⃣ Chạy development

```bash
npm run dev
```

Truy cập:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Scripts

```bash
npm run dev       # Chạy dev
npm run build     # Build production
npm run start     # Chạy production
npm run lint      # Kiểm tra code
```

---

## 🚀 Build & Deploy

### Build

```bash
npm run build
```

### Deploy

-   **Vercel** (khuyến nghị cho Next.js)
-   **cPanel NodeJS App**
-   **VPS (PM2 + Nginx)**

---

## 🔮 Hướng phát triển tương lai

-   Countdown timer khi làm bài
-   Autosave bài làm
-   Realtime exam (WebSocket)
-   Dark mode
-   Thống kê & biểu đồ

---

## 👨‍💻 Tác giả

-   **Nam Nguyen**
-   GitHub: [https://github.com/nam-Space](https://github.com/nam-Space)

---

## 📄 License

Dự án phục vụ mục đích **học tập, nghiên cứu và phát triển hệ thống thi trắc nghiệm trực tuyến**.
