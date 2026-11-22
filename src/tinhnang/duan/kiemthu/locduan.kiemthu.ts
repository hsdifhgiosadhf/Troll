import { describe, expect, it } from "vitest";
import { layDanhSachDuAn, TU_KHOA_TAT_CA } from "@/tinhnang/duan/kho/khoduan";
import { locDuAnTheoKyNang, timDuAnTheoMa } from "@/tinhnang/duan/dichvu/locduan";

describe("locDuAnTheoKyNang & timDuAnTheoMa", () => {
  const danhSach = layDanhSachDuAn();

  it("trả về toàn bộ dự án khi chọn Tất cả", () => {
    expect(locDuAnTheoKyNang(danhSach, TU_KHOA_TAT_CA)).toHaveLength(
      danhSach.length,
    );
  });

  it("chỉ giữ các dự án có chứa kỹ năng Playwright", () => {
    const ketQua = locDuAnTheoKyNang(danhSach, "Playwright");
    expect(ketQua.length).toBeGreaterThan(0);
    expect(ketQua.every((duAn) => duAn.kyNang.includes("Playwright"))).toBe(true);
  });

  it("trả về mảng rỗng khi lọc theo kỹ năng chưa có dự án nào", () => {
    expect(locDuAnTheoKyNang(danhSach, "WebGL 3D")).toEqual([]);
  });

  it("tìm đúng dự án theo mã và trả về null khi không khớp", () => {
    const dauTien = danhSach[0];
    expect(dauTien).toBeDefined();
    if (dauTien) {
      expect(timDuAnTheoMa(danhSach, dauTien.id)?.ten).toBe(dauTien.ten);
    }
    expect(timDuAnTheoMa(danhSach, "khong-ton-tai")).toBeNull();
  });
});
