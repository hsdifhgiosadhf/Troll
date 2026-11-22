import { kiemTraDanhSachBaiViet } from "@/tinhnang/baiviet/kiemtra/kiemtrabaiviet";
import type { BaiVietNgan } from "@/tinhnang/baiviet/kieu/baiviet";

const DU_LIEU_THO = [
  {
    id: "bv-dong-bo-phong-cach",
    chuDe: "Đồng bộ phong cách",
    ngayDang: "14/11/2026",
    thoiGianDoc: "3 phút đọc",
    tieuDe: "Một bảng màu, một nét bút: Bí quyết để web cá nhân có dấu ấn riêng",
    tomTat:
      "Vì sao việc gom màu sắc, cỡ chữ và độ dày nét SVG về một nguồn duy nhất giúp trang web sang trọng hơn nhiều thư viện hào nhoáng.",
    noiDung: [
      "Khi nghe một bản thu của Vendredi sur Mer, bạn nhận ra ngay bầu không khí nhất quán từ tiếng synth ấm tới giọng kể thủ thỉ. Một trang web cá nhân cũng cần sự liền mạch như vậy.",
      "Thay vì chọn màu ngẫu nhiên cho từng khối, mọi thành phần trên trang này đều đọc chung bảng màu kem ngà, đỏ nhung rượu vang và xanh đêm biển từ một tệp cấu hình duy nhất.",
    ],
  },
  {
    id: "bv-duoi-100mb",
    chuDe: "Hiệu năng GitHub Pages",
    ngayDang: "02/11/2026",
    thoiGianDoc: "4 phút đọc",
    tieuDe: "Giữ toàn bộ trang web dưới 100 MB bằng SVG và ảnh nén WebP",
    tomTat:
      "Thay video nặng bằng hình vẽ SVG biến hình theo trạng thái giúp trang mở tức thì trên mạng di động và vượt qua giới hạn GitHub Pages.",
    noiDung: [
      "Nhiều hồ sơ thiết kế bị chậm chỉ vì nhúng video hoặc ảnh gốc hàng chục megabyte. Việc thay các khối minh hoạ bằng SVG viết sạch chỉ tốn vài kilobyte mà vẫn sắc nét ở mọi độ phân giải.",
      "Kết hợp kiểm tra dung lượng tự động trước mỗi lần chốt mốc đảm bảo thư mục xuất bản luôn nhẹ nhàng và sẵn sàng đưa lên GitHub Pages.",
    ],
  },
  {
    id: "bv-morphing",
    chuDe: "Chuyển động có cầu nối",
    ngayDang: "20/10/2026",
    thoiGianDoc: "3 phút đọc",
    tieuDe: "Chuyển cảnh có cầu nối thay vì hiệu ứng chớp tắt gây mỏi mắt",
    tomTat:
      "Giữ lại một thành phần chung làm điểm neo khi lọc dự án hay mở chi tiết để người xem luôn biết mình đang ở đâu.",
    noiDung: [
      "Một chuyển động tốt phải giải thích được điều gì đang đổi và tại sao nó đổi. Khi bấm xem chi tiết dự án, sơ đồ và các nhãn kỹ năng vẫn được giữ lại làm sợi dây nối giữa danh sách và khung chi tiết.",
      "Đặc biệt, trang luôn tôn trọng tuỳ chọn prefers-reduced-motion của trình duyệt để bất kỳ ai cũng đọc trọn vẹn nội dung thoải mái.",
    ],
  },
];

/** Đọc danh sách bài chia sẻ của Thành Hoàng. */
export function layDanhSachBaiViet(): readonly BaiVietNgan[] {
  return kiemTraDanhSachBaiViet(DU_LIEU_THO);
}
