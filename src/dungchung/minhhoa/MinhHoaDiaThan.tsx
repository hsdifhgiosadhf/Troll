import { memo, type ReactElement } from "react";
import { HE_MAU, NET_VE_CHUAN } from "@/dungchung/hemau";

export interface NhipAmThanh {
  readonly bass: number;
  readonly trung: number;
  readonly cao: number;
  readonly phoNhac: readonly number[];
}

export const NHIP_AM_THANH_TINH: NhipAmThanh = {
  bass: 0.12,
  trung: 0.1,
  cao: 0.08,
  phoNhac: Array.from({ length: 16 }, (_, i) =>
    Number((0.18 + 0.08 * Math.sin(i * 0.6)).toFixed(3)),
  ),
};

/**
 * Cập nhật trực tiếp các thuộc tính hình học SVG (`r`, `d`, `transform`, `fill-opacity`)
 * của đĩa than (`MinhHoaDiaThan`) và ảnh bìa nền toàn trang (`MinhHoaNenSanKhau`)
 * ngay trên DOM theo nhịp nhạc 60fps mà KHÔNG gọi React setState (0 lần React re-render/giây).
 */
export function capNhatHinhHocSvgTheoNhip(
  khungGoc: HTMLElement | null,
  nhip: NhipAmThanh,
  dangPhat: boolean,
): void {
  if (!khungGoc) return;

  const bass = dangPhat ? nhip.bass : 0.08;
  const trung = dangPhat ? nhip.trung : 0.06;
  const cao = dangPhat ? nhip.cao : 0.05;

  // 1. Cập nhật đĩa than quay & nảy theo nhịp nhạc (MinhHoaDiaThan)
  const haoQuangDia = khungGoc.querySelector<SVGCircleElement>(
    '[data-svg-role="hao-quang-dia"]',
  );
  if (haoQuangDia) {
    haoQuangDia.setAttribute("r", (94 + bass * 14).toFixed(2));
    haoQuangDia.setAttribute(
      "fill-opacity",
      (dangPhat ? 0.18 + bass * 0.28 : 0.1).toFixed(3),
    );
    haoQuangDia.setAttribute(
      "stroke-opacity",
      (dangPhat ? 0.35 + trung * 0.52 : 0.25).toFixed(3),
    );
  }

  const nhanDia = khungGoc.querySelector<SVGCircleElement>(
    '[data-svg-role="nhan-dia"]',
  );
  if (nhanDia) {
    nhanDia.setAttribute("r", (33 + bass * 10).toFixed(2));
  }

  const vanhDia1 = khungGoc.querySelector<SVGCircleElement>(
    '[data-svg-role="vanh-dia-1"]',
  );
  if (vanhDia1) {
    vanhDia1.setAttribute("r", (64 + trung * 7).toFixed(2));
  }

  const vanhDia2 = khungGoc.querySelector<SVGCircleElement>(
    '[data-svg-role="vanh-dia-2"]',
  );
  if (vanhDia2) {
    vanhDia2.setAttribute("r", (49 + cao * 7).toFixed(2));
  }

  const tyLeHoa = (1 + (dangPhat ? bass * 0.18 : 0)).toFixed(3);
  const hoaDia1 = khungGoc.querySelector<SVGGElement>(
    '[data-svg-role="hoa-dia-1"]',
  );
  if (hoaDia1) {
    hoaDia1.setAttribute(
      "transform",
      `translate(34, 166) scale(${tyLeHoa}) translate(-34, -166)`,
    );
  }
  const hoaDia2 = khungGoc.querySelector<SVGGElement>(
    '[data-svg-role="hoa-dia-2"]',
  );
  if (hoaDia2) {
    hoaDia2.setAttribute(
      "transform",
      `translate(56, 186) scale(${tyLeHoa}) translate(-56, -186)`,
    );
  }

  // 2. Cập nhật mặt trời và sóng sông trên ảnh bìa nền toàn trang (MinhHoaNenSanKhau)
  const matTroiNenLon = khungGoc.querySelector<SVGCircleElement>(
    '[data-svg-role="mat-troi-nen-lon"]',
  );
  if (matTroiNenLon) {
    matTroiNenLon.setAttribute("r", (170 + bass * 32).toFixed(1));
  }

  const matTroiNenNho = khungGoc.querySelector<SVGCircleElement>(
    '[data-svg-role="mat-troi-nen-nho"]',
  );
  if (matTroiNenNho) {
    matTroiNenNho.setAttribute("r", (110 + trung * 22).toFixed(1));
  }

  const doNangSong = dangPhat ? Math.round(bass * 26) : 4;
  const songNen1 = khungGoc.querySelector<SVGPathElement>(
    '[data-svg-role="song-nen-1"]',
  );
  if (songNen1) {
    songNen1.setAttribute(
      "d",
      `M 120 710 Q 340 ${695 - doNangSong}, 560 730 T 980 ${780 - doNangSong}`,
    );
  }
}

