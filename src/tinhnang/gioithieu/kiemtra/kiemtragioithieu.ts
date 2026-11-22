import { z } from "zod";
import type { ThongTinGioiThieu } from "@/tinhnang/gioithieu/kieu/gioithieu";

const KhuonThongKe = z.object({
  id: z.string().min(1),
  giaTri: z.string().min(1),
  nhan: z.string().min(1),
});

export const KhuonGioiThieu = z.object({
  nhanMoDau: z.string().min(1),
  hoTen: z.string().min(1),
  bietDanhNgheThuat: z.string().min(1),
  chucDanh: z.string().min(1),
  loiGioiThieu: z.string().min(1),
  trietLy: z.string().min(1),
  thongKe: z.array(KhuonThongKe).min(1),
});

/** Xác thực cấu trúc dữ liệu giới thiệu trước khi đưa lên giao diện. */
export function kiemTraDuLieuGioiThieu(duLieu: unknown): ThongTinGioiThieu {
  return KhuonGioiThieu.parse(duLieu);
}
