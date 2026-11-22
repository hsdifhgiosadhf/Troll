import type { ReactElement } from "react";
import { NhanKyNang } from "@/dungchung/giaodien/NhanKyNang";
import { NutBam } from "@/dungchung/giaodien/NutBam";
import { BieuTuongHeThong } from "@/dungchung/minhhoa/BieuTuongHeThong";
import { MinhHoaKienTrucDuAn } from "@/dungchung/minhhoa/MinhHoaKienTrucDuAn";
import type { DuAn } from "@/tinhnang/duan/kieu/duan";

interface ThuocTinhTheDuAn {
  readonly duAn: DuAn;
  readonly dangMo: boolean;
  readonly onChonXem: (maDuAn: string) => void;
}

/** Thẻ dự án thu gọn trong lưới Bento 1 màn hình kiểu Discord Profile. */
export function TheDuAn({
  duAn,
  dangMo,
  onChonXem,
}: ThuocTinhTheDuAn): ReactElement {
  return (
    <article
      className={`chuyen-nhanh flex flex-col justify-between rounded-2xl border p-3.5 ${
        dangMo
          ? "border-[var(--mau-nhan-phu)] bg-[var(--mau-nen-san-khau)]"
          : "border-[var(--mau-hong-dao)]/20 bg-[var(--mau-nen-san-khau)]/75 hover:border-[var(--mau-hong-dao)]/60"
      }`}
    >
      <div>
        <div className=" flex items-center justify-between gap-2 text-[10px] font-semibold tracking-wider text-[var(--mau-nhan-phu)] uppercase">
          <span>{duAn.vaiTro}</span>
          <span>{duAn.nam}</span>
        </div>
        <h3 className="chu-tieu-de mt-1 text-xl font-semibold text-[var(--mau-chu-tren-toi)]">
          {duAn.ten}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--mau-hong-dao)]/85">
          {duAn.tomTat}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--mau-hong-dao)]/15 pt-2.5">
        <div className="flex flex-wrap gap-1">
          {duAn.kyNang.map((kn) => (
            <NhanKyNang key={kn} ten={kn} coNho />
          ))}
        </div>
        <NutBam
          bienThe={dangMo ? "chinh" : "nhe"}
          onClick={() => onChonXem(duAn.id)}
          ariaLabel={
            dangMo
              ? `Thu gọn chi tiết dự án ${duAn.ten}`
              : `Xem chi tiết dự án ${duAn.ten}`
          }
          className="border-[var(--mau-hong-dao)]/40 px-3 py-1 text-[11px] text-[var(--mau-chu-tren-toi)] hover:border-[var(--mau-nhan-phu)] hover:text-[var(--mau-nhan-phu)]"
        >
          <span>{dangMo ? "Đang mở" : "Xem chi tiết"}</span>
          <BieuTuongHeThong ten={dangMo ? "dong" : "muiTen"} kichThuoc={13} />
        </NutBam>
      </div>
      <div className="sr-only">
        <MinhHoaKienTrucDuAn loai={duAn.loaiMinhHoa} tenDuAn={duAn.ten} thuGon />
      </div>
    </article>
  );
}
