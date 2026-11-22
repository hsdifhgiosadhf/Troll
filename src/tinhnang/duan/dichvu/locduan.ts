import { TU_KHOA_TAT_CA } from "@/tinhnang/duan/kho/khoduan";
import type { DuAn } from "@/tinhnang/duan/kieu/duan";

/** Lọc danh sách dự án theo kỹ năng đang chọn (hàm thuần). */
export function locDuAnTheoKyNang(
  danhSach: readonly DuAn[],
  kyNangChon: string,
): readonly DuAn[] {
  if (!kyNangChon || kyNangChon === TU_KHOA_TAT_CA) {
    return danhSach;
  }
  return danhSach.filter((duAn) => duAn.kyNang.includes(kyNangChon));
}

/** Tìm dự án theo mã duy nhất để mở xem chi tiết tại chỗ. */
export function timDuAnTheoMa(
  danhSach: readonly DuAn[],
  maDuAn: string | null,
): DuAn | null {
  if (!maDuAn) return null;
  return danhSach.find((duAn) => duAn.id === maDuAn) ?? null;
}
