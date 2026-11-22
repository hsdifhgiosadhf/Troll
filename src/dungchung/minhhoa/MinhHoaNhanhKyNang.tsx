import type { ReactElement } from "react";
import { HE_MAU, NET_VE_CHUAN } from "@/dungchung/hemau";

export type CheDoMinhHoaKyNang = "giaodien" | "hethong" | "kiemthu";

interface ThuocTinhMinhHoaKyNang {
  readonly cheDo: CheDoMinhHoaKyNang;
}

interface HinhTrangThaiKyNang {
  readonly duongChinh: string;
  readonly duongPhu: string;
  readonly toaDoNut: readonly [readonly [number, number], readonly [number, number], readonly [number, number]];
  readonly banKinhVong: number;
}

const HINH_THEO_CHE_DO: Record<CheDoMinhHoaKyNang, HinhTrangThaiKyNang> = {
  giaodien: {
    duongChinh: "M 48 160 C 98 76, 178 76, 224 150 C 266 218, 326 210, 352 128",
    duongPhu: "M 48 188 C 110 220, 172 110, 232 132 C 282 150, 316 184, 352 162",
    toaDoNut: [
      [114, 108],
      [224, 150],
      [318, 172],
    ],
    banKinhVong: 46,
  },
  hethong: {
    duongChinh: "M 48 140 C 110 140, 148 92, 200 92 C 252 92, 290 198, 352 198",
    duongPhu: "M 48 202 C 122 202, 150 152, 200 152 C 250 152, 286 102, 352 102",
    toaDoNut: [
      [200, 92],
      [200, 152],
      [318, 194],
    ],
    banKinhVong: 58,
  },
  kiemthu: {
    duongChinh: "M 48 190 C 96 190, 128 110, 196 110 C 264 110, 296 148, 352 110",
    duongPhu: "M 48 136 C 108 136, 144 198, 208 198 C 272 198, 304 148, 352 174",
    toaDoNut: [
      [148, 134],
      [208, 198],
      [312, 126],
    ],
    banKinhVong: 52,
  },
};

/**
 * Sơ đồ quỹ đạo sóng âm & nút kết nối morphing theo nhóm kỹ năng đang chọn.
 */
export function MinhHoaNhanhKyNang({
  cheDo,
}: ThuocTinhMinhHoaKyNang): ReactElement {
  const cauHinh = HINH_THEO_CHE_DO[cheDo];

  return (
    <svg
      viewBox="0 0 400 280"
      role="img"
      className="h-auto w-full select-none"
    >
      <title>Sơ đồ trực quan biến đổi theo nhóm kỹ năng của Thành Hoàng</title>
      <rect
        x="10"
        y="10"
        width="380"
        height="260"
        rx="20"
        fill={HE_MAU.nenSanKhau}
        stroke={HE_MAU.vienNhe}
        strokeWidth={NET_VE_CHUAN}
      />

      {/* Đường trục tâm làm nền nhẹ */}
      <line
        x1="40"
        y1="145"
        x2="360"
        y2="145"
        stroke={HE_MAU.chuTrenToi}
        strokeOpacity="0.16"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      {/* Vòng hào quang biến đổi bán kính mượt mà */}
      <circle
        cx="200"
        cy="145"
        r={cauHinh.banKinhVong}
        fill={HE_MAU.nhanChinh}
        fillOpacity="0.22"
        stroke={HE_MAU.hongDao}
        strokeOpacity="0.65"
        strokeWidth={NET_VE_CHUAN}
        className="chuyen-morph"
      />

      {/* Hai đường cong sóng âm cùng số điểm neo để morph mượt */}
      <path
        d={cauHinh.duongChinh}
        fill="none"
        stroke={HE_MAU.nhanPhu}
        strokeWidth="2.25"
        strokeLinecap="round"
        className="chuyen-morph"
      />
      <path
        d={cauHinh.duongPhu}
        fill="none"
        stroke={HE_MAU.hongDao}
        strokeWidth={NET_VE_CHUAN}
        strokeLinecap="round"
        className="chuyen-morph"
      />

      {/* Ba điểm nút năng lực trượt tới vị trí mới */}
      {cauHinh.toaDoNut.map(([cx, cy], chiSo) => (
        <g
          key={chiSo}
          transform={`translate(${cx}, ${cy})`}
          className="chuyen-morph"
        >
          <circle
            cx="0"
            cy="0"
            r="9"
            fill={HE_MAU.nenChinh}
            stroke={HE_MAU.nhanChinh}
            strokeWidth={NET_VE_CHUAN}
          />
          <circle cx="0" cy="0" r="3.5" fill={HE_MAU.nhanChinh} />
        </g>
      ))}
    </svg>
  );
}
