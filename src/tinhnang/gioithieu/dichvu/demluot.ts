import { z } from "zod";
import type { KetQua } from "@/dungchung/kieu/ketqua";

export interface TrangThaiDemLuot {
  readonly soLuotThich: number;
  readonly soLuotXem: number;
  readonly daThich: boolean;
  readonly soLuotThichNhoGoc: number;
  readonly maIpDaXem: readonly string[];
  readonly maIpDaThich: readonly string[];
}

const KhuonTrangThaiDemLuot = z.object({
  soLuotThich: z.number().int().min(0),
  soLuotXem: z.number().int().min(0),
  daThich: z.boolean(),
  soLuotThichNhoGoc: z.number().int().min(0),
  maIpDaXem: z.array(z.string().min(1)),
  maIpDaThich: z.array(z.string().min(1)),
});

const KhuonPhanHoiDemTrucTuyen = z.object({
  value: z.number().int().min(0),
});

const KhuonPhanHoiIp = z.object({
  ip: z.string().min(3),
});

export const KHOA_LUU_DEM_LUOT = "thanhhoang_ho_so_dem_luot_v2";
export const KHOA_MA_IP_MAY = "thanhhoang_ma_ip_may_v1";

export const TRANG_THAI_DEM_MAC_DINH: TrangThaiDemLuot = {
  soLuotThich: 4,
  soLuotXem: 53,
  daThich: false,
  soLuotThichNhoGoc: 4,
  maIpDaXem: [],
  maIpDaThich: [],
};

const DIA_CHI_API_DEM = "https://abacus.jasoncameron.dev";
const DIA_CHI_API_IP = "https://api.ipify.org?format=json";
const TEN_NHOM_DEM = "thanhhoang-ecoute-cherie-ghpages";
const THOI_GIAN_CHO_MANG_MS = 2200;

export interface KhoLuuTruDonGian {
  getItem(khoa: string): string | null;
  setItem(khoa: string, giaTri: string): void;
}

/**
 * Băm chuỗi IP hoặc dấu vân tay thiết bị thành mã khoá ngắn `ip_xxxxxxxx` (chuẩn FNV-1a 32-bit)
 * để nhận diện chính xác từng máy mà không lưu địa chỉ IP thô.
 */
export function bamChuoiDinhDanh(chuoi: string): string {
  const chuoiChuan = chuoi.trim().toLowerCase() || "khach-mac-dinh";
  let maBam = 0x811c9dc5;
  for (let i = 0; i < chuoiChuan.length; i += 1) {
    maBam ^= chuoiChuan.charCodeAt(i);
    maBam = Math.imul(maBam, 0x01000193);
  }
  const chuoiHex = (maBam >>> 0).toString(16).padStart(8, "0");
  return `ip_${chuoiHex}`;
}

/**
 * Lấy mã định danh theo IP mạng của máy khách (kết hợp bộ nhớ đệm localStorage và dấu vân tay dự phòng).
 */
export async function layMaDinhDanhIpMay(
  khoCucBo: KhoLuuTruDonGian | null,
  dauVanTayDuPhong: string = "trinh-duyet-cuc-bo",
  hamFetch: typeof fetch = fetch,
): Promise<string> {
  const maDuPhong = bamChuoiDinhDanh(dauVanTayDuPhong);
  const maDaLuu = khoCucBo?.getItem(KHOA_MA_IP_MAY);

  const boHuy = new AbortController();
  const dinhThoi = setTimeout(() => {
    boHuy.abort();
  }, THOI_GIAN_CHO_MANG_MS);

  try {
    const phanHoi = await hamFetch(DIA_CHI_API_IP, {
      method: "GET",
      signal: boHuy.signal,
      headers: { Accept: "application/json" },
    });

    if (phanHoi.ok) {
      const duLieu: unknown = await phanHoi.json();
      const ketQuaIp = KhuonPhanHoiIp.safeParse(duLieu);
      if (ketQuaIp.success) {
        const maIp = bamChuoiDinhDanh(ketQuaIp.data.ip);
        khoCucBo?.setItem(KHOA_MA_IP_MAY, maIp);
        return maIp;
      }
    }
  } catch (loi: unknown) {
    void loi;
  } finally {
    clearTimeout(dinhThoi);
  }

  if (maDaLuu && maDaLuu.startsWith("ip_")) {
    return maDaLuu;
  }
  khoCucBo?.setItem(KHOA_MA_IP_MAY, maDuPhong);
  return maDuPhong;
}

