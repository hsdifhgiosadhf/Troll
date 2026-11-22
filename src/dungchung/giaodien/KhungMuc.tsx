import type { ReactElement, ReactNode } from "react";

interface ThuocTinhKhungMuc {
  readonly id: string;
  readonly children: ReactNode;
  readonly nen?: "chinh" | "phu" | "sankhau";
  readonly className?: string;
}

const LOP_VIEN_THE: Record<NonNullable<ThuocTinhKhungMuc["nen"]>, string> = {
  chinh:
    "border-[var(--mau-hong-dao)]/25 bg-[var(--mau-nen-san-khau-sau)]/85 text-[var(--mau-chu-tren-toi)]",
  phu:
    "border-[var(--mau-nhan-phu)]/30 bg-[var(--mau-nen-san-khau)]/90 text-[var(--mau-chu-tren-toi)]",
  sankhau:
    "border-[var(--mau-hong-dao)]/35 bg-[var(--mau-nen-san-khau-sau)]/92 text-[var(--mau-chu-tren-toi)]",
};

/**
 * Khung thẻ Bento kiểu Discord Profile: gom mỗi mục vào một ô thẻ gọn gàng
 * trên cùng một màn hình sân khấu đêm Parisian.
 */
export function KhungMuc({
  id,
  children,
  nen = "chinh",
  className = "",
}: ThuocTinhKhungMuc): ReactElement {
  return (
    <section
      id={id}
      className={`bong-do-san-khau min-w-0 w-full overflow-hidden rounded-[24px] border p-5 sm:p-6 ${LOP_VIEN_THE[nen]} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
