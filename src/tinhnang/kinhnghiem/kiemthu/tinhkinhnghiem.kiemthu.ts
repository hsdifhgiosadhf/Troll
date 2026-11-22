import { describe, expect, it } from "vitest";
import {
  dinhDangKhoangMoc,
  dinhDangThoiLuong,
  tinhSoThang,
  tinhTongThangCongViec,
} from "@/tinhnang/kinhnghiem/dichvu/tinhkinhnghiem";
import { layDanhSachKinhNghiem } from "@/tinhnang/kinhnghiem/kho/khokinhnghiem";

describe("tinhkinhnghiem", () => {
  it("tính đúng số tháng giữa hai mốc thời gian", () => {
    expect(tinhSoThang({ nam: 2022, thang: 3 }, { nam: 2024, thang: 5 })).toBe(27);
    expect(
      tinhSoThang({ nam: 2025, thang: 1 }, null, { nam: 2025, thang: 6 }),
    ).toBe(6);
  });

  it("đổi số tháng thành chuỗi tiếng Việt có năm và tháng", () => {
    expect(dinhDangThoiLuong(27)).toBe("2 năm 3 tháng");
    expect(dinhDangThoiLuong(24)).toBe("2 năm");
    expect(dinhDangThoiLuong(8)).toBe("8 tháng");
  });

  it("định dạng đúng mốc hiện tại khi chưa có ngày kết thúc", () => {
    expect(dinhDangKhoangMoc({ nam: 2024, thang: 6 }, null)).toBe(
      "06/2024 — Hiện tại",
    );
  });

  it("chỉ cộng các chặng công việc, bỏ qua chặng học vấn", () => {
    const danhSach = layDanhSachKinhNghiem();
    const tong = tinhTongThangCongViec(danhSach, { nam: 2026, thang: 11 });
    expect(tong).toBe(71);
  });
});
