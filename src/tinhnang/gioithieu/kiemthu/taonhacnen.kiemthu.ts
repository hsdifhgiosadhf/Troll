import { describe, expect, it } from "vitest";
import {
  phanTichPhoTanSo,
  taoUrlNhacEcouteCherie,
  TEN_BAN_NHAC_MAC_DINH,
  tinhNhipTheoThoiGian,
} from "@/tinhnang/gioithieu/dichvu/taonhacnen";

describe("taonhacnen & phanTichPhoTanSo", () => {
  it("tạo chuỗi data URL chuẩn WAV 16-bit không rỗng", () => {
    const url = taoUrlNhacEcouteCherie();
    expect(url.startsWith("data:audio/wav;base64,UklGR")).toBe(true);
    expect(TEN_BAN_NHAC_MAC_DINH).toContain("Écoute chérie");
  });

  it("phân tích mảng tần số thành nhịp bass, trung, cao và 16 cột sóng SVG", () => {
    const mau = new Uint8Array(32);
    mau.fill(200, 0, 8);
    mau.fill(120, 8, 20);
    const ketQua = phanTichPhoTanSo(mau, 16);
    expect(ketQua.bass).toBeGreaterThan(0.7);
    expect(ketQua.trung).toBeGreaterThan(0.4);
    expect(ketQua.phoNhac).toHaveLength(16);
  });

  it("tính nhịp điệu 104 BPM mượt mà theo thời gian", () => {
    const nhip = tinhNhipTheoThoiGian(1.25, 16);
    expect(nhip.bass).toBeGreaterThanOrEqual(0);
    expect(nhip.bass).toBeLessThanOrEqual(1);
    expect(nhip.phoNhac).toHaveLength(16);
  });
});
