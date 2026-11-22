export interface MocThoiGian {
  readonly nam: number;
  readonly thang: number;
}

export interface MocKinhNghiem {
  readonly id: string;
  readonly vaiTro: string;
  readonly toChuc: string;
  readonly loai: "congviec" | "hocvan";
  readonly batDau: MocThoiGian;
  readonly ketThuc: MocThoiGian | null;
  readonly tomTat: string;
  readonly diemNhan: readonly string[];
}
