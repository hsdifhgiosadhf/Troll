import { z } from "zod";
import type { DuAn } from "@/tinhnang/duan/kieu/duan";

const KhuonDuAn = z.object({
  id: z.string().min(1),
  ten: z.string().min(1),
  nam: z.string().min(1),
  vaiTro: z.string().min(1),
  loaiMinhHoa: z.enum(["tapchi", "amnhac", "dongbo", "nhiepanh"]),
  tomTat: z.string().min(1),
  chiTiet: z.string().min(1),
  ketQua: z.array(z.string().min(1)).min(1),
  kyNang: z.array(z.string().min(1)).min(1),
  lienKet: z.url(),
});

/** Kiểm tra danh sách dự án bằng Zod trước khi sử dụng. */
export function kiemTraDanhSachDuAn(duLieu: unknown): readonly DuAn[] {
  return z.array(KhuonDuAn).min(1).parse(duLieu);
}
