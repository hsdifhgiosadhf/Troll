import { kiemTraDuLieuGioiThieu } from "@/tinhnang/gioithieu/kiemtra/kiemtragioithieu";
import type { ThongTinGioiThieu } from "@/tinhnang/gioithieu/kieu/gioithieu";

const DU_LIEU_THO = {
  nhanMoDau: "Hồ sơ cá nhân · Ấn bản phòng thu",
  hoTen: "Thành Hoàng",
  bietDanhNgheThuat: "˚₊‧꒰ა ☆ ໒꒱ ‧₊˚",
  chucDanh: "Coder-Graphic Desgin",
  loiGioiThieu:
    "Tôi xây dựng giao diện web như cách một bản thu đĩa than được gọt giũa: bảng màu có hồn, nhịp chuyển động êm ái và từng dòng chữ đều phục vụ người đọc.",
  trietLy:
    "Lấy cảm hứng từ chất thơ của Vendredi sur Mer – Écoute chérie, tôi kết hợp mỹ cảm tạp chí Pháp cổ điển cùng kỹ thuật React, TypeScript nghiêm ngặt và dung lượng tinh gọn để web chạy mượt trên GitHub Pages.",
  thongKe: [
    { id: "tk-nam", giaTri: "5+ năm", nhan: "Thiết kế giao diện & React" },
    { id: "tk-duan", giaTri: "18+", nhan: "Sản phẩm web đã ra mắt" },
    { id: "tk-nang", giaTri: "< 5 MB", nhan: "Mục tiêu đóng gói tĩnh" },
  ],
};

/** Đọc hồ sơ giới thiệu đã qua kiểm định Zod. */
export function layThongTinGioiThieu(): ThongTinGioiThieu {
  return kiemTraDuLieuGioiThieu(DU_LIEU_THO);
}
