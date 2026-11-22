import { kiemTraDanhSachDuAn } from "@/tinhnang/duan/kiemtra/kiemtraduan";
import type { DuAn } from "@/tinhnang/duan/kieu/duan";

export const TU_KHOA_TAT_CA = "Tất cả";

export const DANH_SACH_BO_LOC_DU_AN: readonly string[] = [
  TU_KHOA_TAT_CA,
  "React",
  "TypeScript",
  "SVG Morphing",
  "Playwright",
  "WebGL 3D",
];

const DU_LIEU_THO = [
  {
    id: "du-an-ecoute-player",
    ten: "Phòng thu trực tuyến Écoute Chérie",
    nam: "2026",
    vaiTro: "Thiết kế giao diện & Phát triển Frontend",
    loaiMinhHoa: "amnhac",
    tomTat:
      "Trình giới thiệu đĩa than tương tác mô phỏng sóng âm và lời thoại Pháp nhẹ nhàng ngay trên trình duyệt.",
    chiTiet:
      "Dựng hoàn toàn bằng React và SVG thuần để người nghe thấy đĩa than quay, kim đọc hạ xuống và sóng biển đêm biến hình theo nhịp nhạc mà tổng gói tải lần đầu chỉ vỏn vẹn 140 KB.",
    ketQua: [
      "Tổng bản dựng xuất bản tĩnh chỉ 1,2 MB",
      "Chuyển đổi giữa 2 trạng thái phát/dừng không giật khung hình",
      "Hỗ trợ đầy đủ chế độ giảm chuyển động cho người nhạy cảm thị giác",
    ],
    kyNang: ["React", "TypeScript", "SVG Morphing"],
    lienKet: "https://github.com",
  },
  {
    id: "du-an-tap-chi-so",
    ten: "Ấn phẩm số Rivage Parisien",
    nam: "2025",
    vaiTro: "Kiến trúc giao diện",
    loaiMinhHoa: "tapchi",
    tomTat:
      "Chuyên trang biên tập nghệ thuật thị giác kết hợp lưới chữ cổ điển và thư viện ảnh WebP siêu nhẹ.",
    chiTiet:
      "Thiết kế hệ thống thành phần dùng chung giúp các biên tập viên xuất bản bài phỏng vấn dài với nhịp điệu tạp chí nhất quán trên cả điện thoại 390px và màn hình rộng 1440px.",
    ketQua: [
      "Tất cả ảnh nén WebP dưới 280 KB mỗi ảnh",
      "Điểm bố cục ổn định tuyệt đối (không nhảy dòng khi tải ảnh)",
      "Kiểm thử tự động 5 luồng đọc bài bằng Playwright",
    ],
    kyNang: ["React", "TypeScript", "Playwright"],
    lienKet: "https://github.com",
  },
  {
    id: "du-an-he-thong-token",
    ten: "Bộ khung Đồng bộ Phong cách Atelier",
    nam: "2025",
    vaiTro: "Kỹ sư hệ thống giao diện",
    loaiMinhHoa: "dongbo",
    tomTat:
      "Thư viện thành phần nội bộ gom toàn bộ màu sắc, bo góc, nút bấm và biểu tượng SVG về một nguồn chuẩn.",
    chiTiet:
      "Thay thế hàng loạt mã màu rải rác bằng hệ biến CSS kết hợp kiểm tra TypeScript và Zod, giúp nhóm phát triển giảm một nửa thời gian sửa lỗi lệch tông giữa các trang.",
    ketQua: [
      "100% thành phần dùng chung một hệ màu và nét vẽ 1.75px",
      "Rào chắn ESLint ngăn gọi chéo giữa các tính năng độc lập",
      "Giảm 42% dung lượng CSS sau khi đóng gói Vite",
    ],
    kyNang: ["React", "TypeScript", "SVG Morphing"],
    lienKet: "https://github.com",
  },
  {
    id: "du-an-trien-lam-anh",
    ten: "Không gian lưu trữ Ký ức Đêm Hè",
    nam: "2024",
    vaiTro: "Thiết kế tương tác",
    loaiMinhHoa: "nhiepanh",
    tomTat:
      "Trang trưng bày ảnh phim cá nhân chạy tĩnh trên GitHub Pages, hỗ trợ lọc theo dòng máy và năm chụp.",
    chiTiet:
      "Áp dụng cơ chế ghép đường dẫn tài nguyên động theo BASE_URL để website chạy trơn tru dù đặt ở tên miền gốc hay thư mục con của GitHub Pages.",
    ketQua: [
      "Không phát sinh lỗi 404 khi tải lại trang trên GitHub Pages",
      "Toàn bộ kho ảnh và mã nguồn giữ gọn dưới 18 MB",
      "Kiểm chứng tự động bộ lọc rỗng và luồng mở xem ảnh lớn",
    ],
    kyNang: ["React", "Playwright"],
    lienKet: "https://github.com",
  },
];

/** Đọc danh sách dự án đã kiểm chuẩn Zod. */
export function layDanhSachDuAn(): readonly DuAn[] {
  return kiemTraDanhSachDuAn(DU_LIEU_THO);
}
