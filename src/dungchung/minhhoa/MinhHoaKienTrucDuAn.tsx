import type { ReactElement } from "react";
import { HE_MAU, NET_VE_CHUAN } from "@/dungchung/hemau";

export type LoaiMinhHoaDuAn = "tapchi" | "amnhac" | "dongbo" | "nhiepanh";

interface ThuocTinhMinhHoaDuAn {
  readonly loai: LoaiMinhHoaDuAn;
  readonly tenDuAn: string;
  readonly thuGon?: boolean;
}

const DUONG_CHUYEN_THEO_LOAI: Record<LoaiMinhHoaDuAn, string> = {
  tapchi: "M 42 150 C 92 94, 152 94, 198 134 C 244 174, 304 128, 344 96",
  amnhac: "M 42 128 C 88 76, 138 178, 192 124 C 246 70, 294 172, 344 116",
  dongbo: "M 42 162 C 102 162, 132 88, 196 88 C 260 88, 286 162, 344 162",
  nhiepanh: "M 42 108 C 96 168, 154 168, 198 118 C 242 68, 298 104, 344 148",
};

/**
 * Khung bản vẽ kiến trúc dùng chung cho Thẻ dự án và Chi tiết dự án,
 * tạo cầu nối thị giác liền mạch khi người xem mở xem chi tiết.
 */
export function MinhHoaKienTrucDuAn({
  loai,
  tenDuAn,
  thuGon = false,
}: ThuocTinhMinhHoaDuAn): ReactElement {
  return (
    <svg
      viewBox="0 0 386 210"
      role="img"
      className={`h-auto w-full select-none ${thuGon ? "max-h-44" : "max-h-60"}`}
    >
      <title>{`Minh hoạ bố cục dự án ${tenDuAn}`}</title>
      <rect
        x="4"
        y="4"
        width="378"
        height="202"
        rx="14"
        fill={HE_MAU.nenSanKhau}
        stroke={HE_MAU.vienNhe}
        strokeWidth={NET_VE_CHUAN}
      />

      {/* Lưới khung tạp chí nhẹ */}
      <rect
        x="24"
        y="24"
        width="338"
        height="162"
        rx="10"
        fill={HE_MAU.nenSanKhauSau}
        fillOpacity="0.65"
        stroke={HE_MAU.hongDao}
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Đường cong chủ đạo theo loại dự án */}
      <path
        d={DUONG_CHUYEN_THEO_LOAI[loai]}
        fill="none"
        stroke={HE_MAU.nhanPhu}
        strokeWidth="2.25"
        strokeLinecap="round"
        className="chuyen-morph"
      />

      {/* Hình khối nhận diện riêng từng dự án nhưng giữ chung nét vẽ */}
      {loai === "tapchi" && (
        <g>
          <rect
            x="52"
            y="46"
            width="104"
            height="118"
            rx="6"
            fill={HE_MAU.nenChinh}
            fillOpacity="0.1"
            stroke={HE_MAU.hongDao}
            strokeWidth={NET_VE_CHUAN}
          />
          <line x1="178" y1="68" x2="324" y2="68" stroke={HE_MAU.chuTrenToi} strokeWidth={NET_VE_CHUAN} strokeLinecap="round" />
          <line x1="178" y1="94" x2="292" y2="94" stroke={HE_MAU.hongDao} strokeWidth={NET_VE_CHUAN} strokeLinecap="round" />
        </g>
      )}

      {loai === "amnhac" && (
        <g>
          <circle
            cx="193"
            cy="105"
            r="52"
            fill={HE_MAU.nhanChinh}
            fillOpacity="0.32"
            stroke={HE_MAU.chuTrenToi}
            strokeWidth={NET_VE_CHUAN}
          />
          <circle cx="193" cy="105" r="18" fill={HE_MAU.nhanChinh} stroke={HE_MAU.hongDao} strokeWidth={NET_VE_CHUAN} />
          <circle cx="193" cy="105" r="4" fill={HE_MAU.nenChinh} />
        </g>
      )}

      {loai === "dongbo" && (
        <g>
          <rect x="64" y="64" width="76" height="82" rx="10" fill={HE_MAU.nhanChinh} fillOpacity="0.28" stroke={HE_MAU.hongDao} strokeWidth={NET_VE_CHUAN} />
          <rect x="155" y="54" width="76" height="102" rx="10" fill={HE_MAU.nhanPhu} fillOpacity="0.2" stroke={HE_MAU.chuTrenToi} strokeWidth={NET_VE_CHUAN} />
          <rect x="246" y="64" width="76" height="82" rx="10" fill={HE_MAU.nhanChinh} fillOpacity="0.28" stroke={HE_MAU.hongDao} strokeWidth={NET_VE_CHUAN} />
        </g>
      )}

      {loai === "nhiepanh" && (
        <g>
          <rect x="86" y="42" width="214" height="126" rx="12" fill="none" stroke={HE_MAU.hongDao} strokeWidth={NET_VE_CHUAN} />
          <circle cx="193" cy="105" r="38" fill={HE_MAU.nhanPhu} fillOpacity="0.18" stroke={HE_MAU.chuTrenToi} strokeWidth={NET_VE_CHUAN} />
          <circle cx="193" cy="105" r="12" fill={HE_MAU.nhanChinh} stroke={HE_MAU.chuTrenToi} strokeWidth={NET_VE_CHUAN} />
        </g>
      )}
    </svg>
  );
}
