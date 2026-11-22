import { z } from "zod";
import type { MocKinhNghiem } from "@/tinhnang/kinhnghiem/kieu/kinhnghiem";

const KhuonMocThoiGian = z.object({
  nam: z.number().int().min(2000).max(2100),
  thang: z.number().int().min(1).max(12),
});

const KhuonMocKinhNghiem = z.object({
  id: z.string().min(1),
  vaiTro: z.string().min(1),
  toChuc: z.string().min(1),
  loai: z.enum(["congviec", "hocvan"]),
  batDau: KhuonMocThoiGian,
  ketThuc: KhuonMocThoiGian.nullable(),
  tomTat: z.string().min(1),
  diemNhan: z.array(z.string().min(1)).min(1),
});

/** Kiểm tra dữ liệu trục kinh nghiệm bằng Zod. */
export function kiemTraDanhSachKinhNghiem(
  duLieu: unknown,
): readonly MocKinhNghiem[] {
  return z.array(KhuonMocKinhNghiem).min(1).parse(duLieu);
}
