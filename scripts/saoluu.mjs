#!/usr/bin/env node
// Sao lưu cả dự án bằng cách chép thư mục và kiểm tra ngân sách dung lượng (< 100 MB).
// Chỉ dùng thư viện có sẵn của Node.
//
//   node scripts/saoluu.mjs tao truoc "<noi dung>"    sao lưu trước khi bắt đầu nhiệm vụ
//   node scripts/saoluu.mjs tao moc "<noi dung>"      kiểm tra < 100 MB + kiemtratatca, xanh mới sao lưu
//   node scripts/saoluu.mjs kiemtradungluong          đo dung lượng dự án và bản dựng dist/ (< 100 MB)
//   node scripts/saoluu.mjs ds                        liệt kê các bản sao lưu
//   node scripts/saoluu.mjs sosanh <ten-ban>          file nào khác giữa dự án hiện tại và bản đó
//   node scripts/saoluu.mjs khoiphuc <ten-ban> [file...] [--dongy]
//   node scripts/saoluu.mjs tungfile <file> [--khoiphuc <so>] [--dongy]
//   node scripts/saoluu.mjs ghim <ten-ban> | boghim <ten-ban>
//   node scripts/saoluu.mjs don                       dọn bản cũ (giữ 10 bản, giữ 30 ngày từng file)
//
// Thư mục chứa bản sao lưu mặc định: ../backup-webbanthan/ (đổi bằng biến môi trường SAOLUU_THUMUC)

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEN_THU_MUC_SAO_LUU = "backup-webbanthan";
const THU_MUC_SAO_LUU = path.resolve(process.env.SAOLUU_THUMUC || path.join(path.dirname(GOC), TEN_THU_MUC_SAO_LUU));
const LENH_KIEM_TRA = process.env.SAOLUU_LENH_KIEMTRA || "npm run kiemtratatca";

const SO_BAN_GIU_LAI = 10;
const SO_NGAY_GIU_TUNG_FILE = 30;
const MS_MOT_NGAY = 24 * 60 * 60 * 1000;

const GIOI_HAN_DU_AN_BYTES = 100 * 1024 * 1024; // 100 MB
const GIOI_HAN_CANH_BAO_BYTES = 50 * 1024 * 1024; // 50 MB cảnh báo sớm
const GIOI_HAN_FILE_DON_LE_BYTES = 10 * 1024 * 1024; // 10 MB cho 1 file âm thanh/tài nguyên đơn lẻ

const TEN_FILE_DANH_SACH = ".danhsach.json";
const TEN_FILE_THONG_TIN = "THONGTIN.md";
const TEN_FILE_GHIM = "GHIM";
const FILE_LICH_SU = path.join(GOC, "docs", "lichsusaoluu.md");
const THU_MUC_TUNG_FILE = path.join(GOC, ".saoluu", "tungfile");
const LOAI_HOP_LE = ["truoc", "moc", "truoc-khoi-phuc"];

// Sổ ghi chép không bao giờ bị ghi đè khi khôi phục cả dự án.
const SO_GHI_CHEP = ["GEMINI.md", "docs/nhatkyloi.md", "docs/PHIENBAN.md", "docs/lichsusaoluu.md", "docs/nhiemvu.md"];
const THU_MUC_SO_GHI_CHEP = [".agents/"];

const THU_MUC_LOAI_TRU = new Set([
  "node_modules",
  "dist",
  "out",
  "build",
  "coverage",
  "playwright-report",
  "test-results",
  ".turbo",
  ".vercel",
  ".saoluu",
  ".git",
]);
const THU_MUC_BO_QUA_DO_TONG = new Set(["node_modules", ".saoluu", ".git"]);
const FILE_LOAI_TRU = new Set([".DS_Store", "Thumbs.db"]);

// ---------------- tiện ích ----------------

function bao(thongDiep) {
  process.stdout.write(`${thongDiep}\n`);
}

function dung(thongDiep, ma = 1) {
  process.stderr.write(`LỖI: ${thongDiep}\n`);
  process.exit(ma);
}

