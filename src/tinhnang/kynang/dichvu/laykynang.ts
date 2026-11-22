import type { CheDoMinhHoaKyNang } from "@/dungchung/minhhoa/MinhHoaNhanhKyNang";
import type { NhomKyNang } from "@/tinhnang/kynang/kieu/kynang";

/** Tìm nhóm kỹ năng đang chọn, luôn có nhóm đầu tiên làm phương án an toàn. */
export function chonNhomKyNangHienTai(
  danhSach: readonly NhomKyNang[],
  maDangChon: CheDoMinhHoaKyNang,
): NhomKyNang | null {
  return danhSach.find((nhom) => nhom.id === maDangChon) ?? danhSach[0] ?? null;
}