interface ThuocTinhMinhHoaDiaThan {
  readonly dangPhatNhip: boolean;
  readonly kichThuocNho?: boolean;
}

/**
 * Ảnh đại diện đĩa than Parisian "Vendredi sur Mer – Écoute chérie":
 * Vừa xoay tròn 33 RPM vừa co giãn hào quang, rãnh đĩa, tâm đĩa và đoá hoa theo nhịp nhạc.
 */
export const MinhHoaDiaThan = memo(function MinhHoaDiaThan({
  dangPhatNhip,
  kichThuocNho = false,
}: ThuocTinhMinhHoaDiaThan): ReactElement {
  return (
    <svg
      viewBox="0 0 220 220"
      role="img"
      data-testid="dia-than-svg-theo-nhac"
      className={`pointer-events-none h-auto w-full select-none ${
        kichThuocNho ? "max-w-[60px]" : "max-w-[128px]"
      }`}
    >
      <title>
        Khung đĩa than Parisian Vendredi sur Mer – Écoute chérie chuyển động theo nhịp nhạc
      </title>

      <circle
        data-svg-role="hao-quang-dia"
        cx="110"
        cy="110"
        r="96"
        fill={HE_MAU.nhanChinh}
        fillOpacity={dangPhatNhip ? "0.24" : "0.1"}
        stroke={HE_MAU.hongDao}
        strokeOpacity={dangPhatNhip ? "0.62" : "0.25"}
        strokeWidth="2.5"
      />

      <circle
        cx="110"
        cy="110"
        r="92"
        fill={HE_MAU.nenSanKhau}
        stroke={HE_MAU.hongDao}
        strokeWidth="2.2"
      />

      <g
        data-testid="nhom-dia-quay"
        className={dangPhatNhip ? "dia-than-dang-quay" : ""}
      >
        <circle
          cx="110"
          cy="110"
          r="82"
          fill={HE_MAU.nenSanKhauSau}
          stroke={HE_MAU.nhanPhu}
          strokeWidth={NET_VE_CHUAN}
        />
        <circle
          data-svg-role="vanh-dia-1"
          cx="110"
          cy="110"
          r="67"
          fill="none"
          stroke={HE_MAU.chuTrenToi}
          strokeOpacity="0.28"
          strokeWidth="1.2"
          strokeDasharray="18 8 34 10"
        />
        <circle
          data-svg-role="vanh-dia-2"
          cx="110"
          cy="110"
          r="53"
          fill="none"
          stroke={HE_MAU.hongDao}
          strokeOpacity="0.48"
          strokeWidth="1.2"
          strokeDasharray="24 10"
        />
        <circle
          data-testid="nhan-dia-theo-nhac"
          data-svg-role="nhan-dia"
          cx="110"
          cy="110"
          r="37"
          fill={HE_MAU.nhanChinh}
          stroke={HE_MAU.hongDao}
          strokeWidth={NET_VE_CHUAN}
        />
        <circle
          cx="110"
          cy="110"
          r="24"
          fill="none"
          stroke={HE_MAU.nhanPhu}
          strokeOpacity="0.85"
          strokeWidth="1"
        />
        <circle cx="110" cy="110" r="8" fill={HE_MAU.nenChinh} />
        <circle cx="110" cy="110" r="3" fill={HE_MAU.nenSanKhauSau} />
      </g>

      {!kichThuocNho && (
        <g>
          <path
            d="M 24 88 C 14 124, 28 166, 62 190 C 82 204, 108 208, 132 202"
            fill="none"
            stroke={HE_MAU.nhanPhu}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <ellipse
            cx="22"
            cy="108"
            rx="9"
            ry="4.5"
            transform="rotate(-48 22 108)"
            fill={HE_MAU.nhanPhu}
          />
          <ellipse
            cx="28"
            cy="144"
            rx="10"
            ry="5"
            transform="rotate(-24 28 144)"
            fill={HE_MAU.nhanPhu}
          />
          <ellipse
            cx="76"
            cy="196"
            rx="10"
            ry="4.5"
            transform="rotate(20 76 196)"
            fill={HE_MAU.nhanPhu}
          />

          <g data-svg-role="hoa-dia-1">
            <circle
              cx="34"
              cy="166"
              r="14"
              fill={HE_MAU.nhanChinh}
              stroke={HE_MAU.nenChinh}
              strokeWidth="1.5"
            />
            <circle cx="34" cy="166" r="8" fill={HE_MAU.hongDao} />
            <circle cx="34" cy="166" r="3" fill={HE_MAU.nenChinh} />
          </g>

          <g data-svg-role="hoa-dia-2">
            <circle
              cx="56"
              cy="186"
              r="12"
              fill={HE_MAU.hongDao}
              stroke={HE_MAU.nhanChinh}
              strokeWidth="1.5"
            />
            <circle cx="56" cy="186" r="5.5" fill={HE_MAU.nhanChinh} />
            <circle cx="56" cy="186" r="2.2" fill={HE_MAU.nenChinh} />
          </g>

          <circle
            cx="22"
            cy="128"
            r="9"
            fill={HE_MAU.hongDao}
            stroke={HE_MAU.nhanChinh}
            strokeWidth="1.4"
          />
          <circle cx="22" cy="128" r="3.5" fill={HE_MAU.nhanChinh} />
          <circle
            cx="94"
            cy="200"
            r="5.5"
            fill={HE_MAU.nenChinh}
            stroke={HE_MAU.nhanPhu}
            strokeWidth="1.2"
          />
          <circle cx="110" cy="203" r="4" fill={HE_MAU.hongDao} />
          <circle
            cx="26"
            cy="84"
            r="4.5"
            fill={HE_MAU.nenChinh}
            stroke={HE_MAU.nhanPhu}
            strokeWidth="1.2"
          />
        </g>
      )}
    </svg>
  );
});

