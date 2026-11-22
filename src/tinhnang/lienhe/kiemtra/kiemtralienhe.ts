import { z } from "zod";
import { SO_KY_TU_TIN_NHAN_TOI_DA } from "@/dungchung/hangso";
import type { KetQua } from "@/dungchung/kieu/ketqua";
import type { DuLieuLienHe, LoiBieuMauLienHe } from "@/tinhnang/lienhe/kieu/lienhe";

export const KhuonLienHe = z.object({
  hoTen: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tên của bạn (ít nhất 2 ký tự)."),
  email: z
    .string()
    .trim()
    .email("Địa chỉ email chưa đúng định dạng."),
  noiDung: z
    .string()
    .trim()
    .min(10, "Lời nhắn cần ít nhất 10 ký tự để tôi hiểu rõ yêu cầu.")
    .max(
      SO_KY_TU_TIN_NHAN_TOI_DA,
      `Lời nhắn không vượt quá ${SO_KY_TU_TIN_NHAN_TOI_DA} ký tự.`,
    ),
});

export interface KetQuaKiemTraLienHe {
  readonly ketQua: KetQua<DuLieuLienHe>;
  readonly loiTheoTruong: LoiBieuMauLienHe;
}

/** Xác thực biểu mẫu liên hệ bằng Zod và trả lỗi tiếng Việt rõ ràng theo từng ô. */
export function kiemTraDuLieuLienHe(duLieuTho: unknown): KetQuaKiemTraLienHe {
  const phanTich = KhuonLienHe.safeParse(duLieuTho);
  if (phanTich.success) {
    return {
      ketQua: {
        thanhcong: true,
        dulieu: phanTich.data,
        thongbao: "Thông tin liên hệ đã hợp lệ.",
      },
      loiTheoTruong: {},
    };
  }

  const loiTheoTruong: { hoTen?: string; email?: string; noiDung?: string } = {};
  for (const vanDe of phanTich.error.issues) {
    const truong = vanDe.path[0];
    if (truong === "hoTen" && !loiTheoTruong.hoTen) {
      loiTheoTruong.hoTen = vanDe.message;
    } else if (truong === "email" && !loiTheoTruong.email) {
      loiTheoTruong.email = vanDe.message;
    } else if (truong === "noiDung" && !loiTheoTruong.noiDung) {
      loiTheoTruong.noiDung = vanDe.message;
    }
  }

  return {
    ketQua: {
      thanhcong: false,
      dulieu: null,
      thongbao: "Vui lòng kiểm tra lại các thông tin còn thiếu hoặc chưa đúng.",
      ma: "LOI_NHAP_LIEU",
    },
    loiTheoTruong,
  };
}
