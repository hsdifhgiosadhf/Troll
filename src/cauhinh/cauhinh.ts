import { z } from "zod";

const KhuonCauHinh = z.object({
  tenHienThi: z.string().min(1),
  tieuDePhu: z.string().min(1),
  vaiTro: z.string().min(1),
  thanhPho: z.string().min(1),
  emailLienHe: z.email(),
  lienKetGithub: z.url(),
  duongDanCv: z.string().min(1),
});

export type CauHinhTrang = z.infer<typeof KhuonCauHinh>;

const DU_LIEU_CAU_HINH_THO = {
  tenHienThi: "Thành Hoàng",
  tieuDePhu: "Écoute chérie · Hồ sơ",
  vaiTro: "Thiết kế giao diện & Phát triển Frontend (React · SVG)",
  thanhPho: "Việt Nam · Làm việc từ xa",
  emailLienHe: "thanhhoang.studio@example.com",
  lienKetGithub: "https://github.com",
  duongDanCv: "tailieu/cv-thanh-hoang.pdf",
};

export const CAU_HINH_TRANG: CauHinhTrang = KhuonCauHinh.parse(DU_LIEU_CAU_HINH_THO);
