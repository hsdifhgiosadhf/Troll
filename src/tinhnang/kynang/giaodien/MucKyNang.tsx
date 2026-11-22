import type { ReactElement } from "react";
import { KhungMuc } from "@/dungchung/giaodien/KhungMuc";
import { NhanKyNang } from "@/dungchung/giaodien/NhanKyNang";
import { TieuDeMuc } from "@/dungchung/giaodien/TieuDeMuc";
import { MinhHoaNhanhKyNang } from "@/dungchung/minhhoa/MinhHoaNhanhKyNang";
import { useKyNang } from "@/tinhnang/kynang/moc/useKyNang";

/** Ô Bento Kỹ năng thu gọn với sơ đồ sóng âm biến hình. */
export function MucKyNang(): ReactElement {
  const { danhSachNhom, nhomHienTai, maDangChon, xuLyChonNhom } = useKyNang();

  return (
    <KhungMuc id="ky-nang" nen="chinh">
      <TieuDeMuc
        nhanPhu="Savoir-Faire"
        tieuDe="Kỹ năng"
        moTa="Chọn nhóm để đổi sơ đồ sóng âm"
      />

      <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Nhóm kỹ năng">
        {danhSachNhom.map((nhom) => {
          const dangChon = nhom.id === maDangChon;
          return (
            <button
              key={nhom.id}
              type="button"
              role="tab"
              aria-selected={dangChon}
              onClick={() => xuLyChonNhom(nhom.id)}
              className={`nut-nhan rounded-full border px-3 py-1 text-xs font-medium ${
                dangChon
                  ? "border-[var(--mau-nhan-chinh)] bg-[var(--mau-nhan-chinh)] text-[var(--mau-chu-tren-toi)]"
                  : "border-[var(--mau-hong-dao)]/25 bg-[var(--mau-nen-san-khau)] text-[var(--mau-hong-dao)] hover:border-[var(--mau-nhan-phu)]"
              }`}
            >
              {nhom.tieuDe}
            </button>
          );
        })}
      </div>

      {nhomHienTai ? (
        <div className="space-y-3">
          <div className="mx-auto max-w-[260px]">
            <MinhHoaNhanhKyNang cheDo={nhomHienTai.id} />
          </div>
          <ul className="space-y-2">
            {nhomHienTai.cacKyNang.map((muc) => (
              <li
                key={muc.id}
                className="rounded-xl border border-[var(--mau-hong-dao)]/20 bg-[var(--mau-nen-san-khau)]/70 px-3 py-2"
              >
                <div className="flex flex-col gap-1">
                  <div>
                    <NhanKyNang ten={muc.ten} dangChon coNho />
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--mau-hong-dao)]/85">
                    {muc.moTa}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </KhungMuc>
  );
}
