import type { LoaiMinhHoaDuAn } from "@/dungchung/minhhoa/MinhHoaKienTrucDuAn";

export interface DuAn {
  readonly id: string;
  readonly ten: string;
  readonly nam: string;
  readonly vaiTro: string;
  readonly loaiMinhHoa: LoaiMinhHoaDuAn;
  readonly tomTat: string;
  readonly chiTiet: string;
  readonly ketQua: readonly string[];
  readonly kyNang: readonly string[];
  readonly lienKet: string;
}