function so(n, d = 2) {
  return String(n).padStart(d, "0");
}

function ngayGio(ngay = new Date()) {
  return {
    ngay: `${ngay.getFullYear()}-${so(ngay.getMonth() + 1)}-${so(ngay.getDate())}`,
    gio: `${so(ngay.getHours())}${so(ngay.getMinutes())}${so(ngay.getSeconds())}`,
    hienThi: `${ngay.getFullYear()}-${so(ngay.getMonth() + 1)}-${so(ngay.getDate())} ${so(ngay.getHours())}:${so(ngay.getMinutes())}:${so(ngay.getSeconds())}`,
  };
}

function dinhDangMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function dinhDangKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function boDau(chuoi) {
  return chuoi
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function taoSlug(chuoi) {
  const slug = boDau(chuoi).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.slice(0, 60) || "khong-ten";
}

function bamSha(duongDan) {
  return crypto.createHash("sha256").update(fs.readFileSync(duongDan)).digest("hex");
}

function laFileBiLoaiTru(ten) {
  if (FILE_LOAI_TRU.has(ten)) return true;
  if (/^\.env(\..+)?$/i.test(ten) && ten.toLowerCase() !== ".env.example") return true;
  return false;
}

function docLoaiTruThem() {
  const p = path.join(GOC, ".saoluuloaitru");
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .map((d) => d.trim())
    .filter((d) => d && !d.startsWith("#"));
}

const LOAI_TRU_THEM = docLoaiTruThem();

function biLoaiTruTheoDuongDan(tuongDoi) {
  const chuan = tuongDoi.split(path.sep).join("/");
  return LOAI_TRU_THEM.some((m) => chuan === m || chuan.startsWith(`${m.replace(/\/$/, "")}/`));
}

function duyetFile(thuMucGoc, { boQuaLoaiTru }) {
  const ketQua = [];
  const thamDo = (thuMuc) => {
    for (const muc of fs.readdirSync(thuMuc, { withFileTypes: true })) {
      const tuyetDoi = path.join(thuMuc, muc.name);
      const tuongDoi = path.relative(thuMucGoc, tuyetDoi);
      if (boQuaLoaiTru) {
        if (muc.isDirectory() && THU_MUC_LOAI_TRU.has(muc.name)) continue;
        if (!muc.isDirectory() && laFileBiLoaiTru(muc.name)) continue;
        if (biLoaiTruTheoDuongDan(tuongDoi)) continue;
      }
      if (muc.isDirectory()) thamDo(tuyetDoi);
      else if (muc.isFile() || muc.isSymbolicLink()) ketQua.push(tuongDoi);
    }
  };
  thamDo(thuMucGoc);
  return ketQua.sort();
}

function thongKeThuMuc(thuMucGoc, { boQuaTap = new Set() } = {}) {
  const danhSach = [];
  let tongBytes = 0;
  if (!fs.existsSync(thuMucGoc)) return { tongBytes: 0, danhSach: [] };

  const duyet = (thuMuc) => {
    for (const muc of fs.readdirSync(thuMuc, { withFileTypes: true })) {
      const tuyetDoi = path.join(thuMuc, muc.name);
      if (muc.isDirectory()) {
        if (boQuaTap.has(muc.name)) continue;
        duyet(tuyetDoi);
      } else if (muc.isFile()) {
        const size = fs.statSync(tuyetDoi).size;
        tongBytes += size;
        danhSach.push({ duongDan: path.relative(thuMucGoc, tuyetDoi), size });
      }
    }
  };
  duyet(thuMucGoc);
  danhSach.sort((a, b) => b.size - a.size);
  return { tongBytes, danhSach };
}

function lapDanhSachBam(thuMucGoc, dsFile) {
  const ds = {};
  for (const tuongDoi of dsFile) {
    const p = path.join(thuMucGoc, tuongDoi);
    const st = fs.lstatSync(p);
    ds[tuongDoi] = st.isSymbolicLink()
      ? { lienKet: fs.readlinkSync(p), kichThuoc: 0 }
      : { sha256: bamSha(p), kichThuoc: st.size };
  }
  return ds;
}

function laSoGhiChep(tuongDoi) {
  const chuan = tuongDoi.split(path.sep).join("/");
  return SO_GHI_CHEP.includes(chuan) || THU_MUC_SO_GHI_CHEP.some((t) => chuan.startsWith(t));
}

function giongNhau(a, b) {
  if (!a || !b) return false;
  if (a.lienKet !== undefined || b.lienKet !== undefined) return a.lienKet === b.lienKet;
  return a.sha256 === b.sha256;
}

function soSanhDanhSach(cu, moi) {
  const them = [];
  const sua = [];
  const xoa = [];
  for (const [p, tt] of Object.entries(moi)) {
    if (!(p in cu)) them.push(p);
    else if (!giongNhau(cu[p], tt)) sua.push(p);
  }
  for (const p of Object.keys(cu)) if (!(p in moi)) xoa.push(p);
  return { them, sua, xoa };
}

function chepFile(nguon, dich) {
  fs.mkdirSync(path.dirname(dich), { recursive: true });
  const st = fs.lstatSync(nguon);
  if (st.isSymbolicLink()) {
    if (fs.existsSync(dich) || fs.lstatSync(dich, { throwIfNoEntry: false })) fs.rmSync(dich, { force: true });
    fs.symlinkSync(fs.readlinkSync(nguon), dich);
    return;
  }
  fs.copyFileSync(nguon, dich);
  fs.utimesSync(dich, st.atime, st.mtime);
}

function docPhienBan() {
  try {
    const goi = JSON.parse(fs.readFileSync(path.join(GOC, "package.json"), "utf8"));
    return typeof goi.version === "string" ? goi.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}

// ---------------- danh sách bản sao lưu ----------------

function cacBanSaoLuu() {
  if (!fs.existsSync(THU_MUC_SAO_LUU)) return [];
  const ketQua = [];
  for (const ten of fs.readdirSync(THU_MUC_SAO_LUU)) {
    const thuMuc = path.join(THU_MUC_SAO_LUU, ten);
    const fileDs = path.join(thuMuc, TEN_FILE_DANH_SACH);
    if (!ten.startsWith("duan-v") || !fs.existsSync(fileDs)) continue;
    try {
      const duLieu = JSON.parse(fs.readFileSync(fileDs, "utf8"));
      ketQua.push({
        ten,
        thuMuc,
        ...duLieu.thongTin,
        cacFile: duLieu.cacFile,
        ghim: fs.existsSync(path.join(thuMuc, TEN_FILE_GHIM)),
      });
    } catch {
      bao(`Cảnh báo: bỏ qua ${ten} vì ${TEN_FILE_DANH_SACH} bị hỏng.`);
    }
  }
  return ketQua.sort((a, b) => String(a.thoiDiem).localeCompare(String(b.thoiDiem)));
}

function timBan(ten) {
  const ds = cacBanSaoLuu();
  const ban = ds.find((b) => b.ten === ten) ?? ds.filter((b) => b.ten.includes(ten)).at(-1);
  if (!ban) dung(`Không tìm thấy bản sao lưu "${ten}". Chạy: node scripts/saoluu.mjs ds`);
  return ban;
}

function ghiLichSu(dong) {
  fs.mkdirSync(path.dirname(FILE_LICH_SU), { recursive: true });
  if (!fs.existsSync(FILE_LICH_SU)) {
    fs.writeFileSync(
      FILE_LICH_SU,
      "# LỊCH SỬ SAO LƯU\n\n> Tự động ghi bởi `scripts/saoluu.mjs`. Không sửa tay.\n\n| Thời điểm | Bản sao lưu | Loại | Phiên bản | Kiểm tra | Thêm/Sửa/Xoá | Nội dung |\n|---|---|---|---|---|---|---|\n",
    );
  }
  fs.appendFileSync(FILE_LICH_SU, `${dong}\n`);
}

// ---------------- kiểm tra dung lượng (< 100 MB) ----------------

function kiemTraDungLuong({ thoatKhiLoi = true } = {}) {
  const duAn = thongKeThuMuc(GOC, { boQuaTap: THU_MUC_BO_QUA_DO_TONG });
  const thuMucDist = fs.existsSync(path.join(GOC, "dist"))
    ? path.join(GOC, "dist")
    : fs.existsSync(path.join(GOC, "out"))
      ? path.join(GOC, "out")
      : null;
  const dist = thuMucDist ? thongKeThuMuc(thuMucDist) : null;

  bao("=== KIỂM TRA NGÂN SÁCH DUNG LƯỢNG (< 100 MB) ===");
  bao(`- Dự án (trừ node_modules, .saoluu, .git): ${dinhDangMb(duAn.tongBytes)} / 100.00 MB (${duAn.danhSach.length} file)`);
  if (dist) {
    bao(`- Bản dựng (${path.basename(thuMucDist)}/): ${dinhDangMb(dist.tongBytes)} / 100.00 MB (${dist.danhSach.length} file)`);
  } else {
    bao("- Bản dựng (dist/ hoặc out/): chưa tồn tại (chỉ đo phần mã nguồn hiện có)");
  }

  const top5 = duAn.danhSach.slice(0, 5);
  if (top5.length > 0) {
    bao("- Top file lớn nhất trong dự án:");
    for (const f of top5) {
      bao(`    • ${f.duongDan}: ${dinhDangKb(f.size)}`);
    }
  }

  const loi = [];
  if (duAn.tongBytes >= GIOI_HAN_DU_AN_BYTES) {
    loi.push(`Tổng dung lượng dự án (${dinhDangMb(duAn.tongBytes)}) chạm hoặc vượt giới hạn 100 MB.`);
  }
  if (dist && dist.tongBytes >= GIOI_HAN_DU_AN_BYTES) {
    loi.push(`Bản dựng ${path.basename(thuMucDist)}/ (${dinhDangMb(dist.tongBytes)}) chạm hoặc vượt giới hạn 100 MB cho GitHub Pages.`);
  }
  const fileQuaLon = duAn.danhSach.filter((f) => f.size > GIOI_HAN_FILE_DON_LE_BYTES);
  if (fileQuaLon.length > 0) {
    loi.push(`Có ${fileQuaLon.length} file đơn lẻ vượt 5 MB: ${fileQuaLon.map((f) => `${f.duongDan} (${dinhDangMb(f.size)})`).join(", ")}`);
  }

  if (duAn.tongBytes >= GIOI_HAN_CANH_BAO_BYTES && duAn.tongBytes < GIOI_HAN_DU_AN_BYTES) {
    bao(`[CẢNH BÁO] Dự án đã dùng ${dinhDangMb(duAn.tongBytes)} (>= 50 MB). Nên rà soát nén ảnh/tài nguyên.`);
  }
  if (dist && dist.tongBytes >= GIOI_HAN_CANH_BAO_BYTES && dist.tongBytes < GIOI_HAN_DU_AN_BYTES) {
    bao(`[CẢNH BÁO] Bản dựng đã dùng ${dinhDangMb(dist.tongBytes)} (>= 50 MB). Nên rà soát tối ưu gói tĩnh.`);
  }

  if (loi.length > 0) {
    for (const tb of loi) process.stderr.write(`LỖI DUNG LƯỢNG: ${tb}\n`);
    if (thoatKhiLoi) process.exit(1);
    return false;
  }

  bao("KẾT QUẢ DUNG LƯỢNG: ĐẠT (< 100 MB)");
  return true;
}

// ---------------- các lệnh chính ----------------

function lenhTao(loai, noiDung, { boQuaDon = false } = {}) {
  if (!LOAI_HOP_LE.includes(loai)) dung('Loại phải là "truoc" hoặc "moc". Ví dụ: node scripts/saoluu.mjs tao truoc "them muc du an"');
  if (!noiDung) dung('Thiếu nội dung. Ví dụ: node scripts/saoluu.mjs tao truoc "them muc du an"');

  let ketQuaKiemTra = "chưa chạy (bản trước nhiệm vụ)";
  if (loai === "moc") {
    kiemTraDungLuong({ thoatKhiLoi: true });
    bao(`Đang chạy kiểm tra: ${LENH_KIEM_TRA}`);
    const chay = spawnSync(LENH_KIEM_TRA, { cwd: GOC, stdio: "inherit", shell: true });
    if (chay.status !== 0) {
      dung(`Kiểm tra KHÔNG xanh (mã thoát ${chay.status}). Không tạo bản sao lưu mốc. Sửa cho xanh rồi chạy lại.`);
    }
    ketQuaKiemTra = `XANH (< 100 MB) — ${LENH_KIEM_TRA}`;
  }

  const bayGio = new Date();
  const { ngay, gio, hienThi } = ngayGio(bayGio);
  const phienBan = docPhienBan();
  const tenBan = `duan-v${phienBan}-${ngay}-${gio}-${loai}-${taoSlug(noiDung)}`;
  const dich = path.join(THU_MUC_SAO_LUU, tenBan);
  if (fs.existsSync(dich)) dung(`Bản ${tenBan} đã tồn tại.`);

  bao(`Đang chép dự án vào ${dich}`);
  const dsFile = duyetFile(GOC, { boQuaLoaiTru: true });
  for (const tuongDoi of dsFile) chepFile(path.join(GOC, tuongDoi), path.join(dich, tuongDoi));

  const danhSachMoi = lapDanhSachBam(GOC, dsFile);
  const banTruoc = cacBanSaoLuu().at(-1);
  const khac = banTruoc ? soSanhDanhSach(banTruoc.cacFile ?? {}, danhSachMoi) : { them: Object.keys(danhSachMoi), sua: [], xoa: [] };

  const thongTin = {
    thoiDiem: bayGio.toISOString(),
    hienThi,
    loai,
    phienBan,
    noiDung,
    ketQuaKiemTra,
    banTruoc: banTruoc?.ten ?? null,
    soFile: dsFile.length,
  };
  fs.writeFileSync(path.join(dich, TEN_FILE_DANH_SACH), JSON.stringify({ thongTin, cacFile: danhSachMoi }, null, 2));

  const lietKe = (tieuDe, ds) => `### ${tieuDe} (${ds.length})\n${ds.length ? ds.map((p) => `- ${p}`).join("\n") : "- (không có)"}\n`;
  fs.writeFileSync(
    path.join(dich, TEN_FILE_THONG_TIN),
    [
      `# ${tenBan}`,
      "",
      `- Thời điểm: ${hienThi}`,
      `- Loại: ${loai === "moc" ? "MỐC (đã kiểm tra xanh)" : loai === "truoc" ? "TRƯỚC NHIỆM VỤ" : "TRƯỚC KHI KHÔI PHỤC"}`,
      `- Phiên bản: ${phienBan}`,
      `- Nội dung: ${noiDung}`,
      `- Kết quả kiểm tra: ${ketQuaKiemTra}`,
      `- So với bản trước: ${banTruoc?.ten ?? "(đây là bản đầu tiên)"}`,
      `- Số file: ${dsFile.length}`,
      "- Không chứa: node_modules, dist, out, .saoluu, file .env thật",
      "",
      "## Thay đổi so với bản trước",
      lietKe("Thêm", khac.them),
      lietKe("Sửa", khac.sua),
      lietKe("Xoá", khac.xoa),
    ].join("\n"),
  );

  ghiLichSu(
    `| ${hienThi} | \`${tenBan}\` | ${loai} | ${phienBan} | ${loai === "moc" ? "xanh" : "—"} | ${khac.them.length}/${khac.sua.length}/${khac.xoa.length} | ${noiDung.replace(/\|/g, "/")} |`,
  );

  bao(`ĐÃ SAO LƯU: ${tenBan}`);
  bao(`  ${dsFile.length} file. So với bản trước: thêm ${khac.them.length}, sửa ${khac.sua.length}, xoá ${khac.xoa.length}.`);
  if (!boQuaDon) lenhDon();
  return tenBan;
}

function lenhDs() {
  const ds = cacBanSaoLuu();
  if (ds.length === 0) {
    bao(`Chưa có bản sao lưu nào trong ${THU_MUC_SAO_LUU}`);
    return;
  }
  bao(`Thư mục: ${THU_MUC_SAO_LUU}`);
  for (const b of ds) {
    bao(`${b.ghim ? "[GHIM] " : "       "}${b.ten}`);
    bao(`         ${b.hienThi} | ${b.loai} | v${b.phienBan} | ${b.soFile} file | kiểm tra: ${b.ketQuaKiemTra}`);
  }
}

function lenhSoSanh(ten) {
  if (!ten) dung("Thiếu tên bản. Ví dụ: node scripts/saoluu.mjs sosanh duan-v0.1.0-...");
  const ban = timBan(ten);
  const hienTai = lapDanhSachBam(GOC, duyetFile(GOC, { boQuaLoaiTru: true }));
  const khac = soSanhDanhSach(ban.cacFile ?? {}, hienTai);
  bao(`So sánh dự án hiện tại với ${ban.ten}`);
  bao(`  File mới có ở hiện tại (${khac.them.length}): ${khac.them.join(", ") || "không"}`);
  bao(`  File đã đổi nội dung  (${khac.sua.length}): ${khac.sua.join(", ") || "không"}`);
  bao(`  File đã mất so với bản (${khac.xoa.length}): ${khac.xoa.join(", ") || "không"}`);
  bao("Xem chi tiết một file: diff -u <thu-muc-ban>/<file> <file>");
}

function lenhKhoiPhuc(ten, cacFileChon, dongY) {
  if (!ten) dung("Thiếu tên bản. Ví dụ: node scripts/saoluu.mjs khoiphuc duan-v0.1.0-... [file...] --dongy");
  const ban = timBan(ten);
  const trongBan = ban.cacFile ?? {};
  const hienTai = lapDanhSachBam(GOC, duyetFile(GOC, { boQuaLoaiTru: true }));
  const khac = soSanhDanhSach(trongBan, hienTai);

  let canChep;
  let canDoi = [];
  if (cacFileChon.length > 0) {
    const chuanHoa = cacFileChon.map((f) => path.relative(GOC, path.resolve(GOC, f)));
    const khongCo = chuanHoa.filter((f) => !(f in trongBan));
    if (khongCo.length) dung(`Bản ${ban.ten} không có: ${khongCo.join(", ")}`);
    canChep = chuanHoa.filter((f) => !giongNhau(trongBan[f], hienTai[f]));
  } else {
    canChep = [...khac.sua, ...khac.xoa].filter((f) => !laSoGhiChep(f));
    canDoi = khac.them.filter((f) => !laSoGhiChep(f));
  }
  const giuNguyen = cacFileChon.length > 0 ? [] : [...khac.sua, ...khac.xoa, ...khac.them].filter(laSoGhiChep);

  bao(`KẾ HOẠCH KHÔI PHỤC từ ${ban.ten}`);
  bao(`  Ghi đè / lấy lại ${canChep.length} file: ${canChep.join(", ") || "không"}`);
  bao(`  Dời ra .saoluu/thua-*/ ${canDoi.length} file không có trong bản: ${canDoi.join(", ") || "không"}`);
  if (giuNguyen.length) {
    bao(`  GIỮ NGUYÊN ${giuNguyen.length} sổ ghi chép (không quay ngược): ${giuNguyen.join(", ")}`);
    bao("  Muốn lấy lại sổ nào thì ghi tên file đó cụ thể sau tên bản.");
  }
  if (canChep.length === 0 && canDoi.length === 0) {
    bao("Không có gì khác. Không làm gì.");
    return;
  }
  if (!dongY) {
    bao("CHƯA LÀM GÌ. Đây chỉ là kế hoạch. Hỏi người dùng, được đồng ý thì chạy lại lệnh với --dongy");
    return;
  }

  const banAnToan = lenhTao("truoc-khoi-phuc", `ve ban ${ban.hienThi}`, { boQuaDon: true });
  const { ngay, gio } = ngayGio();
  const thuMucThua = path.join(GOC, ".saoluu", `thua-${ngay}-${gio}`);
  for (const f of canDoi) {
    const dich = path.join(thuMucThua, f);
    fs.mkdirSync(path.dirname(dich), { recursive: true });
    fs.renameSync(path.join(GOC, f), dich);
  }
  for (const f of canChep) chepFile(path.join(ban.thuMuc, f), path.join(GOC, f));
  bao(`ĐÃ KHÔI PHỤC ${canChep.length} file từ ${ban.ten}.`);
  if (canDoi.length) bao(`Đã dời ${canDoi.length} file thừa vào ${path.relative(GOC, thuMucThua)}/ (không xoá).`);
  bao(`Muốn quay lại trạng thái ngay trước khi khôi phục: dùng bản ${banAnToan}`);
  bao("Lưu ý: node_modules không được khôi phục. Nếu package.json đổi, chạy npm ci --no-bin-links.");
}

function cacBanCuaFile(tuongDoi) {
  const thuMuc = path.join(THU_MUC_TUNG_FILE, `${tuongDoi}.cacban`);
  if (!fs.existsSync(thuMuc)) return [];
  return fs
    .readdirSync(thuMuc)
    .filter((t) => t.endsWith(".ban"))
    .sort()
    .map((t) => path.join(thuMuc, t));
}

function lenhTungFile(file, soChon, dongY) {
  if (!file) dung("Thiếu đường dẫn file. Ví dụ: node scripts/saoluu.mjs tungfile src/tinhnang/duan/giaodien/TheDuAn.tsx");
  const tuongDoi = path.relative(GOC, path.resolve(GOC, file));
  const cacBan = cacBanCuaFile(tuongDoi);
  if (cacBan.length === 0) {
    bao(`Chưa có bản sao lưu từng file nào cho ${tuongDoi}.`);
    return;
  }
  if (soChon === undefined) {
    bao(`Các bản cũ của ${tuongDoi} (mới nhất ở dưới):`);
    cacBan.forEach((p, i) => bao(`  [${i + 1}] ${path.basename(p, ".ban")}  ${fs.statSync(p).size} byte  ${path.relative(GOC, p)}`));
    bao("Xem khác nhau: diff -u <duong-dan-ban> <file>   |   Lấy lại: thêm --khoiphuc <so>");
    return;
  }
  const chiSo = Number(soChon) - 1;
  const ban = cacBan[chiSo];
  if (!Number.isInteger(chiSo) || !ban) dung(`Số bản không hợp lệ. Chọn từ 1 đến ${cacBan.length}.`);
  bao(`KẾ HOẠCH: thay nội dung hiện tại của ${tuongDoi} bằng bản ${path.basename(ban, ".ban")}`);
  if (!dongY) {
    bao("CHƯA LÀM GÌ. Hỏi người dùng, được đồng ý thì chạy lại lệnh với --dongy");
    return;
  }
  const tuyetDoi = path.join(GOC, tuongDoi);
  if (fs.existsSync(tuyetDoi)) {
    const { ngay, gio } = ngayGio();
    const thuMucFile = path.join(THU_MUC_TUNG_FILE, `${tuongDoi}.cacban`);
    fs.copyFileSync(tuyetDoi, path.join(thuMucFile, `${ngay}_${gio.slice(0, 2)}-${gio.slice(2, 4)}-${gio.slice(4)}-999-truockhoiphuc.ban`));
  }
  fs.mkdirSync(path.dirname(tuyetDoi), { recursive: true });
  fs.copyFileSync(ban, tuyetDoi);
  bao(`ĐÃ LẤY LẠI ${tuongDoi} từ bản ${path.basename(ban, ".ban")}. Nội dung trước đó đã được giữ lại thành một bản mới.`);
}

function lenhGhim(ten, ghim) {
  if (!ten) dung("Thiếu tên bản.");
  const ban = timBan(ten);
  const p = path.join(ban.thuMuc, TEN_FILE_GHIM);
  if (ghim) {
    fs.writeFileSync(p, `Ghim lúc ${ngayGio().hienThi}. Bản này không bao giờ bị dọn tự động.\n`);
    bao(`Đã ghim ${ban.ten}.`);
  } else {
    fs.rmSync(p, { force: true });
    bao(`Đã bỏ ghim ${ban.ten}.`);
  }
}

function lenhDon() {
  const ds = cacBanSaoLuu();
  const khongGhim = ds.filter((b) => !b.ghim);
  const thua = khongGhim.slice(0, Math.max(0, khongGhim.length - SO_BAN_GIU_LAI));
  for (const b of thua) {
    fs.rmSync(b.thuMuc, { recursive: true, force: true });
    bao(`Dọn bản cũ: ${b.ten}`);
  }
  if (ds.length > 0 && thua.length === 0) {
    bao(`Đang giữ ${khongGhim.length} bản thường + ${ds.length - khongGhim.length} bản ghim (giới hạn ${SO_BAN_GIU_LAI} bản thường).`);
  }

  if (!fs.existsSync(THU_MUC_TUNG_FILE)) return;
  const nguong = Date.now() - SO_NGAY_GIU_TUNG_FILE * MS_MOT_NGAY;
  let soDon = 0;
  const thamDo = (thuMuc) => {
    for (const muc of fs.readdirSync(thuMuc, { withFileTypes: true })) {
      const p = path.join(thuMuc, muc.name);
      if (muc.isDirectory()) {
        thamDo(p);
        if (fs.readdirSync(p).length === 0) fs.rmdirSync(p);
      } else if (muc.name.endsWith(".ban") && fs.statSync(p).mtimeMs < nguong) {
        fs.rmSync(p);
        soDon += 1;
      }
    }
  };
  thamDo(THU_MUC_TUNG_FILE);
  if (soDon) bao(`Dọn ${soDon} bản sao lưu từng file cũ hơn ${SO_NGAY_GIU_TUNG_FILE} ngày.`);
}

// ---------------- điều phối ----------------

if (THU_MUC_SAO_LUU === GOC || THU_MUC_SAO_LUU.startsWith(`${GOC}${path.sep}`)) {
  dung(`Thư mục sao lưu (${THU_MUC_SAO_LUU}) không được nằm trong dự án. Đổi SAOLUU_THUMUC ra ngoài.`);
}

const thamSo = process.argv.slice(2);
const coCo = (ten) => thamSo.includes(ten);
const giaTriCo = (ten) => {
  const i = thamSo.indexOf(ten);
  return i >= 0 ? thamSo[i + 1] : undefined;
};
const thamSoThuong = thamSo.filter((t, i) => !t.startsWith("--") && thamSo[i - 1] !== "--khoiphuc");
const [lenh, ...conLai] = thamSoThuong;

switch (lenh) {
  case "tao":
    lenhTao(conLai[0], conLai.slice(1).join(" ").trim());
    break;
  case "kiemtradungluong":
    kiemTraDungLuong({ thoatKhiLoi: true });
    break;
  case "ds":
    lenhDs();
    break;
  case "sosanh":
    lenhSoSanh(conLai[0]);
    break;
  case "khoiphuc":
    lenhKhoiPhuc(conLai[0], conLai.slice(1), coCo("--dongy"));
    break;
  case "tungfile":
    lenhTungFile(conLai[0], giaTriCo("--khoiphuc"), coCo("--dongy"));
    break;
  case "ghim":
    lenhGhim(conLai[0], true);
    break;
  case "boghim":
    lenhGhim(conLai[0], false);
    break;
  case "don":
    lenhDon();
    break;
  default:
    bao(
      fs
        .readFileSync(fileURLToPath(import.meta.url), "utf8")
        .split("\n")
        .slice(1, 15)
        .map((d) => d.replace(/^\/\/ ?/, ""))
        .join("\n"),
    );
    process.exit(lenh ? 1 : 0);
}
