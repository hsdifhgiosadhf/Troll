import {
  NHIP_AM_THANH_TINH,
  type NhipAmThanh,
} from "@/dungchung/minhhoa/MinhHoaDiaThan";

export { NHIP_AM_THANH_TINH, type NhipAmThanh };

export const TEN_BAN_NHAC_MAC_DINH = "Vendredi sur Mer — Écoute chérie";

const SO_COT_PHO_MAC_DINH = 16;

/**
 * Lấy đường dẫn file nhạc thật Vendredi-sur-Mer-Écoute-chérie_009_vbr.mp3
 * mà người dùng đặt ở thư mục gốc dự án (Vite tự đóng gói sang dist/assets/).
 */
export function layDuongDanNhacChinh(): string {
  return new URL(
    "../../../../Vendredi-sur-Mer-Écoute-chérie_009_vbr.mp3",
    import.meta.url,
  ).href;
}

/**
 * Chuyển mảng tần số (0..255) từ Web Audio API AnalyserNode thành thông số nhịp 0..1
 * để điều khiển hình vẽ SVG co giãn theo đúng tiếng trống bass và giọng hát.
 */
export function phanTichPhoTanSo(
  duLieuTanSo: Uint8Array,
  soCot: number = SO_COT_PHO_MAC_DINH,
): NhipAmThanh {
  if (duLieuTanSo.length === 0) {
    return NHIP_AM_THANH_TINH;
  }

  const trungBinhDoan = (batDau: number, ketThuc: number): number => {
    const gioiHanDau = Math.max(0, Math.min(duLieuTanSo.length - 1, batDau));
    const gioiHanCuoi = Math.max(
      gioiHanDau + 1,
      Math.min(duLieuTanSo.length, ketThuc),
    );
    let tong = 0;
    for (let i = gioiHanDau; i < gioiHanCuoi; i += 1) {
      tong += duLieuTanSo[i] ?? 0;
    }
    return Number((tong / ((gioiHanCuoi - gioiHanDau) * 255)).toFixed(3));
  };

  const bass = trungBinhDoan(0, 5);
  const trung = trungBinhDoan(5, 14);
  const cao = trungBinhDoan(14, Math.min(32, duLieuTanSo.length));

  const phoNhac: number[] = [];
  const buoc = Math.max(1, Math.floor(duLieuTanSo.length / (soCot * 1.5)));
  for (let cot = 0; cot < soCot; cot += 1) {
    const viTri = Math.min(duLieuTanSo.length - 1, cot * buoc);
    const giaTri = (duLieuTanSo[viTri] ?? 0) / 255;
    phoNhac.push(Number(Math.max(0.12, giaTri).toFixed(3)));
  }

  return { bass, trung, cao, phoNhac };
}

/**
 * Tạo nhịp điệu dự phòng theo đúng tốc độ ~104 BPM của bài Écoute chérie
 * khi trình duyệt đang chạy trong môi trường kiểm thử không có thiết bị giải mã âm thanh.
 */
export function tinhNhipTheoThoiGian(
  thoiGianGiay: number,
  soCot: number = SO_COT_PHO_MAC_DINH,
): NhipAmThanh {
  const phaNhip = thoiGianGiay * (104 / 60) * Math.PI * 2;
  const bass = Number((0.45 + 0.42 * Math.pow(Math.max(0, Math.sin(phaNhip)), 2)).toFixed(3));
  const trung = Number((0.38 + 0.35 * Math.abs(Math.sin(phaNhip * 0.5 + 0.8))).toFixed(3));
  const cao = Number((0.28 + 0.3 * Math.abs(Math.cos(phaNhip * 1.5))).toFixed(3));

  const phoNhac = Array.from({ length: soCot }, (_, i) => {
    const song =
      0.22 +
      0.45 * Math.abs(Math.sin(phaNhip + i * 0.45)) +
      0.25 * Math.abs(Math.cos(phaNhip * 0.5 - i * 0.3));
    return Number(Math.min(1, song).toFixed(3));
  });

  return { bass, trung, cao, phoNhac };
}

const TAN_SO_LAY_MAU = 11025;
const SO_GIAY_VONG_LAP = 4;

function maHoaBase64(duLieu: Uint8Array): string {
  const BANG_CHU =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let ketQua = "";
  const doDai = duLieu.length;

  for (let i = 0; i < doDai; i += 3) {
    const b0 = duLieu[i] ?? 0;
    const b1 = i + 1 < doDai ? (duLieu[i + 1] ?? 0) : 0;
    const b2 = i + 2 < doDai ? (duLieu[i + 2] ?? 0) : 0;

    const cum = (b0 << 16) | (b1 << 8) | b2;
    ketQua += BANG_CHU[(cum >> 18) & 63] ?? "";
    ketQua += BANG_CHU[(cum >> 12) & 63] ?? "";
    ketQua += i + 1 < doDai ? (BANG_CHU[(cum >> 6) & 63] ?? "") : "=";
    ketQua += i + 2 < doDai ? (BANG_CHU[cum & 63] ?? "") : "=";
  }
  return ketQua;
}

/** Luồng WAV dự phòng khi không nạp được file MP3 ngoài. */
export function taoUrlNhacEcouteCherie(): string {
  const soMau = TAN_SO_LAY_MAU * SO_GIAY_VONG_LAP;
  const kichThuocDuLieu = soMau * 2;
  const boDem = new ArrayBuffer(44 + kichThuocDuLieu);
  const khung = new DataView(boDem);

  const ghiChuoi = (viTri: number, chuoi: string): void => {
    for (let i = 0; i < chuoi.length; i += 1) {
      khung.setUint8(viTri + i, chuoi.charCodeAt(i));
    }
  };

  ghiChuoi(0, "RIFF");
  khung.setUint32(4, 36 + kichThuocDuLieu, true);
  ghiChuoi(8, "WAVE");
  ghiChuoi(12, "fmt ");
  khung.setUint32(16, 16, true);
  khung.setUint16(20, 1, true);
  khung.setUint16(22, 1, true);
  khung.setUint32(24, TAN_SO_LAY_MAU, true);
  khung.setUint32(28, TAN_SO_LAY_MAU * 2, true);
  khung.setUint16(32, 2, true);
  khung.setUint16(34, 16, true);
  ghiChuoi(36, "data");
  khung.setUint32(40, kichThuocDuLieu, true);

  const haiPi = Math.PI * 2;
  for (let i = 0; i < soMau; i += 1) {
    const t = i / TAN_SO_LAY_MAU;
    const tinHieu = Math.sin(haiPi * 220 * t) * 0.25 + Math.sin(haiPi * 329.63 * t) * 0.15;
    khung.setInt16(44 + i * 2, Math.round(tinHieu * 12000), true);
  }

  return `data:audio/wav;base64,${maHoaBase64(new Uint8Array(boDem))}`;
}
