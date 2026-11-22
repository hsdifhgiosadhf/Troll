import { useEffect, type ReactElement } from "react";
import { NhanKyNang } from "@/dungchung/giaodien/NhanKyNang";
import { NutBam } from "@/dungchung/giaodien/NutBam";
import { BieuTuongHeThong } from "@/dungchung/minhhoa/BieuTuongHeThong";
import { MinhHoaKienTrucDuAn } from "@/dungchung/minhhoa/MinhHoaKienTrucDuAn";
import type { DuAn } from "@/tinhnang/duan/kieu/duan";

interface ThuocTinhKhungChiTiet {
  readonly duAn: DuAn;
  readonly onDong: () => void;
}

/**
 * Hộp chi tiết dự án mở trên lớp phủ sân khấu Parisian tối màu,
 * giữ nguyên vị trí màn hình Profile bên dưới.
 */
export function KhungChiTietDuAn({
  duAn,
  onDong,
}: ThuocTinhKhungChiTiet): ReactElement {
  useEffect(() => {
    const xuLyPhimEsc = (suKien: KeyboardEvent): void => {
      if (suKien.key === "Escape") {
        onDong();
      }
    };
    window.addEventListener("keydown", xuLyPhimEsc);
    return () => {
      window.removeEventListener("keydown", xuLyPhimEsc);
    };
  }, [onDong]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--mau-nen-san-khau-sau)]/80 p-4 sm:p-6"
      onClick={onDong}
    >
      <div
        role="region"
        aria-label={`Chi tiết dự án ${duAn.ten}`}
        onClick={(suKien) => suKien.stopPropagation()}
        className="bong-do-san-khau chuyen-morph max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[24px] border-2 border-[var(--mau-nhan-chinh)] bg-[var(--mau-nen-san-khau)] p-5 text-[var(--mau-chu-tren-toi)] sm:p-7"
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--mau-hong-dao)]/20 pb-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--mau-nhan-phu)] uppercase">
              Hồ sơ dự án · {duAn.nam} · {duAn.vaiTro}
            </p>
            <h3 className="chu-tieu-de mt-1 text-2xl font-semibold text-[var(--mau-chu-tren-toi)] sm:text-3xl">
              {duAn.ten}
            </h3>
          </div>
          <NutBam
            bienThe="nhe"
            onClick={onDong}
            ariaLabel="Đóng chi tiết dự án"
            className="border-[var(--mau-hong-dao)]/45 px-3.5 py-1.5 text-xs text-[var(--mau-chu-tren-toi)] hover:border-[var(--mau-nhan-phu)] hover:text-[var(--mau-nhan-phu)]"
          >
            <BieuTuongHeThong ten="dong" kichThuoc={14} />
            <span>Đóng chi tiết</span>
          </NutBam>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MinhHoaKienTrucDuAn loai={duAn.loaiMinhHoa} tenDuAn={duAn.ten} />
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm leading-relaxed text-[var(--mau-chu-tren-toi)]/90">
              {duAn.chiTiet}
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-[var(--mau-hong-dao)]">
              {duAn.ketQua.map((dong) => (
                <li key={dong} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--mau-nhan-phu)]">
                    <BieuTuongHeThong ten="kiemTra" kichThuoc={14} />
                  </span>
                  <span>{dong}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--mau-hong-dao)]/20 pt-3">
              <div className="flex flex-wrap gap-1.5">
                {duAn.kyNang.map((kn) => (
                  <NhanKyNang key={kn} ten={kn} dangChon coNho />
                ))}
              </div>
              <NutBam href={duAn.lienKet} moTabMoi bienThe="chinh" className="px-4 py-1.5 text-xs">
                <span>Xem kho tham khảo</span>
                <BieuTuongHeThong ten="muiTen" kichThuoc={13} />
              </NutBam>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
