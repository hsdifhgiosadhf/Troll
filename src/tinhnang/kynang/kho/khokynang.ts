import { kiemTraDanhSachKyNang } from "@/tinhnang/kynang/kiemtra/kiemtrakynang";
import type { NhomKyNang } from "@/tinhnang/kynang/kieu/kynang";

const DU_LIEU_THO = [
  {
    id: "giaodien",
    tieuDe: "Mỹ cảm & Giao diện",
    tomTat:
      "Xây dựng ngôn ngữ thị giác đồng nhất từ màu sắc, kiểu chữ tiếng Việt tới hình vẽ SVG nhẹ.",
    cacKyNang: [
      {
        id: "kn-svg",
        ten: "SVG Morphing",
        moTa: "Biến đổi đường cong và điểm neo mượt mà, không cần thư viện nặng.",
      },
      {
        id: "kn-he-mau",
        ten: "Hệ token thiết kế",
        moTa: "Đồng bộ bảng màu, bo góc và thời lượng chuyển động từ một nguồn.",
      },
      {
        id: "kn-css",
        ten: "Tailwind CSS",
        moTa: "Bố cục đáp ứng mượt từ điện thoại 390px tới màn hình 1440px.",
      },
    ],
  },
  {
    id: "hethong",
    tieuDe: "Kiến trúc React & Mã sạch",
    tomTat:
      "Tách lớp rõ ràng giữa giao diện, dịch vụ xử lý thuần và kho dữ liệu đã kiểm kiểu.",
    cacKyNang: [
      {
        id: "kn-react",
        ten: "React",
        moTa: "Component gọn nhẹ, tách trạng thái rõ ràng và giữ hiệu năng hiển thị.",
      },
      {
        id: "kn-ts",
        ten: "TypeScript",
        moTa: "Kiểm kiểu chặt chẽ ngay khi viết mã, kết hợp Zod xác thực khi chạy.",
      },
      {
        id: "kn-vite",
        ten: "Vite & GitHub Pages",
        moTa: "Đóng gói tĩnh gọn nhẹ dưới 5 MB, tự động ghép đường dẫn con.",
      },
    ],
  },
  {
    id: "kiemthu",
    tieuDe: "Kiểm thử & Độ tin cậy",
    tomTat:
      "Chứng minh mọi tương tác chạy đúng trên trình duyệt thật và tôn trọng người dùng.",
    cacKyNang: [
      {
        id: "kn-vitest",
        ten: "Vitest",
        moTa: "Kiểm tra tự động các hàm lọc, tính thời gian và xác thực dữ liệu.",
      },
      {
        id: "kn-playwright",
        ten: "Playwright",
        moTa: "Kiểm thử luồng bấm thật trên 390px, 1440px và chế độ giảm chuyển động.",
      },
      {
        id: "kn-a11y",
        ten: "Khả năng tiếp cận",
        moTa: "Hỗ trợ điều hướng bàn phím, đọc màn hình và prefers-reduced-motion.",
      },
    ],
  },
];

/** Lấy danh sách các nhóm kỹ năng đã xác thực. */
export function layDanhSachKyNang(): readonly NhomKyNang[] {
  return kiemTraDanhSachKyNang(DU_LIEU_THO);
}
