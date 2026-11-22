import type { MocKinhNghiem, MocThoiGian } from "@/tinhnang/kinhnghiem/kieu/kinhnghiem";

const MOC_HIEN_TAI_MAC_DINH: MocThoiGian = { nam: 2026, thang: 11 };

/** Tính số tháng giữa hai mốc thời gian (tính cả tháng bắt đầu). */
export function tinhSoThang(
  batDau: MocThoiGian,
  ketThuc: MocThoiGian | null,
  mocHienTai: MocThoiGian = MOC_HIEN_TAI_MAC_DINH,
): number {
  const dich = ketThuc ?? mocHienTai;
  const tongThang = (dich.nam - batDau.nam) * 12 + (dich.thang - batDau.thang) + 1;
  return Math.max(1, tongThang);
}

/** Đổi số tháng sang chuỗi tiếng Việt dễ đọc. */
export function dinhDangThoiLuong(soThang: number): string {
  const soSach = Math.max(1, Math.floor(soThang));
  const nam = Math.floor(soSach / 12);
  const thang = soSach % 12;
  if (nam > 0 && thang > 0) return `${nam} năm ${thang} tháng`;
  if (nam > 0) return `${nam} năm`;
  return `${thang} tháng`;
}

/** Định dạng khoảng thời gian hiển thị trên trục kinh nghiệm. */
export function dinhDangKhoangMoc(
  batDau: MocThoiGian,
  ketThuc: MocThoiGian | null,
): string {
  const chuoiBatDau = `${String(batDau.thang).padStart(2, "0")}/${batDau.nam}`;
  const chuoiKetThuc = ketThuc
    ? `${String(ketThuc.thang).padStart(2, "0")}/${ketThuc.nam}`
    : "Hiện tại";
  return `${chuoiBatDau} — ${chuoiKetThuc}`;
}

/** Tính tổng số tháng làm việc thực tế (không cộng phần học vấn). */
export function tinhTongThangCongViec(
  danhSach: readonly MocKinhNghiem[],
  mocHienTai: MocThoiGian = MOC_HIEN_TAI_MAC_DINH,
): number {
  return danhSach
    .filter((muc) => muc.loai === "congviec")
    .reduce(
      (tong, muc) => tong + tinhSoThang(muc.batDau, muc.ketThuc, mocHienTai),
      0,
    );
}