/**
 * Đọc trạng thái lượt tim và lượt xem đã lưu trong trình duyệt, kiểm định bằng Zod.
 */
export function docTrangThaiDemCucBo(
  khoCucBo: KhoLuuTruDonGian | null,
): TrangThaiDemLuot {
  if (!khoCucBo) {
    return TRANG_THAI_DEM_MAC_DINH;
  }

  try {
    const chuoiLuu = khoCucBo.getItem(KHOA_LUU_DEM_LUOT);
    if (!chuoiLuu) {
      return TRANG_THAI_DEM_MAC_DINH;
    }
    const duLieuTho: unknown = JSON.parse(chuoiLuu);
    const ketQuaKiem = KhuonTrangThaiDemLuot.safeParse(duLieuTho);
    if (!ketQuaKiem.success) {
      return TRANG_THAI_DEM_MAC_DINH;
    }
    return ketQuaKiem.data;
  } catch (loi: unknown) {
    void loi;
    return TRANG_THAI_DEM_MAC_DINH;
  }
}

/**
 * Lưu trạng thái lượt tim và lượt xem vào trình duyệt.
 */
export function luuTrangThaiDemCucBo(
  khoCucBo: KhoLuuTruDonGian | null,
  trangThai: TrangThaiDemLuot,
): void {
  if (!khoCucBo) return;
  try {
    const duLieuHopLe = KhuonTrangThaiDemLuot.parse(trangThai);
    khoCucBo.setItem(KHOA_LUU_DEM_LUOT, JSON.stringify(duLieuHopLe));
  } catch (loi: unknown) {
    void loi;
  }
}

/**
 * Ghi nhận lượt xem theo mã IP máy: mỗi mã IP chỉ được tính +1 lượt xem duy nhất
 * (dù bấm F5, tắt trình duyệt mở lại hay spam tải trang cũng không tăng thêm).
 */
export function ghiNhanLuotXemTheoIp(
  khoCucBo: KhoLuuTruDonGian | null,
  maIp: string,
): { readonly trangThai: TrangThaiDemLuot; readonly laLuotXemMoiCuaIp: boolean } {
  const hienTai = docTrangThaiDemCucBo(khoCucBo);
  const maIpHopLe = maIp.trim() || "ip_mac_dinh";

  if (hienTai.maIpDaXem.includes(maIpHopLe)) {
    return { trangThai: hienTai, laLuotXemMoiCuaIp: false };
  }

  const capNhat: TrangThaiDemLuot = {
    ...hienTai,
    soLuotXem: hienTai.soLuotXem + 1,
    maIpDaXem: [...hienTai.maIpDaXem, maIpHopLe],
  };
  luuTrangThaiDemCucBo(khoCucBo, capNhat);
  return { trangThai: capNhat, laLuotXemMoiCuaIp: true };
}

/**
 * Chống spam thả tim theo mã IP máy:
 * Mỗi mã IP chỉ được cộng tối đa +1 tim so với mốc gốc (bấm lại lần nữa chỉ thu hồi đúng 1 tim của IP đó,
 * tuyệt đối không thể bấm nháy để cộng dồn 2, 3, 4 tim từ cùng một IP).
 */
