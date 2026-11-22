/**
 * Ghép đường dẫn tài nguyên trong thư mục public/ với BASE_URL của Vite
 * để ảnh và tệp tải về không bị lỗi 404 khi triển khai trong thư mục con GitHub Pages.
 */
export function duongDanTaiNguyen(
  duongDanCon: string,
  duongDanGoc: string = import.meta.env.BASE_URL ?? "/",
): string {
  const phanConSach = duongDanCon.replace(/^\/+/, "");
  if (duongDanGoc === "./" || duongDanGoc === ".") {
    return `./${phanConSach}`;
  }
  const phanGocSach = duongDanGoc.endsWith("/") ? duongDanGoc : `${duongDanGoc}/`;
  return `${phanGocSach}${phanConSach}`;
}

/** Kiểm tra giao thức liên kết ngoài trước khi gán vào thuộc tính href. */
export function laLienKetNgoaiAnToan(lienKet: string): boolean {
  const chuoiSach = lienKet.trim().toLowerCase();
  return (
    chuoiSach.startsWith("https://") ||
    chuoiSach.startsWith("http://") ||
    chuoiSach.startsWith("mailto:")
  );
}
