import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { capNhatHinhHocSvgTheoNhip } from "@/dungchung/minhhoa/MinhHoaDiaThan";
import {
  bamChuoiDinhDanh,
  capNhatLuotThichTheoIp,
  docTrangThaiDemCucBo,
  dongBoDemLuotTrucTuyen,
  ghiNhanLuotXemTheoIp,
  guiLuotThichLenTrucTuyen,
  KHOA_MA_IP_MAY,
  layMaDinhDanhIpMay,
  luuTrangThaiDemCucBo,
  type TrangThaiDemLuot,
} from "@/tinhnang/gioithieu/dichvu/demluot";
import {
  layDuongDanNhacChinh,
  NHIP_AM_THANH_TINH,
  phanTichPhoTanSo,
  tinhNhipTheoThoiGian,
} from "@/tinhnang/gioithieu/dichvu/taonhacnen";
import { layThongTinGioiThieu } from "@/tinhnang/gioithieu/kho/khogioithieu";
import type { ThongTinGioiThieu } from "@/tinhnang/gioithieu/kieu/gioithieu";

export interface KetQuaHookGioiThieu {
  readonly thongTin: ThongTinGioiThieu;
  readonly dangPhatNhip: boolean;
  readonly daThich: boolean;
  readonly soLuotThich: number;
  readonly soLuotXem: number;
  readonly nguonNhac: string;
  readonly amThanhRef: RefObject<HTMLAudioElement | null>;
  readonly khungGioiThieuRef: RefObject<HTMLElement | null>;
  readonly xuLyChuyenNhip: () => void;
  readonly xuLyBamThich: () => void;
}

function layKhoCucBoAnToan(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch (loi: unknown) {
    void loi;
    return null;
  }
}

function taoDauVanTayTrinhDuyet(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "may-khach-mac-dinh";
  }
  const manHinh = `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`;
  const ngonNgu = navigator.language ?? "vi";
  const nenTang = navigator.userAgent ?? "web";
  return `${nenTang}|${ngonNgu}|${manHinh}`;
}

/**
 * Điều phối thẻ Profile 1 màn hình:
 * - Tự động phát lặp (`autoPlay` + `loop`) bài Vendredi-sur-Mer-Écoute-chérie_009_vbr.mp3 ngay khi vào trang.
 * - Nếu trình duyệt chặn tiếng ở lần tải mới, tự hiện màn chào Parisian 1 chạm giống zyo.lol để mở tiếng ngay lập tức.
 * - Lưu lượt xem & lượt tim chống spam theo mã IP máy.
 * - Cập nhật trực tiếp hình học SVG (`height`, `y`, `r`, `d`) qua requestAnimationFrame (0 lần render lại React/giây).
 */
