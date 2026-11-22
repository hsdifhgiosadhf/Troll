import { describe, expect, it } from "vitest";
import {
  bamChuoiDinhDanh,
  capNhatLuotThichTheoIp,
  docTrangThaiDemCucBo,
  dongBoDemLuotTrucTuyen,
  ghiNhanLuotXemTheoIp,
  type KhoLuuTruDonGian,
  TRANG_THAI_DEM_MAC_DINH,
} from "@/tinhnang/gioithieu/dichvu/demluot";

function taoKhoLuuTruGia(): KhoLuuTruDonGian {
  const banDo = new Map<string, string>();
  return {
    getItem(khoa: string): string | null {
      return banDo.get(khoa) ?? null;
    },
    setItem(khoa: string, giaTri: string): void {
      banDo.set(khoa, giaTri);
    },
  };
}

describe("demluot (lưu lượt xem & lượt tim chống spam theo IP máy)", () => {
  it("mỗi mã IP chỉ được tính +1 lượt xem duy nhất dù mở lại trang nhiều lần", () => {
    const khoCucBo = taoKhoLuuTruGia();
    const maIpMay1 = bamChuoiDinhDanh("113.161.72.15");
    const maIpMay2 = bamChuoiDinhDanh("14.232.108.99");

    const lanMoDau = ghiNhanLuotXemTheoIp(khoCucBo, maIpMay1);
    expect(lanMoDau.laLuotXemMoiCuaIp).toBe(true);
    expect(lanMoDau.trangThai.soLuotXem).toBe(
      TRANG_THAI_DEM_MAC_DINH.soLuotXem + 1,
    );

    // Cùng IP đó bấm F5 hoặc tắt trình duyệt mở lại → không cộng trùng lượt xem
    const lanMoLaiCungIp = ghiNhanLuotXemTheoIp(khoCucBo, maIpMay1);
    expect(lanMoLaiCungIp.laLuotXemMoiCuaIp).toBe(false);
    expect(lanMoLaiCungIp.trangThai.soLuotXem).toBe(
      TRANG_THAI_DEM_MAC_DINH.soLuotXem + 1,
    );

    // Một IP khác vào xem → được cộng thêm +1 lượt xem
    const lanMoTuIpKhac = ghiNhanLuotXemTheoIp(khoCucBo, maIpMay2);
    expect(lanMoTuIpKhac.laLuotXemMoiCuaIp).toBe(true);
    expect(lanMoTuIpKhac.trangThai.soLuotXem).toBe(
      TRANG_THAI_DEM_MAC_DINH.soLuotXem + 2,
    );
  });

  it("chống spam bấm tim theo IP: cùng một IP bấm nhiều lần không bao giờ tăng quá +1 tim", () => {
    const khoCucBo = taoKhoLuuTruGia();
    const maIp = bamChuoiDinhDanh("113.161.72.15");
    const banDau = docTrangThaiDemCucBo(khoCucBo);

    // Bấm lần 1: tăng +1 tim và được phép gửi lên máy chủ
    const lan1 = capNhatLuotThichTheoIp(khoCucBo, banDau, maIp);
    expect(lan1.trangThai.daThich).toBe(true);
    expect(lan1.trangThai.soLuotThich).toBe(
      TRANG_THAI_DEM_MAC_DINH.soLuotThich + 1,
    );
    expect(lan1.canCongLenMayChu).toBe(true);

    // Bấm lần 2 (bỏ tim): giảm về mốc gốc, không gửi cộng máy chủ
    const lan2 = capNhatLuotThichTheoIp(khoCucBo, lan1.trangThai, maIp);
    expect(lan2.trangThai.daThich).toBe(false);
    expect(lan2.trangThai.soLuotThich).toBe(TRANG_THAI_DEM_MAC_DINH.soLuotThich);
    expect(lan2.canCongLenMayChu).toBe(false);

    // Bấm lần 3 (bật lại tim): chỉ lên đúng mốc gốc + 1 và chặn gửi cộng trùng lên máy chủ
    const lan3 = capNhatLuotThichTheoIp(khoCucBo, lan2.trangThai, maIp);
    expect(lan3.trangThai.daThich).toBe(true);
    expect(lan3.trangThai.soLuotThich).toBe(
      TRANG_THAI_DEM_MAC_DINH.soLuotThich + 1,
    );
    expect(lan3.canCongLenMayChu).toBe(false);
  });

  it("đồng bộ đám mây có kiểm tra khóa IP để chặn cộng trùng lượt xem khi mở tab ẩn danh", async () => {
    const maIp = bamChuoiDinhDanh("113.161.72.15");
    const cacUrlDaGoi: string[] = [];

    const hamFetchGia: typeof fetch = async (input) => {
      const url = typeof input === "string" ? input : input.toString();
      cacUrlDaGoi.push(url);
      // Giả lập IP này đã từng được ghi nhận trên máy chủ (value = 1)
      if (url.includes(`xem_${maIp}`) || url.includes(`thich_${maIp}`)) {
        return new Response(JSON.stringify({ value: 1 }), { status: 200 });
      }
      const giaTri = url.includes("luotxem") ? 12 : 5;
      return new Response(JSON.stringify({ value: giaTri }), { status: 200 });
    };

    const ketQua = await dongBoDemLuotTrucTuyen(
      TRANG_THAI_DEM_MAC_DINH,
      true,
      maIp,
      hamFetchGia,
    );
    expect(ketQua.soLuotXem).toBe(TRANG_THAI_DEM_MAC_DINH.soLuotXem + 12);
    expect(ketQua.daThich).toBe(true);
    // Đảm bảo không gọi /hit/.../luotxem khi IP đã tồn tại trên máy chủ
    expect(cacUrlDaGoi.some((u) => u.includes("/hit/") && u.includes("luotxem"))).toBe(
      false,
    );
  });
});
