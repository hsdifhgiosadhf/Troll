import { useMemo, useState } from "react";
import type { CheDoMinhHoaKyNang } from "@/dungchung/minhhoa/MinhHoaNhanhKyNang";
import { chonNhomKyNangHienTai } from "@/tinhnang/kynang/dichvu/laykynang";
import { layDanhSachKyNang } from "@/tinhnang/kynang/kho/khokynang";
import type { NhomKyNang } from "@/tinhnang/kynang/kieu/kynang";

interface KetQuaHookKyNang {
  readonly danhSachNhom: readonly NhomKyNang[];
  readonly nhomHienTai: NhomKyNang | null;
  readonly maDangChon: CheDoMinhHoaKyNang;
  readonly xuLyChonNhom: (ma: CheDoMinhHoaKyNang) => void;
}

/** Kết nối dữ liệu kỹ năng với trạng thái chuyển nhóm và biến đổi sơ đồ SVG. */
export function useKyNang(): KetQuaHookKyNang {
  const [maDangChon, setMaDangChon] = useState<CheDoMinhHoaKyNang>("giaodien");
  const danhSachNhom = useMemo(() => layDanhSachKyNang(), []);
  const nhomHienTai = useMemo(
    () => chonNhomKyNangHienTai(danhSachNhom, maDangChon),
    [danhSachNhom, maDangChon],
  );

  const xuLyChonNhom = (ma: CheDoMinhHoaKyNang): void => {
    setMaDangChon(ma);
  };

  return { danhSachNhom, nhomHienTai, maDangChon, xuLyChonNhom };
}
