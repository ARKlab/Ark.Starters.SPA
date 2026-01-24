import { useTranslation } from "react-i18next";

type AppDateFormatterProps = {
  dateTime: Date | string;
  formatOptions: Intl.DateTimeFormatOptions;
};

export function AppDateFormatter({ dateTime, formatOptions }: AppDateFormatterProps) {
  const { t } = useTranslation();

  return (
    <>
      {t("date", {
        val: dateTime,
        formatParams: { val: formatOptions },
      })}
    </>
  );
}
