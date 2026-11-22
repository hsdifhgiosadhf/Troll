import boTypeScript from "typescript-eslint";

/** Các nhánh nội bộ trong một tính năng. Ngoài tính năng đó thì cấm import thẳng. */
const CAC_TANG_RIENG_TU = ["giaodien", "moc", "dichvu", "kho", "kieu", "kiemtra"];

/** Danh sách tính năng chuẩn trong src/tinhnang/. Thêm tính năng mới thì cập nhật danh sách này. */
const CAC_TINH_NANG = ["gioithieu", "kynang", "duan", "kinhnghiem", "baiviet", "lienhe"];

const THONG_BAO_HANG_RAO =
  "Chỉ được lấy thành phần của tính năng khác qua chiso.ts, không import thẳng vào tầng nội bộ.";

/** Dựng luật chặn import nội bộ của danh sách tính năng cho trước. */
function dungLuatCam(dsTinhNang) {
  if (dsTinhNang.length === 0) {
    return "off";
  }
  const cacMau = [];
  for (const tinhNang of dsTinhNang) {
    for (const tang of CAC_TANG_RIENG_TU) {
      cacMau.push(`@/tinhnang/${tinhNang}/${tang}/*`);
      cacMau.push(`@/tinhnang/${tinhNang}/${tang}/**`);
      cacMau.push(`**/${tinhNang}/${tang}/*`);
      cacMau.push(`**/${tinhNang}/${tang}/**`);
    }
  }
  return ["error", { patterns: [{ group: cacMau, message: THONG_BAO_HANG_RAO }] }];
}

const cauHinhSoatMa = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      ".saoluu/**",
      "scripts/**",
      ".agents/**",
    ],
  },
  ...boTypeScript.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-restricted-imports": dungLuatCam(CAC_TINH_NANG),
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^loi$", caughtErrorsIgnorePattern: "^loi$" },
      ],
      "no-console": ["error", { allow: ["error"] }],
    },
  },
  ...CAC_TINH_NANG.map((tinhNang) => ({
    files: [`src/tinhnang/${tinhNang}/**`],
    rules: {
      "no-restricted-imports": dungLuatCam(
        CAC_TINH_NANG.filter((khac) => khac !== tinhNang),
      ),
    },
  })),
];

export default cauHinhSoatMa;
