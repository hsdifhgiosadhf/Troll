import { expect, test } from "@playwright/test";

test.describe("Trang 1-page Thành Hoàng (Vendredi sur Mer – Écoute chérie)", () => {
  test("Luồng 1: Tải trang 1-page, hiển thị dòng Coder-Graphic Desgin cute và phát lặp đúng file nhạc MP3", async ({
    page,
  }) => {
    const loiConsole: string[] = [];
    const loiTrang: string[] = [];
    const loiMang404: string[] = [];

    page.on("console", (tin) => {
      if (tin.type() === "error") loiConsole.push(tin.text());
    });
    page.on("pageerror", (loi) => {
      loiTrang.push(loi.message);
    });
    page.on("response", (phanHoi) => {
      if (phanHoi.status() >= 400) {
        loiMang404.push(`${phanHoi.status()} ${phanHoi.url()}`);
      }
    });

    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /Thành Hoàng/i }),
    ).toBeVisible();
    await expect(page.getByText(/Coder-Graphic Desgin/i)).toBeVisible();

    const theAmThanh = page.locator("audio");
    await expect(theAmThanh).toHaveCount(1);
    await expect(theAmThanh).toHaveAttribute("loop", "");
    await expect(theAmThanh).toHaveAttribute("autoplay", "");

    const duongDanNhac = await theAmThanh.getAttribute("src");
    expect(duongDanNhac).toBeTruthy();
    if (duongDanNhac) {
      const phanHoiNhac = await page.request.get(
        new URL(duongDanNhac, page.url()).toString(),
      );
      expect(phanHoiNhac.status()).toBe(200);
    }

    expect(loiConsole).toEqual([]);
    expect(loiTrang).toEqual([]);
    expect(loiMang404).toEqual([]);
  });

  test("Luồng 2: Đĩa than SVG vừa quay vừa co giãn theo nhịp nhạc và tạm dừng/phát tiếp mượt không nhảy trang", async ({
    page,
  }) => {
    await page.goto("/");

    const viTriTruoc = await page.evaluate(() => window.scrollY);
    const diaThanSvg = page.getByTestId("dia-than-svg-theo-nhac");
    await expect(diaThanSvg).toBeVisible();

    const nhomDiaQuay = diaThanSvg.getByTestId("nhom-dia-quay");
    await expect(nhomDiaQuay).toHaveClass(/dia-than-dang-quay/);

    // Kiểm tra chống tái phát LOI-002: tâm đĩa than phải co giãn bán kính r theo nhịp nhạc
    const nhanDia = diaThanSvg.getByTestId("nhan-dia-theo-nhac");
    const banKinhBanDau = await nhanDia.getAttribute("r");
    await expect
      .poll(async () => await nhanDia.getAttribute("r"), { timeout: 2500 })
      .not.toBe(banKinhBanDau);

    const nutTamDung = page.getByRole("button", {
      name: "Tạm dừng nhịp đĩa than",
    });
    await nutTamDung.click();
    await expect(nhomDiaQuay).not.toHaveClass(/dia-than-dang-quay/);

    const nutPhat = page.getByRole("button", {
      name: "Bật nhịp đĩa than",
    });
    await nutPhat.click();
    await expect(nhomDiaQuay).toHaveClass(/dia-than-dang-quay/);

    const viTriSau = await page.evaluate(() => window.scrollY);
    expect(Math.abs(viTriSau - viTriTruoc)).toBeLessThan(50);
  });

  test("Luồng 3: Đã xoá hộp sóng nhạc chữ nhật, nút Loa, nút Đổi MP3 và thanh phát nhạc bên dưới theo yêu cầu", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("anh-bia-svg-theo-nhac")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Tắt tiếng nhạc nền" }),
    ).toHaveCount(0);
    await expect(
      page.getByLabel("Chọn file nhạc MP3 để phát lặp"),
    ).toHaveCount(0);
    await expect(
      page.getByRole("slider", { name: "Thanh tiến trình nhạc lặp" }),
    ).toHaveCount(0);
  });

  test("Luồng 4: Chống spam lượt xem và lượt tim theo IP máy, giữ nguyên khi bấm F5 tải lại trang", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByTestId("so-luot-xem")).toHaveText("54");
    await expect(page.getByTestId("so-luot-thich")).toHaveText("4");

    const nutTimGocTrai = page.getByRole("button", {
      name: "Thả tim hồ sơ Thành Hoàng",
    });
    await expect(nutTimGocTrai).toHaveAttribute("aria-pressed", "false");

    await nutTimGocTrai.click();
    await expect(nutTimGocTrai).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("so-luot-thich")).toHaveText("5");

    // Bấm lặp lại nhiều lần không được vọt quá +1 tim
    await nutTimGocTrai.click();
    await expect(page.getByTestId("so-luot-thich")).toHaveText("4");
    await nutTimGocTrai.click();
    await expect(page.getByTestId("so-luot-thich")).toHaveText("5");

    await page.reload();
    await expect(nutTimGocTrai).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("so-luot-thich")).toHaveText("5");
    await expect(page.getByTestId("so-luot-xem")).toHaveText("54");
  });

  test("Luồng 5: Màn hình 390px không tràn ngang, đã xoá thanh điều hướng và đĩa than vẫn nhảy theo nhạc trên Windows 10 reducedMotion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const biTranNgang = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(biTranNgang).toBe(false);

    await expect(
      page.getByRole("navigation", { name: "Điều hướng chính" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "VIEW PROFILE" }),
    ).toHaveCount(0);

    const nhanDia = page.getByTestId("nhan-dia-theo-nhac");
    await expect(nhanDia).toBeVisible();
    const banKinhDau = await nhanDia.getAttribute("r");
    await expect
      .poll(async () => await nhanDia.getAttribute("r"), { timeout: 2500 })
      .not.toBe(banKinhDau);
  });
});
