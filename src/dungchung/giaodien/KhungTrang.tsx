import type { ReactElement, ReactNode } from "react";

interface ThuocTinhKhungTrang {
  readonly tenThuongHieu: string;
  readonly tieuDeNho: string;
  readonly children: ReactNode;
}

/**
 * Khung trang toàn màn hình (100vh) kiểu trang bio Discord (zyo.lol),
 * không có thanh điều hướng góc phải để giữ trọn không gian nghệ thuật.
 */
export function KhungTrang({
  children,
}: ThuocTinhKhungTrang): ReactElement {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden">
      <main className="relative z-10 flex w-full flex-1 flex-col items-center justify-center py-10">
        {children}
      </main>
    </div>
  );
}
