import { describe, expect, it } from "vitest";
import {
  taoLienKetMailto,
  xuLyChuanBiThu,
} from "@/tinhnang/lienhe/dichvu/taothulienhe";

describe("kiemtralienhe & taothulienhe", () => {
  it("báo lỗi tiếng Việt rõ ràng khi thiếu tên, sai email và lời nhắn quá ngắn", () => {
    const ketQua = xuLyChuanBiThu("thanhhoang.studio@example.com", {
      hoTen: "",
      email: "sai-dinh-dang",
      noiDung: "ngắn",
    });

    expect(ketQua.ketQua.thanhcong).toBe(false);
    expect(ketQua.loiTheoTruong.hoTen).toContain("Vui lòng nhập tên");
    expect(ketQua.loiTheoTruong.email).toContain("chưa đúng định dạng");
    expect(ketQua.loiTheoTruong.noiDung).toContain("ít nhất 10 ký tự");
  });

  it("tạo liên kết mailto hợp lệ khi toàn bộ thông tin đúng", () => {
    const mailto = taoLienKetMailto("thanhhoang.studio@example.com", {
      hoTen: "Minh Anh",
      email: "minhanh@example.com",
      noiDung: "Tôi muốn trao đổi về dự án thiết kế trang web mới.",
    });

    expect(mailto.startsWith("mailto:thanhhoang.studio@example.com?subject=")).toBe(true);

    const ketQua = xuLyChuanBiThu("thanhhoang.studio@example.com", {
      hoTen: "Minh Anh",
      email: "minhanh@example.com",
      noiDung: "Tôi muốn trao đổi về dự án thiết kế trang web mới.",
    });

    expect(ketQua.ketQua.thanhcong).toBe(true);
    if (ketQua.ketQua.thanhcong) {
      expect(ketQua.ketQua.dulieu.hoTen).toBe("Minh Anh");
      expect(ketQua.ketQua.dulieu.mailto).toContain("mailto:");
    }
  });
});
