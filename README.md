# Rickroll Prank 🕺

Trang giả làm "Video tổng kết năm 2026" trông nghiêm túc. Bấm play là lên **full màn hình** và phát *Never Gonna Give You Up* có tiếng (file mp4 trong repo).

## Đưa lên GitHub Pages

```bash
git init
git add .
git commit -m "Video tong ket"
git branch -M main
git remote add origin https://github.com/<username>/<ten-repo>.git
git push -u origin main
```

Sau đó vào repo trên GitHub → **Settings** → **Pages** → *Source*: **Deploy from a branch** → Branch: `main`, thư mục `/ (root)` → **Save**.

Đợi 1–2 phút, link sẽ là:
`https://<username>.github.io/<ten-repo>/`

> Mẹo: đặt tên repo kiểu `tong-ket-2026` để link trông nghiêm túc.

## Lưu ý
- File video ~88 MB: dưới giới hạn 100 MB của GitHub nên push được (git sẽ cảnh báo >50 MB, kệ nó).
- Nhấn Esc để thoát fullscreen, nhấp đúp vào video để vào lại.
- iPhone (Safari) không cho trang web vào fullscreen. Video vẫn phát khi bạn bè bấm vào.
