import type { ReactElement } from "react";
import { KhungMuc } from "@/dungchung/giaodien/KhungMuc";
import { TieuDeMuc } from "@/dungchung/giaodien/TieuDeMuc";
import { useBaiViet } from "@/tinhnang/baiviet/moc/useBaiViet";

/** Ô Bento Ghi chú phòng thu thu gọn kiểu trạng thái Discord. */
export function MucBaiViet(): ReactElement {
  const { danhSach, baiDangChon, xuLyChonBai } = useBaiViet();

  return (
    <KhungMuc id="bai-viet" nen="chinh">
      <TieuDeMuc
        nhanPhu="Carnet · Ghi chú"
        tieuDe="Sổ tay phòng thu"
        moTa="Châm ngôn thiết kế"
      />

      <div className="mb-3 flex flex-wrap gap-1.5">
        {danhSach.map((bai) => {
          const dangChon = baiDangChon?.id === bai.id;
          return (
            <button
              key={bai.id}
              type="button"
              onClick={() => xuLyChonBai(bai.id)}
              aria-pressed={dangChon}
              className={`nut-nhan rounded-full border px-3 py-1 text-[11px] font-medium ${
                dangChon
                  ? "border-[var(--mau-nhan-chinh)] bg-[var(--mau-nhan-chinh)] text-[var(--mau-chu-tren-toi)]"
                  : "border-[var(--mau-hong-dao)]/25 bg-[var(--mau-nen-san-khau)] text-[var(--mau-hong-dao)] hover:border-[var(--mau-nhan-phu)]"
              }`}
            >
              {bai.chuDe}
            </button>
          );
        })}
      </div>

      {baiDangChon ? (
        <article className="rounded-2xl border border-[var(--mau-hong-dao)]/20 bg-[var(--mau-nen-san-khau)]/75 p-4">
          <p className="text-[10px] font-semibold tracking-wider text-[var(--mau-nhan-phu)] uppercase">
            {baiDangChon.ngayDang} · {baiDangChon.thoiGianDoc}
          </p>
          <h3 className="chu-tieu-de mt-1 text-xl font-semibold text-[var(--mau-chu-tren-toi)]">
            « {baiDangChon.tieuDe} »
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--mau-hong-dao)]/90">
            {baiDangChon.noiDung[0]}
          </p>
        </article>
      ) : null}
    </KhungMuc>
  );
}
