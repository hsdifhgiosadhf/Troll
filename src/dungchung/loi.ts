/** Chuyển đổi ngoại lệ unknown sang chuỗi thông báo an toàn cho người xem. */
export function layThongDiepLoi(loi: unknown): string {
  if (loi instanceof Error && loi.message.trim().length > 0) {
    return loi.message;
  }
  if (typeof loi === "string" && loi.trim().length > 0) {
    return loi;
  }
  return "Đã có sự cố bất ngờ. Vui lòng thử lại sau ít phút.";
}
