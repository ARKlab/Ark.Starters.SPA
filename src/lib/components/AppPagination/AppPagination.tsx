import { Button, Stack } from "@chakra-ui/react";
import type { JSX, MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from "react-icons/lu";

import { NativeSelectField, NativeSelectRoot } from "../../../components/ui/native-select";

type AppPaginationProps = {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => unknown;
  onPageSizeChange: (pageSize: number) => unknown;
  isLoading: boolean;
};

const AppPagination = ({ count, pageSize, page, onPageChange, onPageSizeChange, isLoading }: AppPaginationProps) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(count / pageSize);
  const pageMinRange = 3;
  const pageMinRangeVal = page > pageMinRange ? Math.min(page - pageMinRange, totalPages - pageMinRange) : 0;

  const pageMaxRange = 2;
  const pageMaxSub = totalPages - pageMaxRange;
  const pageMaxRangeVal = page < pageMaxSub ? page + pageMaxRange : totalPages;

  // R.range replacement (exclusive end)
  const rangeStart = pageMinRangeVal;
  const rangeEnd = page < 3 ? 5 : pageMaxRangeVal;
  const pageRange = [];
  for (let i = rangeStart; i < rangeEnd; i++) {
    pageRange.push(i);
  }

  if (isLoading) return <></>;
  return (
    <div>
      {count > pageSize ? (
        <>
          <Stack gap={"4"} direction="row" align="center" justifyContent="center" my="5">
            <NativeSelectRoot w="32">
              <NativeSelectField value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <PageItem
              display={page > pageMinRange}
              onChange={() => onPageChange(1)}
              title={t("libComponents:appPagination_firstPage")}
              value={<LuChevronsLeft />}
            />
            <PageItem
              display={page > 1}
              onChange={() => onPageChange(page - 1)}
              title={t("libComponents:appPagination_previous")}
              value={<LuChevronLeft />}
              data-test="pagination-prev"
            />
            {pageRange.map((p: number, i: number) => {
              const pVal = p + 1;
              return (
                <PageItem
                  display={(pVal - 1) * pageSize < count}
                  key={i}
                  onChange={() => onPageChange(pVal)}
                  title={String(pVal)}
                  value={pVal}
                  currentPage={page === pVal}
                  data-test={`pagination-page-${pVal}`}
                />
              );
            })}
            <PageItem
              display={page < totalPages}
              onChange={() => onPageChange(page + 1)}
              title={t("libComponents:appPagination_next")}
              value={<LuChevronRight />}
              data-test="pagination-next"
            />
            <PageItem
              display={page < pageMaxSub}
              onChange={() => onPageChange(totalPages)}
              title={t("libComponents:appPagination_lastPage")}
              value={<LuChevronsRight />}
            />
          </Stack>
        </>
      ) : (
        <Stack gap={"4"} direction="row" align="center" justifyContent="center" my="5">
          <NativeSelectRoot w="32">
            <NativeSelectField value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Stack>
      )}
    </div>
  );
};

export default AppPagination;

type PageItemsTypes = {
  display: boolean;
  onChange: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  disable?: boolean;
  currentPage?: boolean;
  value: string | number | JSX.Element;
};

const PageItem = ({ display, onChange, title, disable, currentPage, value }: PageItemsTypes) => {
  if (display) {
    return (
      <Button disabled={disable} onClick={onChange} title={title} variant={currentPage ? "outline" : "solid"}>
        {value}
      </Button>
    );
  }
  return <></>;
};