/**
 * Ảnh bìa phông nền toàn màn hình theo phong cách Vendredi sur Mer – Écoute chérie:
 * Mặt trời chiều và sóng sông chuyển động nhẹ nhàng theo nhịp bass qua DOM ref.
 */
export const MinhHoaNenSanKhau = memo(function MinhHoaNenSanKhau(): ReactElement {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none object-cover"
    >
      <defs>
        <linearGradient id="bauTroiEcoute" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={HE_MAU.nhanChinhDam} />
          <stop offset="38%" stopColor={HE_MAU.nhanChinh} />
          <stop offset="74%" stopColor={HE_MAU.hongDao} />
          <stop offset="100%" stopColor={HE_MAU.nenPhu} />
        </linearGradient>
        <radialGradient id="matTroiChieu" cx="72%" cy="32%" r="48%">
          <stop offset="0%" stopColor={HE_MAU.nenChinh} stopOpacity="0.55" />
          <stop offset="45%" stopColor={HE_MAU.nhanPhu} stopOpacity="0.28" />
          <stop offset="100%" stopColor={HE_MAU.nhanChinh} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dongSongChieu" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={HE_MAU.nenSanKhau} stopOpacity="0.55" />
          <stop offset="55%" stopColor={HE_MAU.nhanChinhDam} stopOpacity="0.48" />
          <stop offset="100%" stopColor={HE_MAU.nenSanKhau} stopOpacity="0.65" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#bauTroiEcoute)" />
      <rect width="1440" height="900" fill="url(#matTroiChieu)" />

      <circle
        data-svg-role="mat-troi-nen-lon"
        cx="1040"
        cy="270"
        r="182"
        fill={HE_MAU.nenChinh}
        fillOpacity="0.18"
      />
      <circle
        data-svg-role="mat-troi-nen-nho"
        cx="1040"
        cy="270"
        r="118"
        fill={HE_MAU.nenChinh}
        fillOpacity="0.24"
      />

      <path
        d="M 0 610 C 360 660, 740 730, 1440 820 L 1440 900 L 0 900 Z"
        fill="url(#dongSongChieu)"
      />
      <path
        d="M 0 690 C 340 740, 760 810, 1280 900 L 0 900 Z"
        fill={HE_MAU.hongDao}
        fillOpacity="0.45"
      />

      <path
        data-svg-role="song-nen-1"
        d="M 120 710 Q 340 680, 560 730 T 980 770"
        fill="none"
        stroke={HE_MAU.nenChinh}
        strokeOpacity="0.45"
        strokeWidth="2.2"
      />
      <path
        d="M 260 760 Q 520 755, 780 790 T 1260 845"
        fill="none"
        stroke={HE_MAU.nhanPhu}
        strokeOpacity="0.5"
        strokeWidth="2"
      />

      <path
        d="M 1440 80 C 1220 180, 1040 260, 820 310 M 1260 155 C 1140 260, 990 360, 860 410"
        fill="none"
        stroke={HE_MAU.nenSanKhau}
        strokeOpacity="0.55"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 1440 520 C 1210 500, 980 540, 740 600 M 1180 520 C 1060 440, 940 410, 820 420"
        fill="none"
        stroke={HE_MAU.nenSanKhau}
        strokeOpacity="0.5"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 0 40 C 210 120, 390 220, 540 320 M 240 140 C 310 240, 380 330, 470 390"
        fill="none"
        stroke={HE_MAU.nenSanKhau}
        strokeOpacity="0.45"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <g fill={HE_MAU.nenChinh} fillOpacity="0.82">
        <circle cx="180" cy="110" r="46" />
        <circle cx="230" cy="130" r="38" />
        <circle cx="290" cy="175" r="44" />
        <circle cx="350" cy="230" r="52" />
        <circle cx="420" cy="275" r="40" />
        <circle cx="480" cy="325" r="34" />

        <circle cx="1290" cy="130" r="56" />
        <circle cx="1210" cy="170" r="48" />
        <circle cx="1130" cy="220" r="54" />
        <circle cx="1040" cy="270" r="44" />
        <circle cx="950" cy="300" r="38" />
        <circle cx="860" cy="330" r="32" />

        <circle cx="1320" cy="510" r="54" />
        <circle cx="1230" cy="495" r="46" />
        <circle cx="1140" cy="520" r="50" />
        <circle cx="1030" cy="545" r="42" />
        <circle cx="930" cy="560" r="36" />
        <circle cx="1180" cy="650" r="48" />
        <circle cx="1280" cy="690" r="56" />
        <circle cx="1370" cy="740" r="50" />
      </g>

      <g fill={HE_MAU.hongDao} fillOpacity="0.65">
        <circle cx="205" cy="145" r="32" />
        <circle cx="320" cy="200" r="36" />
        <circle cx="390" cy="260" r="30" />
        <circle cx="1250" cy="150" r="38" />
        <circle cx="1090" cy="245" r="36" />
        <circle cx="990" cy="290" r="28" />
        <circle cx="1270" cy="515" r="36" />
        <circle cx="1080" cy="535" r="34" />
        <circle cx="1230" cy="675" r="38" />
      </g>
    </svg>
  );
});
