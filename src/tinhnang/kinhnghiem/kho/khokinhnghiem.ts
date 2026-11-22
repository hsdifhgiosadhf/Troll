import { kiemTraDanhSachKinhNghiem } from "@/tinhnang/kinhnghiem/kiemtra/kiemtrakinhnghiem";
import type { MocKinhNghiem } from "@/tinhnang/kinhnghiem/kieu/kinhnghiem";

const DU_LIEU_THO = [
  {
    id: "kn-2025-studio",
    vaiTro: "Trưởng nhóm Thiết kế Giao diện & Frontend",
    toChuc: "Xưởng Sản phẩm Số Độc lập",
    loai: "congviec",
    batDau: { nam: 2024, thang: 6 },
    ketThuc: null,
    tomTat:
      "Định hướng thẩm mỹ đồng bộ, xây dựng hệ thống token thiết kế và triển khai các trang web React gọn nhẹ dưới 100 MB.",
    diemNhan: [
      "Chuẩn hoá bộ khung dùng chung giữa thiết kế SVG và mã React",
      "Áp dụng quy trình kiểm thử đầu-cuối Playwright trên mọi bản dựng",
    ],
  },
  {
    id: "kn-2022-frontend",
    vaiTro: "Kỹ sư Giao diện (Frontend Developer)",
    toChuc: "Công ty Công nghệ Sáng tạo Bờ Biển",
    loai: "congviec",
    batDau: { nam: 2022, thang: 3 },
    ketThuc: { nam: 2024, thang: 5 },
    tomTat:
      "Phát triển trang giới thiệu sản phẩm, tối ưu tốc độ tải trang di động và chuyển động mượt trên CSS/SVG.",
    diemNhan: [
      "Cắt giảm 55% dung lượng ảnh tĩnh bằng chuẩn WebP/AVIF",
      "Xây dựng các chuyển cảnh có cầu nối và hỗ trợ giảm chuyển động",
    ],
  },
  {
    id: "kn-2021-thuctap",
    vaiTro: "Thiết kế Tương tác & Dựng giao diện",
    toChuc: "Nhóm Biên tập Số Tạp chí Trẻ",
    loai: "congviec",
    batDau: { nam: 2021, thang: 1 },
    ketThuc: { nam: 2022, thang: 2 },
    tomTat:
      "Chuyển thể bố cục tạp chí in sang giao diện web đáp ứng tốt trên điện thoại và máy tính.",
    diemNhan: [
      "Hoàn thiện hệ thống kiểu chữ tiếng Việt dễ đọc cho bài viết dài",
      "Tạo bộ biểu tượng SVG thống nhất độ dày nét",
    ],
  },
  {
    id: "hv-2017-daihoc",
    vaiTro: "Cử nhân Công nghệ Thông tin & Thiết kế Đồ hoạ",
    toChuc: "Đại học Bách khoa",
    loai: "hocvan",
    batDau: { nam: 2017, thang: 9 },
    ketThuc: { nam: 2021, thang: 6 },
    tomTat:
      "Nền tảng thuật toán, cấu trúc dữ liệu, tương tác người–máy và nguyên lý tạo hình thị giác.",
    diemNhan: [
      "Đồ án tốt nghiệp về trực quan hoá dữ liệu tương tác trên trình duyệt",
    ],
  },
];

/** Đọc trục thời gian kinh nghiệm và học vấn của Thành Hoàng. */
export function layDanhSachKinhNghiem(): readonly MocKinhNghiem[] {
  return kiemTraDanhSachKinhNghiem(DU_LIEU_THO);
}
