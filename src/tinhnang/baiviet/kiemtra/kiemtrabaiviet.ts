import { z } from "zod";
import type { BaiVietNgan } from "@/tinhnang/baiviet/kieu/baiviet";

const KhuonBaiViet = z.object({
  id: z.string().min(1),
  chuDe: z.string().min(1),
  ngayDang: z.string().min(1),
  thoiGianDoc: z.string().min(1),
  tieuDe: z.string().min(1),
  tomTat: z.string().min(1),
  noiDung: z.array(z.string().min(1)).min(1),
});

/** Xác thực danh sách bài ghi chú bằng Zod. */
export function kiemTraDanhSachBaiViet(
  duLieu: unknown,
): readonly BaiVietNgan[] {
  return z.array(KhuonBaiViet).min(1).parse(duLieu);
}
