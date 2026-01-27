import { Text, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from "virtual:pwa-register/react";

import { toaster } from "./ui/toaster";

export const PWABadge = () => {
  const period = 1000 * 60 * 2; //ms

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", e => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  const { t } = useTranslation("template");
  useEffect(() => {
    if (offlineReady) {
      toaster.create({
        type: "info",
        title: t("pwaBadge.offlineReady.title"),
        description: t("pwaBadge.offlineReady.body"),
      });
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady, t]);

  useEffect(() => {
    const id = "pwa.needRefresh";
    if (needRefresh) {
      toaster.create({
        id: id,
        type: "warning",
        title: t("pwaBadge.newVersion.title"),
        description: (
          <>
            <Text>{t("pwaBadge.newVersion.body")}</Text>
            <Button
              colorPalette="red"
              size={"sm"}
              onClick={async () => updateServiceWorker(true)}
            >
              {t("pwaBadge.newVersion.reload")}
            </Button>
          </>
        ),
        duration: 9999999,
      });
    }
  }, [needRefresh, setNeedRefresh, t, updateServiceWorker]);

  return <></>;
};

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return;

  const f = async () => {
    if (r.installing) return;

    if ("connection" in navigator && !navigator.onLine) return;
    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    }).catch(_ => {
      return null;
    });

    if (resp?.status === 200) await r.update();
  };

  f()
    .then(_ => setInterval(f, period))
    .catch(_ => null);
}
