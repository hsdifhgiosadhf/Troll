import type { ReactElement } from "react";

interface ThuocTinhNhanKyNang {
  readonly ten: string;
  readonly dangChon?: boolean;
  readonly onClick?: () => void;
  readonly coNho?: boolean;
}

/**
 * Nhãn kỹ năng đồng bộ tông tối Parisian Discord Profile.
 */
export function NhanKyNang({
  ten,
  dangChon = false,
  onClick,
  coNho = false,
}: ThuocTinhNhanKyNang): ReactElement {
  const kichThuocLop = coNho ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1 text-xs";
  const trangThaiLop = dangChon
    ? "bg-[var(--mau-nhan-chinh)] text-[var(--mau-chu-tren-toi)] border-[var(--mau-hong-dao)]/60"
    : "bg-[var(--mau-nen-san-khau)] text-[var(--mau-hong-dao)] border-[var(--mau-hong-dao)]/25 hover:border-[var(--mau-nhan-phu)] hover:text-[var(--mau-chu-tren-toi)]";

  const lopDayDu =
    `nut-nhan inline-flex items-center rounded-full border font-medium ${kichThuocLop} ${trangThaiLop}`.trim();

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={dangChon}
        className={lopDayDu}
      >
        {ten}
      </button>
    );
  }

  return <span className={lopDayDu}>{ten}</span>;
}
