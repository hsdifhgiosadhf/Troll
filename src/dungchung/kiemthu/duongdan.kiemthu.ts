import { describe, expect, it } from "vitest";
import { duongDanTaiNguyen, laLienKetNgoaiAnToan } from "@/dungchung/duongdan";

describe("duongDanTaiNguyen & laLienKetNgoaiAnToan", () => {
  it("ghép đúng đường dẫn khi chạy ở gốc tên miền", () => {
    expect(duongDanTaiNguyen("/tailieu/cv-thanh-hoang.pdf", "/")).toBe(
      "/tailieu/cv-thanh-hoang.pdf",
    );
  });

  it("ghép đúng đường dẫn con GitHub Pages cho ảnh và file CV", () => {
    expect(duongDanTaiNguyen("tailieu/cv-thanh-hoang.pdf", "/webbanthan/")).toBe(
      "/webbanthan/tailieu/cv-thanh-hoang.pdf",
    );
    expect(duongDanTaiNguyen("/anh/bia.webp", "/webbanthan")).toBe(
      "/webbanthan/anh/bia.webp",
    );
  });

  it("giữ đúng tiền tố tương đối khi BASE_URL là ./", () => {
    expect(duongDanTaiNguyen("/tailieu/cv-thanh-hoang.pdf", "./")).toBe(
      "./tailieu/cv-thanh-hoang.pdf",
    );
  });

  it("chỉ chấp nhận liên kết https, http, mailto và từ chối javascript:", () => {
    expect(laLienKetNgoaiAnToan("https://github.com/thanhhoang")).toBe(true);
    expect(laLienKetNgoaiAnToan("mailto:thanhhoang@example.com")).toBe(true);
    expect(laLienKetNgoaiAnToan("javascript:alert(1)")).toBe(false);
  });
});
