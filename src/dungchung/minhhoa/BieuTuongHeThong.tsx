import type { ReactElement } from "react";
import { NET_VE_CHUAN } from "@/dungchung/hemau";

export type TenBieuTuong =
  | "diaThan"
  | "muiTen"
  | "taiXuong"
  | "taiLen"
  | "dong"
  | "saoChep"
  | "kiemTra"
  | "thu"
  | "menu"
  | "songAm"
  | "phat"
  | "tamDung"
  | "loa"
  | "tatLoa"
  | "tim"
  | "mat"
  | "luiBai"
  | "tienBai"
  | "discord";

interface ThuocTinhBieuTuong {
  readonly ten: TenBieuTuong;
  readonly kichThuoc?: number;
  readonly className?: string;
}

/** Bộ biểu tượng SVG đồng nhất nét vẽ 1.75px dùng chung cho toàn bộ trang. */
export function BieuTuongHeThong({
  ten,
  kichThuoc = 18,
  className = "",
}: ThuocTinhBieuTuong): ReactElement {
  const chung = {
    width: kichThuoc,
    height: kichThuoc,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: NET_VE_CHUAN,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: `pointer-events-none ${className}`.trim(),
    "aria-hidden": true as const,
  };

  switch (ten) {
    case "diaThan":
      return (
        <svg {...chung}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5" />
        </svg>
      );
    case "muiTen":
      return (
        <svg {...chung}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "taiXuong":
      return (
        <svg {...chung}>
          <path d="M12 4v11" />
          <path d="m7 11 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
      );
    case "taiLen":
      return (
        <svg {...chung}>
          <path d="M12 16V5" />
          <path d="m7 10 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );
    case "dong":
      return (
        <svg {...chung}>
          <path d="M6 6 18 18" />
          <path d="M18 6 6 18" />
        </svg>
      );
    case "saoChep":
      return (
        <svg {...chung}>
          <rect x="9" y="9" width="10" height="10" rx="2" />
          <path d="M5 15V7a2 2 0 0 1 2-2h8" />
        </svg>
      );
    case "kiemTra":
      return (
        <svg {...chung}>
          <path d="m5 12 4.5 4.5L19 7" />
        </svg>
      );
    case "thu":
      return (
        <svg {...chung}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...chung}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h12" />
        </svg>
      );
    case "songAm":
      return (
        <svg {...chung}>
          <path d="M4 13v-2" />
          <path d="M8 16V8" />
          <path d="M12 19V5" />
          <path d="M16 15V9" />
          <path d="M20 13v-2" />
        </svg>
      );
    case "phat":
      return (
        <svg {...chung}>
          <polygon points="7 5 19 12 7 19 7 5" fill="currentColor" />
        </svg>
      );
    case "tamDung":
      return (
        <svg {...chung}>
          <line x1="9" y1="6" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="18" />
        </svg>
      );
    case "loa":
      return (
        <svg {...chung}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a10 10 0 0 1 0 14" />
        </svg>
      );
    case "tatLoa":
      return (
        <svg {...chung}>
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      );
    case "tim":
      return (
        <svg {...chung}>
          <path
            d="M12 20.5s-7.5-4.35-9.5-9.1C1.1 8.1 3.3 4.5 7 4.5c2.1 0 3.7 1.1 5 2.7 1.3-1.6 2.9-2.7 5-2.7 3.7 0 5.9 3.6 4.5 6.9-2 4.75-9.5 9.1-9.5 9.1Z"
            fill="currentColor"
          />
        </svg>
      );
    case "mat":
      return (
        <svg {...chung}>
          <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case "luiBai":
      return (
        <svg {...chung}>
          <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" />
          <line x1="5" y1="19" x2="5" y2="5" />
        </svg>
      );
    case "tienBai":
      return (
        <svg {...chung}>
          <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      );
    case "discord":
      return (
        <svg {...chung}>
          <rect x="3" y="6" width="18" height="12" rx="6" fill="currentColor" fillOpacity="0.22" />
          <circle cx="9" cy="12" r="1.5" fill="currentColor" />
          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          <path d="M7.5 6.5 9 4.5M16.5 6.5 15 4.5" />
        </svg>
      );
  }
}
