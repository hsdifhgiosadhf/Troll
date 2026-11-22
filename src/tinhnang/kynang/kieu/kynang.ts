import type { CheDoMinhHoaKyNang } from "@/dungchung/minhhoa/MinhHoaNhanhKyNang";

export interface MucKyNang {
  readonly id: string;
  readonly ten: string;
  readonly moTa: string;
}

export interface NhomKyNang {
  readonly id: CheDoMinhHoaKyNang;
  readonly tieuDe: string;
  readonly tomTat: string;
  readonly cacKyNang: readonly MucKyNang[];
}
