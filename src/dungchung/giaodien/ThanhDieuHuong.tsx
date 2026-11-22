import { useState, type ReactElement } from "react";
import { DANH_SACH_MUC } from "@/dungchung/hangso";
import { BieuTuongHeThong } from "@/dungchung/minhhoa/BieuTuongHeThong";

interface ThuocTinhThanhDieuHuong {
  readonly tenThuongHieu: string;
  readonly tieuDeNho: string;
  readonly onChonMuc?: (idMuc: string) => void;
}

/**
 * Cụm điều hướng nổi gọn ở góc trên bên phải màn hình,
 * không che phông nền toàn trang kiểu zyo.lol.
 */
export function ThanhDieuHuong({
  tenThuongHieu,
  onChonMuc,
}: ThuocTinhThanhDieuHuong): ReactElement {
  const [dangMoMenu, setDangMoMenu] = useState(false);

  const xuLyChon = (idMuc: string): void => {
    setDangMoMenu(false);
    if (onChonMuc) {
      onChonMuc(idMuc);
    }
  };

  return (
    <header className="fixed top-4 right-4 z-30">
      <div className="flex items-center gap-2">
        <span className="sr-only">{tenThuongHieu}</span>

        <nav
          aria-label="Điều hướng chính"
          className="hidden rounded-full border border-[var(--mau-nen-chinh)]/45 bg-[var(--mau-nen-chinh)]/25 px-4 py-2 shadow-md backdrop-blur-md md:block"
        >
          <ul className="flex items-center gap-4">
            {DANH_SACH_MUC.map((muc) => (
              <li key={muc.id}>
                <a
                  href={muc.neo}
                  onClick={() => xuLyChon(muc.id)}
                  className="chuyen-nhanh text-xs font-bold text-[var(--mau-nen-san-khau)] hover:text-[var(--mau-nhan-chinh)]"
                >
                  {muc.nhan}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setDangMoMenu((cu) => !cu)}
          aria-expanded={dangMoMenu}
          aria-controls="menu-di-dong"
          aria-label={dangMoMenu ? "Đóng trình đơn điều hướng" : "Mở trình đơn điều hướng"}
          className="nut-nhan inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--mau-nen-chinh)]/45 bg-[var(--mau-nen-chinh)]/25 text-[var(--mau-nen-san-khau)] shadow-md backdrop-blur-md md:hidden"
        >
          <BieuTuongHeThong ten={dangMoMenu ? "dong" : "menu"} kichThuoc={20} />
        </button>
      </div>

      {dangMoMenu && (
        <nav
          id="menu-di-dong"
          aria-label="Điều hướng di động"
          className="mt-2 w-48 rounded-2xl border border-[var(--mau-nen-chinh)]/50 bg-[var(--mau-nen-san-khau)]/95 p-3 text-[var(--mau-chu-tren-toi)] shadow-xl backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-1.5">
            {DANH_SACH_MUC.map((muc) => (
              <li key={muc.id}>
                <a
                  href={muc.neo}
                  onClick={() => xuLyChon(muc.id)}
                  className="block rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--mau-chu-tren-toi)] hover:bg-[var(--mau-nhan-chinh)]"
                >
                  {muc.nhan}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