export function useGioiThieu(): KetQuaHookGioiThieu {
  const thongTin = useMemo(() => layThongTinGioiThieu(), []);
  const nguonNhac = useMemo(() => layDuongDanNhacChinh(), []);

  const [dangPhatNhip, setDangPhatNhip] = useState(true);
  const [trangThaiDem, setTrangThaiDem] = useState<TrangThaiDemLuot>(() =>
    docTrangThaiDemCucBo(layKhoCucBoAnToan()),
  );

  const amThanhRef = useRef<HTMLAudioElement | null>(null);
  const khungGioiThieuRef = useRef<HTMLElement | null>(null);
  const maIpRef = useRef<string>(
    layKhoCucBoAnToan()?.getItem(KHOA_MA_IP_MAY) ??
      bamChuoiDinhDanh(taoDauVanTayTrinhDuyet()),
  );
  const nguoiDungChuDongTamDungRef = useRef(false);
  const boPhanTichRef = useRef<AnalyserNode | null>(null);
  const nguCanhAmThanhRef = useRef<AudioContext | null>(null);
  const daKetNoiNguonRef = useRef(false);

  // Ghi nhận lượt xem chống trùng theo IP máy và đồng bộ đám mây trên GitHub Pages
  useEffect(() => {
    const khoCucBo = layKhoCucBoAnToan();
    const maIpBanDau = maIpRef.current;
    const { trangThai, laLuotXemMoiCuaIp } = ghiNhanLuotXemTheoIp(
      khoCucBo,
      maIpBanDau,
    );
    setTrangThaiDem(trangThai);

    const laTrinhDuyetTuDong =
      typeof navigator !== "undefined" && navigator.webdriver === true;
    if (laTrinhDuyetTuDong) {
      return;
    }

    let daHuy = false;
    const dongBoTheoIp = async (): Promise<void> => {
      const maIpThuc = await layMaDinhDanhIpMay(
        khoCucBo,
        taoDauVanTayTrinhDuyet(),
      );
      maIpRef.current = maIpThuc;

      const capNhatMayChu = await dongBoDemLuotTrucTuyen(
        trangThai,
        laLuotXemMoiCuaIp,
        maIpThuc,
      );
      if (!daHuy) {
        setTrangThaiDem((hienTai) => {
          const hopNhat: TrangThaiDemLuot = {
            ...capNhatMayChu,
            daThich: hienTai.daThich || capNhatMayChu.daThich,
            soLuotXem: Math.max(hienTai.soLuotXem, capNhatMayChu.soLuotXem),
            soLuotThich: Math.max(
              hienTai.soLuotThich,
              capNhatMayChu.soLuotThich,
            ),
          };
          luuTrangThaiDemCucBo(khoCucBo, hopNhat);
          return hopNhat;
        });
      }
    };

    void dongBoTheoIp();
    return () => {
      daHuy = true;
    };
  }, []);

  /**
   * Khởi tạo và nối bộ phân tích phổ tần số CHỈ KHI AudioContext đã mở khoá ("running"),
   * tuyệt đối không nối khi "suspended" để tránh làm mất tiếng tự phát của thẻ <audio>.
   */
  const ketNoiPhanTichKhiSanSang = async (): Promise<void> => {
    const phanTu = amThanhRef.current;
    if (!phanTu || daKetNoiNguonRef.current) return;

    try {
      const LopAudioContext =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!LopAudioContext) return;

      if (!nguCanhAmThanhRef.current) {
        nguCanhAmThanhRef.current = new LopAudioContext();
      }
      const ctx = nguCanhAmThanhRef.current;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      if (ctx.state !== "running" || daKetNoiNguonRef.current) {
        return;
      }

      const boPhanTich = ctx.createAnalyser();
      boPhanTich.fftSize = 64;
      boPhanTich.smoothingTimeConstant = 0.75;

      const nguon = ctx.createMediaElementSource(phanTu);
      nguon.connect(boPhanTich);
      boPhanTich.connect(ctx.destination);

      boPhanTichRef.current = boPhanTich;
      daKetNoiNguonRef.current = true;
    } catch (loi: unknown) {
      void loi;
    }
  };

  const xuLyMoKhoaTieng = (): void => {
    const phanTuAmThanh = amThanhRef.current;
    if (!phanTuAmThanh || nguoiDungChuDongTamDungRef.current) return;

    phanTuAmThanh.loop = true;
    phanTuAmThanh.muted = false;
    phanTuAmThanh.volume = 0.75;
    setDangPhatNhip(true);

    void phanTuAmThanh
      .play()
      .then(() => {
        void ketNoiPhanTichKhiSanSang();
      })
      .catch((loi: unknown) => {
        void loi;
      });
  };

  // Tự động phát nhạc lặp ngay khi vào trang
  useEffect(() => {
    const phanTuAmThanh = amThanhRef.current;
    if (!phanTuAmThanh) return;

    phanTuAmThanh.loop = true;
    phanTuAmThanh.volume = 0.75;

    const thuPhatTuDong = async (): Promise<void> => {
      if (nguoiDungChuDongTamDungRef.current) return;
      try {
        phanTuAmThanh.loop = true;
        phanTuAmThanh.muted = false;
        await phanTuAmThanh.play();
        if (nguoiDungChuDongTamDungRef.current) {
          phanTuAmThanh.pause();
          return;
        }
        setDangPhatNhip(true);
        void ketNoiPhanTichKhiSanSang();
      } catch (loi: unknown) {
        void loi;
      }
    };

    const xuLyKhiSanSangPhat = (): void => {
      if (!nguoiDungChuDongTamDungRef.current && phanTuAmThanh.paused) {
        void thuPhatTuDong();
      }
    };

    phanTuAmThanh.addEventListener("loadedmetadata", xuLyKhiSanSangPhat);
    phanTuAmThanh.addEventListener("loadeddata", xuLyKhiSanSangPhat);
    phanTuAmThanh.addEventListener("canplay", xuLyKhiSanSangPhat);
    phanTuAmThanh.addEventListener("canplaythrough", xuLyKhiSanSangPhat);
    void thuPhatTuDong();

    const moKhoaKhiTuongTacThat = (): void => {
      if (nguoiDungChuDongTamDungRef.current) return;
      if (phanTuAmThanh.paused || phanTuAmThanh.muted) {
        xuLyMoKhoaTieng();
      } else {
        void ketNoiPhanTichKhiSanSang();
      }
    };

    // Bắt ngay ở pha capture để mở tiếng tức thì từ cú nhấp chuột hoặc phím bấm đầu tiên
    document.addEventListener("pointerdown", moKhoaKhiTuongTacThat, {
      capture: true,
      passive: true,
    });
    document.addEventListener("mousedown", moKhoaKhiTuongTacThat, {
      capture: true,
      passive: true,
    });
    document.addEventListener("click", moKhoaKhiTuongTacThat, {
      capture: true,
      passive: true,
    });
    document.addEventListener("touchstart", moKhoaKhiTuongTacThat, {
      capture: true,
      passive: true,
    });
    document.addEventListener("keydown", moKhoaKhiTuongTacThat, {
      capture: true,
    });

    return () => {
      phanTuAmThanh.removeEventListener("loadedmetadata", xuLyKhiSanSangPhat);
      phanTuAmThanh.removeEventListener("loadeddata", xuLyKhiSanSangPhat);
      phanTuAmThanh.removeEventListener("canplay", xuLyKhiSanSangPhat);
      phanTuAmThanh.removeEventListener("canplaythrough", xuLyKhiSanSangPhat);
      document.removeEventListener("pointerdown", moKhoaKhiTuongTacThat, {
        capture: true,
      });
      document.removeEventListener("mousedown", moKhoaKhiTuongTacThat, {
        capture: true,
      });
      document.removeEventListener("click", moKhoaKhiTuongTacThat, {
        capture: true,
      });
      document.removeEventListener("touchstart", moKhoaKhiTuongTacThat, {
        capture: true,
      });
      document.removeEventListener("keydown", moKhoaKhiTuongTacThat, {
        capture: true,
      });
    };
  }, [nguonNhac]);

  // Vòng lặp requestAnimationFrame cập nhật trực tiếp hình học SVG theo nhịp nhạc (0 lần React re-render/giây)
  useEffect(() => {
    const khung = khungGioiThieuRef.current;
    if (!dangPhatNhip) {
      capNhatHinhHocSvgTheoNhip(khung, NHIP_AM_THANH_TINH, false);
      return;
    }

    const mangTanSo = new Uint8Array(32);
    let maKhungHinh = 0;
    let mocCapNhatCuoi = 0;

    const capNhatKhungHinh = (thoiGianMs: number): void => {
      if (thoiGianMs - mocCapNhatCuoi >= 45) {
        mocCapNhatCuoi = thoiGianMs;
        const boPhanTich = boPhanTichRef.current;
        const phanTu = amThanhRef.current;

        if (boPhanTich && phanTu && !phanTu.paused) {
          boPhanTich.getByteFrequencyData(mangTanSo);
          const coTinHieuThat = mangTanSo.some((giaTri) => giaTri > 4);
          if (coTinHieuThat) {
            capNhatHinhHocSvgTheoNhip(
              khungGioiThieuRef.current,
              phanTichPhoTanSo(mangTanSo, 16),
              true,
            );
            maKhungHinh = window.requestAnimationFrame(capNhatKhungHinh);
            return;
          }
        }

        const mocThoiGianGiay =
          phanTu && !phanTu.paused && phanTu.currentTime > 0
            ? phanTu.currentTime
            : thoiGianMs / 1000;
        capNhatHinhHocSvgTheoNhip(
          khungGioiThieuRef.current,
          tinhNhipTheoThoiGian(mocThoiGianGiay, 16),
          true,
        );
      }
      maKhungHinh = window.requestAnimationFrame(capNhatKhungHinh);
    };

    maKhungHinh = window.requestAnimationFrame(capNhatKhungHinh);
    return () => {
      window.cancelAnimationFrame(maKhungHinh);
    };
  }, [dangPhatNhip]);

  const xuLyChuyenNhip = (): void => {
    const phanTuAmThanh = amThanhRef.current;
    const trangThaiMoi = !dangPhatNhip;
    nguoiDungChuDongTamDungRef.current = !trangThaiMoi;
    setDangPhatNhip(trangThaiMoi);

    if (phanTuAmThanh) {
      phanTuAmThanh.loop = true;
      phanTuAmThanh.muted = false;
      if (trangThaiMoi) {
        void phanTuAmThanh.play().catch((loi: unknown) => {
          void loi;
        });
        void ketNoiPhanTichKhiSanSang();
      } else {
        phanTuAmThanh.pause();
      }
    }
  };

  const xuLyBamThich = (): void => {
    const khoCucBo = layKhoCucBoAnToan();
    const maIpHienTai = maIpRef.current;
    const { trangThai: trangThaiMoi, canCongLenMayChu } =
      capNhatLuotThichTheoIp(khoCucBo, trangThaiDem, maIpHienTai);
    setTrangThaiDem(trangThaiMoi);

    const laTrinhDuyetTuDong =
      typeof navigator !== "undefined" && navigator.webdriver === true;
    if (canCongLenMayChu && !laTrinhDuyetTuDong) {
      void guiLuotThichLenTrucTuyen(trangThaiMoi, maIpHienTai).then(
        (daDongBo) => {
          setTrangThaiDem((hienTai) => {
            if (!hienTai.daThich) return hienTai;
            const hopNhat: TrangThaiDemLuot = {
              ...hienTai,
              soLuotThich: Math.max(
                hienTai.soLuotThich,
                daDongBo.soLuotThich,
              ),
              soLuotThichNhoGoc: daDongBo.soLuotThichNhoGoc,
            };
            luuTrangThaiDemCucBo(khoCucBo, hopNhat);
            return hopNhat;
          });
        },
      );
    }
  };

  return {
    thongTin,
    dangPhatNhip,
    daThich: trangThaiDem.daThich,
    soLuotThich: trangThaiDem.soLuotThich,
    soLuotXem: trangThaiDem.soLuotXem,
    nguonNhac,
    amThanhRef,
    khungGioiThieuRef,
    xuLyChuyenNhip,
    xuLyBamThich,
  };
}
