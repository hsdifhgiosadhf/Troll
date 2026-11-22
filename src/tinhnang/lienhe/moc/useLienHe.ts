import { useEffect, useState, type FormEvent } from "react";
import { CAU_HINH_TRANG } from "@/cauhinh/cauhinh";
import type { KetQua } from "@/dungchung/kieu/ketqua";
import {
  xuLyChuanBiThu,
  type KetQuaThuLienHe,
} from "@/tinhnang/lienhe/dichvu/taothulienhe";
import type { DuLieuLienHe, LoiBieuMauLienHe } from "@/tinhnang/lienhe/kieu/lienhe";

interface KetQuaHookLienHe {
  readonly emailLienHe: string;
  readonly bieuMau: DuLieuLienHe;
  readonly daSanSang: boolean;
  readonly dangGui: boolean;
  readonly daSaoChepEmail: boolean;
  readonly loiTheoTruong: LoiBieuMauLienHe;
  readonly ketQuaGui: KetQua<KetQuaThuLienHe> | null;
  readonly xuLyDoiTruong: (truong: keyof DuLieuLienHe, giaTri: string) => void;
  readonly xuLyGui: (suKien: FormEvent<HTMLFormElement>) => void;
  readonly xuLySaoChepEmail: () => Promise<void>;
}

/** Kết nối biểu mẫu liên hệ tĩnh và nút sao chép email của Thành Hoàng. */
export function useLienHe(): KetQuaHookLienHe {
  const [daSanSang, setDaSanSang] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [daSaoChepEmail, setDaSaoChepEmail] = useState(false);
  const [bieuMau, setBieuMau] = useState<DuLieuLienHe>({
    hoTen: "",
    email: "",
    noiDung: "",
  });
  const [loiTheoTruong, setLoiTheoTruong] = useState<LoiBieuMauLienHe>({});
  const [ketQuaGui, setKetQuaGui] = useState<KetQua<KetQuaThuLienHe> | null>(null);

  useEffect(() => {
    setDaSanSang(true);
  }, []);

  const xuLyDoiTruong = (truong: keyof DuLieuLienHe, giaTri: string): void => {
    setBieuMau((cu) => ({ ...cu, [truong]: giaTri }));
    setLoiTheoTruong((cu) => ({ ...cu, [truong]: undefined }));
  };

  const xuLyGui = (suKien: FormEvent<HTMLFormElement>): void => {
    suKien.preventDefault();
    if (!daSanSang || dangGui) return;

    setDangGui(true);
    const ketQua = xuLyChuanBiThu(CAU_HINH_TRANG.emailLienHe, bieuMau);
    setLoiTheoTruong(ketQua.loiTheoTruong);
    setKetQuaGui(ketQua.ketQua);
    setDangGui(false);
  };

  const xuLySaoChepEmail = async (): Promise<void> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(CAU_HINH_TRANG.emailLienHe);
      }
      setDaSaoChepEmail(true);
    } catch (loi: unknown) {
      console.error("[lienhe] Khong sao chep duoc email:", loi);
      setDaSaoChepEmail(false);
    }
  };

  return {
    emailLienHe: CAU_HINH_TRANG.emailLienHe,
    bieuMau,
    daSanSang,
    dangGui,
    daSaoChepEmail,
    loiTheoTruong,
    ketQuaGui,
    xuLyDoiTruong,
    xuLyGui,
    xuLySaoChepEmail,
  };
}
