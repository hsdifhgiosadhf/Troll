import type { ReactElement } from "react";
import { KhungMuc } from "@/dungchung/giaodien/KhungMuc";
import { NhanKyNang } from "@/dungchung/giaodien/NhanKyNang";
import { NutBam } from "@/dungchung/giaodien/NutBam";
import { TieuDeMuc } from "@/dungchung/giaodien/TieuDeMuc";
import { KhungChiTietDuAn } from "@/tinhnang/duan/giaodien/KhungChiTietDuAn";
import { TheDuAn } from "@/tinhnang/duan/giaodien/TheDuAn";
import { useDuAn } from "@/tinhnang/duan/moc/useDuAn";

/** Ô Bento Dự án tiêu biểu với bộ lọc kỹ năng nhanh trong 1 màn hình. */
export function MucDuAn(): ReactElement {
  const {
    danhSachBoLoc,
    kyNangDangChon,
    dsDuAnLoc,
    duAnDangXem,
    xuLyChonKyNang,
    xuLyDatLaiBoLoc,
    xuLyMoChiTiet,
    xuLyDongChiTiet,
  } = useDuAn();

  return (
    <KhungMuc id="du-an" nen="chinh">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TieuDeMuc
          nhanPhu="Répertoire · Tác phẩm"
          tieuDe="Dự án tiêu biểu"
          moTa="Lọc nhanh theo kỹ năng hoặc bấm mở chi tiết"
        />
        <div
          className="mb-4 flex flex-wrap gap-1.5"
          role="group"
          aria-label="Bộ lọc dự án theo kỹ năng"
        >
          {danhSachBoLoc.map((kyNang) => (
            <NhanKyNang
              key={kyNang}
              ten={kyNang}
              dangChon={kyNang === kyNangDangChon}
              onClick={() => xuLyChonKyNang(kyNang)}
              coNho
            />
          ))}
        </div>
      </div>

      {duAnDangXem && (
        <KhungChiTietDuAn duAn={duAnDangXem} onDong={xuLyDongChiTiet} />
      )}

      {dsDuAnLoc.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--mau-hong-dao)]/40 bg-[var(--mau-nen-san-khau)]/70 p-5 text-center">
          <p className="chu-tieu-de text-xl font-semibold text-[var(--mau-chu-tren-toi)]">
            Chưa có dự án nào khớp kỹ năng “{kyNangDangChon}”.
          </p>
          <div className="mt-3">
            <NutBam bienThe="chinh" onClick={xuLyDatLaiBoLoc} className="px-4 py-1.5 text-xs">
              Đặt lại bộ lọc
            </NutBam>
          </div>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {dsDuAnLoc.map((duAn) => (
            <TheDuAn
              key={duAn.id}
              duAn={duAn}
              dangMo={duAnDangXem?.id === duAn.id}
              onChonXem={xuLyMoChiTiet}
            />
          ))}
        </div>
      )}
    </KhungMuc>
  );
}