export function capNhatLuotThichTheoIp(
  khoCucBo: KhoLuuTruDonGian | null,
  hienTai: TrangThaiDemLuot,
  maIp: string,
): {
  readonly trangThai: TrangThaiDemLuot;
  readonly canCongLenMayChu: boolean;
} {
  const maIpHopLe = maIp.trim() || "ip_mac_dinh";
  const ipDaTungThich = hienTai.maIpDaThich.includes(maIpHopLe);
  const daThichMoi = !hienTai.daThich;

  // Mỗi IP chỉ được lệch tối đa +1 so với mốc gốc trước khi IP đó bấm tim
  const soLuotThichMoi = daThichMoi
    ? hienTai.soLuotThichNhoGoc + 1
    : hienTai.soLuotThichNhoGoc;

  const danhSachIpMoi = ipDaTungThich
    ? hienTai.maIpDaThich
    : [...hienTai.maIpDaThich, maIpHopLe];

  const trangThaiMoi: TrangThaiDemLuot = {
    ...hienTai,
    daThich: daThichMoi,
    soLuotThich: soLuotThichMoi,
    maIpDaThich: danhSachIpMoi,
  };
  luuTrangThaiDemCucBo(khoCucBo, trangThaiMoi);

  return {
    trangThai: trangThaiMoi,
    canCongLenMayChu: daThichMoi && !ipDaTungThich,
  };
}

/**
 * Gọi một điểm cuối của bộ đếm đám mây kèm AbortController chống treo mạng.
 */
async function goiDiemCuoiDem(
  duongDan: string,
  hamFetch: typeof fetch,
): Promise<KetQua<number>> {
  const boHuy = new AbortController();
  const dinhThoi = setTimeout(() => {
    boHuy.abort();
  }, THOI_GIAN_CHO_MANG_MS);

  try {
    const phanHoi = await hamFetch(`${DIA_CHI_API_DEM}${duongDan}`, {
      method: "GET",
      signal: boHuy.signal,
      headers: { Accept: "application/json" },
    });

    if (!phanHoi.ok) {
      return {
        thanhcong: false,
        dulieu: null,
        thongbao: "Dịch vụ đếm trực tuyến tạm bận.",
        ma: "LOI_MANG_DEM",
      };
    }

    const duLieuJson: unknown = await phanHoi.json();
    const ketQuaKiem = KhuonPhanHoiDemTrucTuyen.safeParse(duLieuJson);
    if (!ketQuaKiem.success) {
      return {
        thanhcong: false,
        dulieu: null,
        thongbao: "Phản hồi bộ đếm không khớp khuôn.",
        ma: "LOI_KHUON_DEM",
      };
    }

    return {
      thanhcong: true,
      dulieu: ketQuaKiem.data.value,
      thongbao: "Đồng bộ số đếm thành công.",
    };
  } catch (loi: unknown) {
    void loi;
    return {
      thanhcong: false,
      dulieu: null,
      thongbao: "Không thể kết nối bộ đếm trực tuyến, dùng bộ nhớ trình duyệt.",
      ma: "LOI_KET_NOI_DEM",
    };
  } finally {
    clearTimeout(dinhThoi);
  }
}

/**
 * Đồng bộ số lượt xem và lượt tim theo mã IP với bộ đếm đám mây công khai (trên GitHub Pages).
 * Kiểm tra khoá `xem_<maIp>` và `thich_<maIp>` trên đám mây để dù người dùng mở tab ẩn danh
 * hoặc xoá localStorage trên cùng IP cũng không cộng trùng lượt xem hay lượt tim.
 */
