# Deploy web và chuẩn bị ứng dụng iPad/iPhone

**Cập nhật local development:** xem [LOCAL_MOBILE.md](LOCAL_MOBILE.md). `.env.development` hiện gọi trực tiếp backend localhost; đặt biến rỗng trong `.env.development.local` nếu cần dùng proxy. Các lệnh `cap:*:mobile` chọn `.env.mobile` và cấu hình HTTP riêng; phần production bên dưới giữ nguyên.

## Development hiện tại

Chạy backend Spring Boot tại `http://localhost:8080`, sau đó chạy trong `frontend`:

```sh
npm install
npm run dev
```

Không đặt `VITE_API_BASE_URL` trong môi trường development, hoặc đặt giá trị rỗng trong `.env.development.local`. Vite tiếp tục proxy `/api` và `/uploads` sang backend local, không cần đổi các component.

Nếu chủ động đặt `VITE_API_BASE_URL=http://localhost:8080`, frontend sẽ gọi trực tiếp backend. Khi đó backend cần cho phép origin `http://localhost:5173` qua CORS. Dùng proxy là cách giữ nguyên cấu hình development hiện tại.

## Vercel

1. Import repository vào Vercel, đặt **Root Directory** là `frontend` (hoặc đường dẫn tương ứng trong repository).
2. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
3. Khi có backend HTTPS thật, đặt Environment Variable:

   ```dotenv
   VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN.example.com
   ```

   Thay placeholder bằng **origin thật**, không thêm `/api`. Đây là cấu hình công khai, không đặt mật khẩu, khóa JWT hoặc thông tin SQL Server vào biến `VITE_*`.
4. Redeploy sau khi thay biến môi trường: Vite đưa giá trị vào bundle ở thời điểm build.
5. `vercel.json` đã cấu hình SPA fallback để truy cập/reload trực tiếp `/employees/1`, `/organization`, v.v. Các API và ảnh đều gọi origin backend qua cấu hình dùng chung.

Khi chưa có backend URL, vẫn có thể build và xem giao diện đăng nhập. Thao tác API trong production sẽ báo dịch vụ chưa được cấu hình; ứng dụng không dùng dữ liệu giả và không gọi `localhost` của người dùng. `.env.example` không tự được Vite nạp. Để kiểm tra build local với backend production, tạo `.env.production.local` từ mẫu và điền URL thật.

Frontend trên Vercel không chạy Java Spring Boot hoặc SQL Server. Backend cần được triển khai riêng, truy cập được qua HTTPS và kết nối SQL Server thật.

## Điều kiện kết nối backend

Backend/reverse proxy cần cho phép đúng origin frontend Vercel, phương thức GET/POST/PUT/DELETE/OPTIONS và các header `Authorization`, `Content-Type`. CORS phải hoạt động cho cả `/api/**` và `/uploads/**`, bao gồm preflight OPTIONS. Giữ nguyên xác thực JWT và kiểm tra vai trò. Không sửa backend trong thay đổi này.

Ảnh vẫn được tải bằng Bearer token rồi hiển thị qua blob URL; không chuyển sang đường dẫn ảnh công khai. Backend phải hỗ trợ multipart upload đến 5 MB cộng phần overhead của request.

## Chuẩn bị Capacitor (chưa tạo/build native project)

`capacitor.config.json` dùng `dist` làm web bundle. `appId` hiện là placeholder `com.example.employeemanagement`: đổi sang bundle identifier của tổ chức trước khi tạo native project. Không cấu hình `server.url`; ứng dụng đóng gói bundle React, chỉ dữ liệu gọi backend HTTPS.

Đã cài core, CLI và nền tảng iOS. Khi bắt đầu bước native trên máy Mac:

```sh
# Đặt VITE_API_BASE_URL thật trong .env.production.local trước.
npm run build
npx cap add ios
npm run cap:sync
npm run cap:ios
```

Trong Xcode, chọn signing team, bundle identifier, tên ứng dụng và icon; kiểm tra iPad trước rồi iPhone trên simulator và thiết bị thật. Build/ký/phát hành App Store là bước riêng, chưa thực hiện trong thay đổi này.

Chuẩn bị Android sau:

```sh
npm install @capacitor/android@8.4.3 --save-exact
npx cap add android
npm run cap:sync
npm run cap:android
```

Ứng dụng native vẫn dùng fetch từ WebView. Backend cần cho phép origin native theo cấu hình Capacitor (mặc định iOS `capacitor://localhost`, Android `https://localhost`) cho API và ảnh. Phiên đăng nhập hiện giữ cơ chế localStorage của frontend; trước bản phát hành native cần đánh giá lưu trữ phiên, vòng đời ứng dụng và kiểm thử upload ảnh trên thiết bị thật.

## Kiểm tra responsive

```sh
npm run build
npm run lint
npm run test:config
npm run test:e2e
npx playwright install webkit
npm run test:webkit
```

Kiểm tra từ 375 px đến 1440 px, iPad dọc/ngang, split view, iPhone ngang, vùng form khi chiều cao màn hình bị thu nhỏ và menu khi đổi breakpoint. Các test trình duyệt dùng fixture riêng trong thư mục tests; ứng dụng chạy thật không chứa mock API hoặc dữ liệu nhân viên giả. WebKit trên máy tính không thay thế kiểm thử Safari/WKWebView và bàn phím trên iPad/iPhone thật.

Tài liệu chính thức: [Vite trên Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Capacitor setup](https://capacitorjs.com/docs/getting-started), [Capacitor iOS](https://capacitorjs.com/docs/ios).
