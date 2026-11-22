import { laLienKetNgoaiAnToan } from "@/dungchung/duongdan";
import type { KetQua } from "@/dungchung/kieu/ketqua";
import {
  kiemTraDuLieuLienHe,
} from "@/tinhnang/lienhe/kiemtra/kiemtralienhe";
import type { DuLieuLienHe, LoiBieuMauLienHe } from "@/tinhnang/lienhe/kieu/lienhe";

export interface KetQuaThuLienHe {
  readonly mailto: string;
  readonly hoTen: string;
}

/** Tạo liên kết mailto an toàn để người xem gửi thẳng qua trình duyệt hoặc ứng dụng thư. */
export function taoLienKetMailto(
  emailNhan: string,
  duLieu: DuLieuLienHe,
): string {
  const tieuDe = encodeURIComponent(`[Liên hệ Portfolio] Từ ${duLieu.hoTen}`);
  const thanThu = encodeURIComponent(
    `Xin chào Thành Hoàng,\n\nTôi là ${duLieu.hoTen} (${duLieu.email}).\n\n${duLieu.noiDung}\n`,
  );
  const lienKet = `mailto:${emailNhan}?subject=${tieuDe}&body=${thanThu}`;
  return laLienKetNgoaiAnToan(lienKet) ? lienKet : "#";
}

/** Kiểm tra dữ liệu nhập vào và dựng thư liên hệ minh bạch cho trang tĩnh. */
export function xuLyChuanBiThu(
  emailNhan: string,
  duLieuTho: DuLieuLienHe,
): {
  readonly ketQua: KetQua<KetQuaThuLienHe>;
  readonly loiTheoTruong: LoiBieuMauLienHe;
} {
  const kiemTra = kiemTraDuLieuLienHe(duLieuTho);
  if (!kiemTra.ketQua.thanhcong) {
    return {
      ketQua: kiemTra.ketQua,
      loiTheoTruong: kiemTra.loiTheoTruong,
    };
  }

  const mailto = taoLienKetMailto(emailNhan, kiemTra.ketQua.dulieu);
  return {
    ketQua: {
      thanhcong: true,
      dulieu: {
        mailto,
        hoTen: kiemTra.ketQua.dulieu.hoTen,
      },
      thongbao: `Đã chuẩn bị sẵn nội dung thư của ${kiemTra.ketQua.dulieu.hoTen}. Bạn bấm nút bên dưới để mở ứng dụng gửi thư.`,
    },
    loiTheoTruong: {},
  };
}
