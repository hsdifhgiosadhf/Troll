import type { ReactElement } from "react";
import { BieuTuongHeThong } from "@/dungchung/minhhoa/BieuTuongHeThong";
import {
  MinhHoaDiaThan,
  MinhHoaNenSanKhau,
} from "@/dungchung/minhhoa/MinhHoaDiaThan";
import { useGioiThieu } from "@/tinhnang/gioithieu/moc/useGioiThieu";

/**
 * Giao diện 1 thẻ duy nhất giống trang Discord Profile (zyo.lol):
 * - Đã xoá hộp sóng nhạc chữ nhật trong thẻ theo yêu cầu người dùng.
 * - Chiếc đĩa than (MinhHoaDiaThan) vừa quay tròn vừa co giãn hào quang, rãnh đĩa, tâm đĩa và vòng hoa
 *   cùng phông nền (MinhHoaNenSanKhau) chuyển động trực tiếp theo nhịp nhạc ở 60fps.
 * - Tự phát nhạc lặp vô hạn (`autoPlay` + `loop`) và chống spam lượt xem/tim theo mã IP máy.
 */
export function MucGioiThieu(): ReactElement {
  const {
    thongTin,
    dangPhatNhip,
    daThich,
    soLuotThich,
    soLuotXem,
    nguonNhac,
    amThanhRef,
    khungGioiThieuRef,
    xuLyChuyenNhip,
    xuLyBamThich,
  } = useGioiThieu();

  return (
    <section
      id="gioi-thieu"
      ref={khungGioiThieuRef}
      aria-label="Thẻ hồ sơ cá nhân Thành Hoàng"
      className="relative flex w-full flex-col items-center justify-center px-3 py-4 sm:px-6"
    >
      {/* Phông nền toàn màn hình co giãn mặt trời và sóng sông theo nhịp nhạc */}
      <MinhHoaNenSanKhau />

      {/* Thẻ audio chuẩn HTML5 tự phát ngay khi vào trang (autoPlay) và lặp vô hạn (loop) */}
      <audio
        ref={amThanhRef}
        src={nguonNhac}
        autoPlay
        loop
        preload="auto"
        aria-label="Trình phát nhạc lặp Vendredi sur Mer - Écoute chérie"
      />

      {/* Góc trên bên trái: nút Thả tim chống spam theo IP */}
      <div className="fixed top-4 left-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={xuLyBamThich}
          aria-pressed={daThich}
          aria-label="Thả tim hồ sơ Thành Hoàng"
          className={`nut-nhan flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--mau-nen-chinh)]/45 shadow-md backdrop-blur-md ${
            daThich
              ? "bg-[var(--mau-nhan-chinh)] text-[var(--mau-nen-chinh)]"
              : "bg-[var(--mau-nen-chinh)]/30 text-[var(--mau-nhan-chinh)] hover:bg-[var(--mau-nen-chinh)]/45"
          }`}
        >
          <BieuTuongHeThong ten="tim" kichThuoc={19} />
        </button>
      </div>

      {/* THẺ PROFILE DUY NHẤT Ở GIỮA MÀN HÌNH */}
      <div className="relative z-10 w-full max-w-[540px] rounded-[28px] border border-[var(--mau-nen-chinh)]/65 bg-[var(--mau-nen-chinh)]/55 p-5 shadow-2xl backdrop-blur-md sm:p-7">
        {/* Hàng 1: Avatar đĩa than vòng hoa vừa quay vừa nảy theo nhịp nhạc + Tên lớn & Dòng Coder-Graphic Desgin */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="shrink-0">
            <MinhHoaDiaThan dangPhatNhip={dangPhatNhip} />
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h1 className="chu-tieu-de text-4xl leading-none font-bold tracking-wide text-[var(--mau-nen-san-khau)] drop-shadow-sm sm:text-5xl">
              {thongTin.hoTen}
              <span
                aria-hidden="true"
                className="ml-1 inline-block font-normal text-[var(--mau-nhan-chinh)] opacity-75"
              >
                |
              </span>
            </h1>
            <p className="mt-2.5 text-sm font-extrabold tracking-[0.12em] text-[var(--mau-nhan-chinh)] sm:text-base">
              ✦ ꒰ {thongTin.chucDanh} ꒱ ✿ ♡
            </p>
            <p className="mt-1 text-xs font-bold tracking-[0.18em] text-[var(--mau-nen-san-khau)]/80">
              {thongTin.bietDanhNgheThuat} ⋆˚✿˖°
            </p>
          </div>
        </div>

        {/* Hàng 2: Bộ đếm lượt tim và lượt xem chống spam theo IP */}
        <div className="mt-5 flex items-center justify-between px-1 text-xs font-bold text-[var(--mau-nen-san-khau)]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={xuLyBamThich}
              aria-label={`Số lượt thả tim: ${soLuotThich}`}
              className="inline-flex items-center gap-1.5 text-[var(--mau-nhan-chinh)] hover:opacity-80"
            >
              <BieuTuongHeThong ten="tim" kichThuoc={15} />
              <span data-testid="so-luot-thich">{soLuotThich}</span>
            </button>
            <span
              aria-label={`Số lượt xem: ${soLuotXem}`}
              className="inline-flex items-center gap-1.5 text-[var(--mau-nen-san-khau)]/85"
            >
              <BieuTuongHeThong ten="mat" kichThuoc={15} />
              <span data-testid="so-luot-xem">{soLuotXem}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="chu-tieu-de text-sm italic text-[var(--mau-nhan-chinh)]">
              Vendredi sur Mer — Écoute chérie
            </span>
            <button
              type="button"
              onClick={xuLyChuyenNhip}
              aria-label={
                dangPhatNhip ? "Tạm dừng nhịp đĩa than" : "Bật nhịp đĩa than"
              }
              className="nut-nhan flex h-7 w-7 items-center justify-center rounded-full bg-[var(--mau-nhan-chinh)] text-[var(--mau-nen-chinh)] shadow-sm hover:bg-[var(--mau-nhan-chinh-dam)]"
            >
              <BieuTuongHeThong
                ten={dangPhatNhip ? "tamDung" : "phat"}
                kichThuoc={13}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
