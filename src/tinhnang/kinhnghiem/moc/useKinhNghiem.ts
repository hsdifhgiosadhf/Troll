import { useMemo, useState } from "react";
import { tinhTongThangCongViec } from "@/tinhnang/kinhnghiem/dichvu/tinhkinhnghiem";
import { layDanhSachKinhNghiem } from "@/tinhnang/kinhnghiem/kho/khokinhnghiem";
import type { MocKinhNghiem } from "@/tinhnang/kinhnghiem/kieu/kinhnghiem";

interface KetQuaHookKinhNghiem {
  readonly danhSach: readonly MocKinhNghiem[];
  readonly mocDangChon: MocKinhNghiem | null;
  readonly tongThangCongViec: number;
  readonly xuLyChonMoc: (id: string) => void;
}

/** Điều phối lựa chọn mốc trên trục kinh nghiệm và học vấn. */
export function useKinhNghiem(): KetQuaHookKinhNghiem {
  const danhSach = useMemo(() => layDanhSachKinhNghiem(), []);
  const [maDangChon, setMaDangChon] = useState<string>(danhSach[0]?.id ?? "");

  const mocDangChon = useMemo(
    () => danhSach.find((muc) => muc.id === maDangChon) ?? danhSach[0] ?? null,
    [danhSach, maDangChon],
  );

  const tongThangCongViec = useMemo(
    () => tinhTongThangCongViec(danhSach),
    [danhSach],
  );

  const xuLyChonMoc = (id: string): void => {
    setMaDangChon(id);
  };

  return { danhSach, mocDangChon, tongThangCongViec, xuLyChonMoc };
}
