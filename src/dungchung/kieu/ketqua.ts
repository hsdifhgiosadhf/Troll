export type KetQua<T> =
  | { thanhcong: true; dulieu: T; thongbao: string }
  | { thanhcong: false; dulieu: null; thongbao: string; ma: string };
