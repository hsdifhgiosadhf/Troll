import type { ReactElement } from "react";
import { CAU_HINH_TRANG } from "@/cauhinh/cauhinh";
import { KhungMuc } from "@/dungchung/giaodien/KhungMuc";
import { NutBam } from "@/dungchung/giaodien/NutBam";
import { TieuDeMuc } from "@/dungchung/giaodien/TieuDeMuc";
import { BieuTuongHeThong } from "@/dungchung/minhhoa/BieuTuongHeThong";
import { useLienHe } from "@/tinhnang/lienhe/moc/useLienHe";

/** Ô Bento Liên hệ nhanh kiểu hộp nhắn tin Discord DM. */
export function MucLienHe(): ReactElement {
  const {
    emailLienHe,
    bieuMau,
    daSanSang,
    dangGui,
    daSaoChepEmail,
    loiTheoTruong,
    ketQuaGui,
    xuLyDoiTruong,
    xuLyGui,
    xuLySaoChepEmail,
  } = useLienHe();

  const nhanNutGui = !daSanSang
    ? "Đang khởi tạo…"
    : dangGui
      ? "Đang tạo thư…"
      : "Tạo thư liên hệ";

  return (
    <KhungMuc id="lien-he" nen="chinh">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <TieuDeMuc
          nhanPhu="Correspondance · Liên hệ"
          tieuDe="Nhắn cho Thành Hoàng"
          moTa={emailLienHe}
        />
        <div className="mb-3 flex flex-wrap gap-2">
          <NutBam
            bienThe="nhe"
            onClick={() => void xuLySaoChepEmail()}
            className="border-[var(--mau-hong-dao)]/40 px-3 py-1 text-[11px] text-[var(--mau-chu-tren-toi)] hover:border-[var(--mau-nhan-phu)] hover:text-[var(--mau-nhan-phu)]"
          >
            <BieuTuongHeThong
              ten={daSaoChepEmail ? "kiemTra" : "saoChep"}
              kichThuoc={13}
            />
            <span>{daSaoChepEmail ? "Đã chép email" : "Sao chép email"}</span>
          </NutBam>
          <NutBam
            href={CAU_HINH_TRANG.lienKetGithub}
            moTabMoi
            bienThe="nhe"
            className="border-[var(--mau-hong-dao)]/40 px-3 py-1 text-[11px] text-[var(--mau-chu-tren-toi)] hover:border-[var(--mau-nhan-phu)] hover:text-[var(--mau-nhan-phu)]"
          >
            <span>GitHub</span>
            <BieuTuongHeThong ten="muiTen" kichThuoc={12} />
          </NutBam>
        </div>
      </div>

      <form noValidate onSubmit={xuLyGui}>
        <fieldset disabled={!daSanSang || dangGui} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="lien-he-ten"
                className="block text-xs font-medium text-[var(--mau-hong-dao)]"
              >
                Họ và tên
              </label>
              <input
                id="lien-he-ten"
                type="text"
                value={bieuMau.hoTen}
                onChange={(e) => xuLyDoiTruong("hoTen", e.target.value)}
                placeholder="Minh Anh"
                aria-invalid={Boolean(loiTheoTruong.hoTen)}
                className="mt-1 w-full rounded-xl border border-[var(--mau-hong-dao)]/30 bg-[var(--mau-nen-san-khau)] px-3 py-2 text-xs text-[var(--mau-chu-tren-toi)] placeholder:text-[var(--mau-hong-dao)]/40 focus:border-[var(--mau-nhan-phu)] focus:outline-none"
              />
              {loiTheoTruong.hoTen && (
                <p role="alert" className="mt-1 text-[11px] font-medium text-[var(--mau-hong-dao)]">
                  {loiTheoTruong.hoTen}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lien-he-email"
                className="block text-xs font-medium text-[var(--mau-hong-dao)]"
              >
                Email của bạn
              </label>
              <input
                id="lien-he-email"
                type="email"
                value={bieuMau.email}
                onChange={(e) => xuLyDoiTruong("email", e.target.value)}
                placeholder="ban@example.com"
                aria-invalid={Boolean(loiTheoTruong.email)}
                className="mt-1 w-full rounded-xl border border-[var(--mau-hong-dao)]/30 bg-[var(--mau-nen-san-khau)] px-3 py-2 text-xs text-[var(--mau-chu-tren-toi)] placeholder:text-[var(--mau-hong-dao)]/40 focus:border-[var(--mau-nhan-phu)] focus:outline-none"
              />
              {loiTheoTruong.email && (
                <p role="alert" className="mt-1 text-[11px] font-medium text-[var(--mau-hong-dao)]">
                  {loiTheoTruong.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lien-he-noidung"
              className="block text-xs font-medium text-[var(--mau-hong-dao)]"
            >
              Lời nhắn
            </label>
            <textarea
              id="lien-he-noidung"
              rows={2}
              value={bieuMau.noiDung}
              onChange={(e) => xuLyDoiTruong("noiDung", e.target.value)}
              placeholder="Gửi lời nhắn nhanh tới Thành Hoàng…"
              aria-invalid={Boolean(loiTheoTruong.noiDung)}
              className="mt-1 w-full rounded-xl border border-[var(--mau-hong-dao)]/30 bg-[var(--mau-nen-san-khau)] px-3 py-2 text-xs text-[var(--mau-chu-tren-toi)] placeholder:text-[var(--mau-hong-dao)]/40 focus:border-[var(--mau-nhan-phu)] focus:outline-none"
            />
            {loiTheoTruong.noiDung && (
              <p role="alert" className="mt-1 text-[11px] font-medium text-[var(--mau-hong-dao)]">
                {loiTheoTruong.noiDung}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <NutBam
              loai="submit"
              bienThe="chinh"
              biKhoa={!daSanSang || dangGui}
              lyDoKhoa={
                !daSanSang
                  ? "Đang khởi tạo biểu mẫu"
                  : dangGui
                    ? "Đang chuẩn bị thư liên hệ"
                    : undefined
              }
              className="px-4 py-1.5 text-xs"
            >
              <BieuTuongHeThong ten="thu" kichThuoc={14} />
              <span>{nhanNutGui}</span>
            </NutBam>

            {ketQuaGui && ketQuaGui.thanhcong && (
              <div role="status" className="flex flex-wrap items-center gap-2 text-xs text-[var(--mau-hong-dao)]">
                <span>{ketQuaGui.thongbao}</span>
                <NutBam href={ketQuaGui.dulieu.mailto} bienThe="phu" className="border-[var(--mau-hong-dao)]/40 px-3 py-1 text-[11px]">
                  <span>Mở ứng dụng gửi thư</span>
                </NutBam>
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </KhungMuc>
  );
}
