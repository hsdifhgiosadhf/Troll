export interface MucDieuHuong {
  readonly id: string;
  readonly nhan: string;
  readonly neo: string;
}

export const DANH_SACH_MUC: readonly MucDieuHuong[] = [
  { id: "gioi-thieu", nhan: "Giới thiệu", neo: "#gioi-thieu" },
  { id: "ky-nang", nhan: "Kỹ năng", neo: "#ky-nang" },
  { id: "du-an", nhan: "Dự án", neo: "#du-an" },
  { id: "kinh-nghiem", nhan: "Kinh nghiệm", neo: "#kinh-nghiem" },
  { id: "bai-viet", nhan: "Ghi chú", neo: "#bai-viet" },
  { id: "lien-he", nhan: "Liên hệ", neo: "#lien-he" },
] as const;

export const THOI_LUONG_CHUYEN_MS = 320;
export const SO_KY_TU_TIN_NHAN_TOI_DA = 800;
