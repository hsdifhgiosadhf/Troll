import type { ReactElement } from "react";
import { CAU_HINH_TRANG } from "@/cauhinh/cauhinh";
import { KhungTrang } from "@/dungchung/giaodien/KhungTrang";
import { MucGioiThieu } from "@/tinhnang/gioithieu/chiso";

/**
 * Trang 1 màn hình duy nhất giống mẫu zyo.lol:
 * Chỉ hiển thị Thẻ Profile + Ảnh bìa SVG chuyển động theo nhạc + Thanh nhạc lặp ở giữa màn hình.
 */
export function App(): ReactElement {
  return (
    <KhungTrang
      tenThuongHieu={CAU_HINH_TRANG.tenHienThi}
      tieuDeNho={CAU_HINH_TRANG.tieuDePhu}
    >
      <MucGioiThieu />
    </KhungTrang>
  );
}
