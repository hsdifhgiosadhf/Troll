import { useMemo, useState } from "react";
import { layDanhSachBaiViet } from "@/tinhnang/baiviet/kho/khobaiviet";
import type { BaiVietNgan } from "@/tinhnang/baiviet/kieu/baiviet";

interface KetQuaHookBaiViet {
  readonly danhSach: readonly BaiVietNgan[];
  readonly baiDangChon: BaiVietNgan | null;
  readonly xuLyChonBai: (id: string) => void;
}

/** Điều phối danh sách ghi chú và bài đang mở đọc tại chỗ. */
export function useBaiViet(): KetQuaHookBaiViet {
  const danhSach = useMemo(() => layDanhSachBaiViet(), []);
  const [maDangChon, setMaDangChon] = useState<string>(danhSach[0]?.id ?? "");

  const baiDangChon = useMemo(
    () => danhSach.find((bai) => bai.id === maDangChon) ?? danhSach[0] ?? null,
    [danhSach, maDangChon],
  );

  const xuLyChonBai = (id: string): void => {
    setMaDangChon(id);
  };

  return { danhSach, baiDangChon, xuLyChonBai };
}
