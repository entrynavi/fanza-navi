import { expect, type Page } from "@playwright/test";

const STORAGE_KEY = "fanza-age-gate-accepted";

export async function prepareAgeGateBypass(page: Page) {
  await page.addInitScript((storageKey) => {
    const unlock = () => {
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {
        // ignore storage issues in test setup
      }

      document.documentElement.dataset.ageGateAccepted = "1";
      document.body.style.overflow = "";

      const appShell = document.getElementById("app-shell");
      appShell?.removeAttribute("inert");
      appShell?.removeAttribute("aria-hidden");

      const ageGate = document.querySelector<HTMLElement>("[data-age-gate]");
      if (ageGate) {
        ageGate.hidden = true;
        ageGate.setAttribute("aria-hidden", "true");
        ageGate.style.display = "none";
        ageGate.style.pointerEvents = "none";
        ageGate.style.opacity = "0";
      }
    };

    unlock();
    window.addEventListener("DOMContentLoaded", unlock);
    window.addEventListener("load", unlock);

    new MutationObserver(() => unlock()).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }, STORAGE_KEY);
}

export async function dismissAgeGate(page: Page) {
  await page.evaluate((storageKey) => {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // ignore storage issues in test setup
    }

    document.documentElement.dataset.ageGateAccepted = "1";
    document.body.style.overflow = "";

    const appShell = document.getElementById("app-shell");
    appShell?.removeAttribute("inert");
    appShell?.removeAttribute("aria-hidden");

    const ageGate = document.querySelector<HTMLElement>("[data-age-gate]");
    if (ageGate) {
      ageGate.hidden = true;
      ageGate.setAttribute("aria-hidden", "true");
      ageGate.style.display = "none";
      ageGate.style.pointerEvents = "none";
      ageGate.style.opacity = "0";
    }
  }, STORAGE_KEY);

  await expect(page.locator("[data-age-gate]")).toBeHidden();
}
