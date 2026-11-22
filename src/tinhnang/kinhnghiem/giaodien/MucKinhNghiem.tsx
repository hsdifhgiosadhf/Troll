import type { ReactElement } from "react";
import { KhungMuc } from "@/dungchung/giaodien/KhungMuc";
import { TieuDeMuc } from "@/dungchung/giaodien/TieuDeMuc";
import {
  dinhDangKhoangMoc,
  dinhDangThoiLuong,
} from "@/tinhnang/kinhnghiem/dichvu/tinhkinhnghiem";
import { useKinhNghiem } from "@/tinhnang/kinhnghiem/moc/useKinhNghiem";

/** Ô Bento Kinh nghiệm & Học vấn dạng nút bấm chuyển mốc gọn trên 1 màn hình. */
export function MucKinhNghiem(): ReactElement {
  const { danhSach, mocDangChon, tongThangCongViec, xuLyChonMoc } =
    useKinhNghiem();

  return (
    <KhungMuc id="kinh-nghiem" nen="chinh">
      <TieuDeMuc
        nhanPhu={`Parcours · ${dinhDangThoiLuong(tongThangCongViec)}`}
        tieuDe="Kinh nghiệm & Học vấn"
        moTa="Bấm từng mốc để xem vai trò"
      />

      <div className="space-y-2">
        {danhSach.map((muc) => {
          const dangChon = mocDangChon?.id === muc.id;
          return (
            <button
              key={muc.id}
              type="button"
              onClick={() => xuLyChonMoc(muc.id)}
              aria-pressed={dangChon}
              className={`chuyen-nhanh block w-full rounded-xl border px-3.5 py-2.5 text-left ${
                dangChon
                  ? "border-[var(--mau-nhan-phu)] bg-[var(--mau-nen-san-khau)]"
                  : "border-[var(--mau-hong-dao)]/20 bg-[var(--mau-nen-san-khau)]/60 hover:border-[var(--mau-hong-dao)]/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span className="font-semibold text-[var(--mau-nhan-phu)] uppercase">
                  {muc.toChuc}
                </span>
                <span className="text-[var(--mau-hong-dao)]/80">
                  {dinhDangKhoangMoc(muc.batDau, muc.ketThuc)}
                </span>
              </div>
              <p className="chu-tieu-de mt-0.5 text-lg font-semibold text-[var(--mau-chu-tren-toi)]">
                {muc.vaiTro}
              </p>
              {dangChon && (
                <p className="mt-1 text-xs leading-relaxed text-[var(--mau-hong-dao)]">
                  {muc.tomTat}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </KhungMuc>
  );
}
