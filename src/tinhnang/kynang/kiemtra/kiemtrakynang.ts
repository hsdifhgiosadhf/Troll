import { z } from "zod";
import type { NhomKyNang } from "@/tinhnang/kynang/kieu/kynang";

const KhuonMucKyNang = z.object({
  id: z.string().min(1),
  ten: z.string().min(1),
  moTa: z.string().min(1),
});

const KhuonNhomKyNang = z.object({
  id: z.enum(["giaodien", "hethong", "kiemthu"]),
  tieuDe: z.string().min(1),
  tomTat: z.string().min(1),
  cacKyNang: z.array(KhuonMucKyNang).min(1),
});

/** Kiểm tra dữ liệu nhóm kỹ năng bằng Zod trước khi hiển thị. */
export function kiemTraDanhSachKyNang(duLieu: unknown): readonly NhomKyNang[] {
  return z.array(KhuonNhomKyNang).min(1).parse(duLieu);
}
