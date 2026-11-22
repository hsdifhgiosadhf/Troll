export interface ThongKeCaNhan {
  readonly id: string;
  readonly giaTri: string;
  readonly nhan: string;
}

export interface ThongTinGioiThieu {
  readonly nhanMoDau: string;
  readonly hoTen: string;
  readonly bietDanhNgheThuat: string;
  readonly chucDanh: string;
  readonly loiGioiThieu: string;
  readonly trietLy: string;
  readonly thongKe: readonly ThongKeCaNhan[];
}