export async function dongBoDemLuotTrucTuyen(
  hienTai: TrangThaiDemLuot,
  laLuotXemMoiCuaIp: boolean,
  maIp: string = "ip_mac_dinh",
  hamFetch: typeof fetch = fetch,
): Promise<TrangThaiDemLuot> {
  const [kiemTraIpXem, kiemTraIpThich] = await Promise.all([
    goiDiemCuoiDem(`/get/${TEN_NHOM_DEM}/xem_${maIp}`, hamFetch),
    goiDiemCuoiDem(`/get/${TEN_NHOM_DEM}/thich_${maIp}`, hamFetch),
  ]);

  const ipDaXemTrenMayChu =
    kiemTraIpXem.thanhcong && kiemTraIpXem.dulieu > 0;
  const ipDaThichTrenMayChu =
    kiemTraIpThich.thanhcong && kiemTraIpThich.dulieu > 0;

  // Chỉ cộng +1 lượt xem lên đám mây nếu IP này chưa từng được ghi nhận trên đám mây
  const choPhepCongXem = laLuotXemMoiCuaIp && !ipDaXemTrenMayChu;
  if (choPhepCongXem) {
    await goiDiemCuoiDem(`/hit/${TEN_NHOM_DEM}/xem_${maIp}`, hamFetch);
  }

  const duongDanXem = choPhepCongXem
    ? `/hit/${TEN_NHOM_DEM}/luotxem`
    : `/get/${TEN_NHOM_DEM}/luotxem`;
  const duongDanThich = `/get/${TEN_NHOM_DEM}/luotthich`;

  const [ketQuaXem, ketQuaThich] = await Promise.all([
    goiDiemCuoiDem(duongDanXem, hamFetch),
    goiDiemCuoiDem(duongDanThich, hamFetch),
  ]);

  const soXemTuMayChu = ketQuaXem.thanhcong
    ? TRANG_THAI_DEM_MAC_DINH.soLuotXem + ketQuaXem.dulieu
    : hienTai.soLuotXem;

  const soThichTuMayChu = ketQuaThich.thanhcong
    ? TRANG_THAI_DEM_MAC_DINH.soLuotThich + ketQuaThich.dulieu
    : hienTai.soLuotThich;

  const daThichHopNhat = hienTai.daThich || ipDaThichTrenMayChu;
  const soLuotThichCuoi = Math.max(hienTai.soLuotThich, soThichTuMayChu);
  const soLuotThichNhoGoc = daThichHopNhat
    ? Math.max(TRANG_THAI_DEM_MAC_DINH.soLuotThich, soLuotThichCuoi - 1)
    : soLuotThichCuoi;

  const maIpDaXemMoi = hienTai.maIpDaXem.includes(maIp)
    ? hienTai.maIpDaXem
    : [...hienTai.maIpDaXem, maIp];
  const maIpDaThichMoi =
    ipDaThichTrenMayChu && !hienTai.maIpDaThich.includes(maIp)
      ? [...hienTai.maIpDaThich, maIp]
      : hienTai.maIpDaThich;

  return {
    ...hienTai,
    daThich: daThichHopNhat,
    soLuotXem: Math.max(hienTai.soLuotXem, soXemTuMayChu),
    soLuotThich: soLuotThichCuoi,
    soLuotThichNhoGoc,
    maIpDaXem: maIpDaXemMoi,
    maIpDaThich: maIpDaThichMoi,
  };
}

/**
 * Gửi tín hiệu cộng +1 lượt tim lên bộ đếm đám mây kèm khóa `thich_<maIp>` chống spam theo IP.
 */
export async function guiLuotThichLenTrucTuyen(
  hienTai: TrangThaiDemLuot,
  maIp: string = "ip_mac_dinh",
  hamFetch: typeof fetch = fetch,
): Promise<TrangThaiDemLuot> {
  const kiemTraIpThich = await goiDiemCuoiDem(
    `/get/${TEN_NHOM_DEM}/thich_${maIp}`,
    hamFetch,
  );
  if (kiemTraIpThich.thanhcong && kiemTraIpThich.dulieu > 0) {
    // IP này đã từng cộng tim trên máy chủ rồi → chặn spam cộng thêm
    return hienTai;
  }

  await goiDiemCuoiDem(`/hit/${TEN_NHOM_DEM}/thich_${maIp}`, hamFetch);
  const ketQua = await goiDiemCuoiDem(
    `/hit/${TEN_NHOM_DEM}/luotthich`,
    hamFetch,
  );
  if (!ketQua.thanhcong) {
    return hienTai;
  }

  const soThichTuMayChu = TRANG_THAI_DEM_MAC_DINH.soLuotThich + ketQua.dulieu;
  const soLuotThichCuoi = Math.max(hienTai.soLuotThich, soThichTuMayChu);
  return {
    ...hienTai,
    soLuotThich: soLuotThichCuoi,
    soLuotThichNhoGoc: Math.max(
      TRANG_THAI_DEM_MAC_DINH.soLuotThich,
      soLuotThichCuoi - 1,
    ),
  };
}
