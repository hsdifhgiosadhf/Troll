import type { ReactElement } from "react";

interface ThuocTinhTieuDeMuc {
  readonly nhanPhu: string;
  readonly tieuDe: string;
  readonly moTa: string;
  readonly trenNenToi?: boolean;
}

/** Tiêu đề gọn cho từng ô thẻ Bento trên trang Profile 1 màn hình. */
export function TieuDeMuc({
  nhanPhu,
  tieuDe,
  moTa,
}: ThuocTinhTieuDeMuc): ReactElement {
  return (
    <header className="mb-4">
      <div className="mb-1 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--mau-nhan-chinh)]"
        />
        <span className="text-[11px] font-semibold tracking-[0.18em] text-[var(--mau-nhan-phu)] uppercase">
          {nhanPhu}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="chu-tieu-de text-2xl font-semibold tracking-tight text-[var(--mau-chu-tren-toi)] sm:text-3xl">
          {tieuDe}
        </h2>
        <p className="text-xs text-[var(--mau-hong-dao)]/85">{moTa}</p>
      </div>
    </header>
  );
}
