import type { ReactElement, ReactNode } from "react";
import { laLienKetNgoaiAnToan } from "@/dungchung/duongdan";

type BienTheNut = "chinh" | "phu" | "nhe";

interface ThuocTinhNutBam {
  readonly children: ReactNode;
  readonly bienThe?: BienTheNut;
  readonly onClick?: () => void;
  readonly href?: string;
  readonly taiXuong?: boolean;
  readonly moTabMoi?: boolean;
  readonly loai?: "button" | "submit" | "reset";
  readonly biKhoa?: boolean;
  readonly lyDoKhoa?: string;
  readonly className?: string;
  readonly ariaLabel?: string;
}

const LOP_BIEN_THE: Record<BienTheNut, string> = {
  chinh:
    "bg-[var(--mau-nhan-chinh)] text-[var(--mau-chu-tren-toi)] border border-[var(--mau-nhan-chinh)] hover:bg-[var(--mau-nhan-chinh-dam)]",
  phu:
    "bg-[var(--mau-nen-san-khau)] text-[var(--mau-chu-tren-toi)] border border-[var(--mau-nen-san-khau)] hover:opacity-90",
  nhe:
    "bg-transparent text-[var(--mau-chu-chinh)] border border-[var(--mau-vien)] hover:border-[var(--mau-nhan-chinh)] hover:text-[var(--mau-nhan-chinh)]",
};

const LOP_CHUNG =
  "nut-nhan inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mau-nhan-chinh)] disabled:cursor-not-allowed disabled:opacity-60";

/** Nút bấm và liên kết đồng bộ theo quy tắc nhấn lún 2px và bảng màu HE_MAU. */
export function NutBam({
  children,
  bienThe = "chinh",
  onClick,
  href,
  taiXuong = false,
  moTabMoi = false,
  loai = "button",
  biKhoa = false,
  lyDoKhoa,
  className = "",
  ariaLabel,
}: ThuocTinhNutBam): ReactElement {
  const lopDayDu = `${LOP_CHUNG} ${LOP_BIEN_THE[bienThe]} ${className}`.trim();

  if (href) {
    const laDuongDanNoiBo =
      href.startsWith("#") || href.startsWith("./") || href.startsWith("/");
    const hopLe = laDuongDanNoiBo || laLienKetNgoaiAnToan(href);
    const diaChiAnToan = hopLe ? href : "#";

    return (
      <a
        href={diaChiAnToan}
        download={taiXuong || undefined}
        target={moTabMoi ? "_blank" : undefined}
        rel={moTabMoi ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        className={lopDayDu}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={loai}
      onClick={onClick}
      disabled={biKhoa}
      title={biKhoa && lyDoKhoa ? lyDoKhoa : undefined}
      aria-label={ariaLabel}
      className={lopDayDu}
    >
      {children}
    </button>
  );
}
