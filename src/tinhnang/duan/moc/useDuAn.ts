import { useMemo, useState } from "react";
import { locDuAnTheoKyNang, timDuAnTheoMa } from "@/tinhnang/duan/dichvu/locduan";
import {
  DANH_SACH_BO_LOC_DU_AN,
  layDanhSachDuAn,
  TU_KHOA_TAT_CA,
} from "@/tinhnang/duan/kho/khoduan";
import type { DuAn } from "@/tinhnang/duan/kieu/duan";

interface KetQuaHookDuAn {
  readonly danhSachBoLoc: readonly string[];
  readonly kyNangDangChon: string;
  readonly dsDuAnLoc: readonly DuAn[];
  readonly duAnDangXem: DuAn | null;
  readonly xuLyChonKyNang: (kyNang: string) => void;
  readonly xuLyDatLaiBoLoc: () => void;
  readonly xuLyMoChiTiet: (maDuAn: string) => void;
  readonly xuLyDongChiTiet: () => void;
}

/** Điều phối bộ lọc kỹ năng và khung chi tiết dự án mở tại chỗ. */
export function useDuAn(): KetQuaHookDuAn {
  const [kyNangDangChon, setKyNangDangChon] = useState(TU_KHOA_TAT_CA);
  const [maDuAnMo, setMaDuAnMo] = useState<string | null>(null);

  const tatCaDuAn = useMemo(() => layDanhSachDuAn(), []);
  const dsDuAnLoc = useMemo(
    () => locDuAnTheoKyNang(tatCaDuAn, kyNangDangChon),
    [tatCaDuAn, kyNangDangChon],
  );
  const duAnDangXem = useMemo(
    () => timDuAnTheoMa(dsDuAnLoc, maDuAnMo),
    [dsDuAnLoc, maDuAnMo],
  );

  const xuLyChonKyNang = (kyNang: string): void => {
    setKyNangDangChon(kyNang);
  };

  const xuLyDatLaiBoLoc = (): void => {
    setKyNangDangChon(TU_KHOA_TAT_CA);
  };

  const xuLyMoChiTiet = (maDuAn: string): void => {
    setMaDuAnMo((maCu) => (maCu === maDuAn ? null : maDuAn));
  };

  const xuLyDongChiTiet = (): void => {
    setMaDuAnMo(null);
  };

  return {
    danhSachBoLoc: DANH_SACH_BO_LOC_DU_AN,
    kyNangDangChon,
    dsDuAnLoc,
    duAnDangXem,
    xuLyChonKyNang,
    xuLyDatLaiBoLoc,
    xuLyMoChiTiet,
    xuLyDongChiTiet,
  };
}
