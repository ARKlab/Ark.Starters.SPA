import {
  Button,
  Select,
  Stack,
} from "@chakra-ui/react";
import * as R from "ramda";
import { MouseEventHandler } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
} from "react-icons/md";

type PaginationComponentTypes = {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => unknown;
  onPageSizeChange: (pageSize: number) => unknown;
  isLoading: boolean;
};

const PaginationComponent = ({
  count,
  pageSize,
  page,
  onPageChange,
  onPageSizeChange,
  isLoading,
}: PaginationComponentTypes) => {
  const totalPages = Math.ceil(R.divide(count, pageSize));
  const pageMinRange = 3;
  const pageMinRangeVal = R.gt(page, pageMinRange)
    ? R.min(
      R.subtract(page, pageMinRange),
      R.subtract(totalPages, pageMinRange)
    )
    : 0;

  const pageMaxRange = 2;
  const pageMaxSub = R.subtract(totalPages, pageMaxRange);
  const pageMaxRangeVal =
    page < pageMaxSub ? R.add(page, pageMaxRange) : totalPages;

  const pageRange = R.range(pageMinRangeVal, page < 3 ? 5 : pageMaxRangeVal);
  if (isLoading) return <></>;
  return (
    <div>
      {count > pageSize ? (
        <>
          <Stack
            spacing={4}
            direction="row"
            align="center"
            justifyContent="center"
            my="20px"
          >
            <Select
              w="8em"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>

            <PageItem
              display={page > pageMinRange}
              onChange={() => onPageChange(1)}
              title="First Page"
              value={<MdFirstPage />}
            />
            <PageItem
              display={page > 1}
              onChange={() => onPageChange(R.subtract(page, 1))}
              title="Previous"
              value={<MdChevronLeft />}
            />
            {pageRange.map((p: number, i: number) => {
              const pVal = R.add(1, p);
              return (
                <PageItem
                  display={(pVal - 1) * pageSize < count}
                  key={i}
                  onChange={() => onPageChange(pVal)}
                  title={R.toString(pVal)}
                  value={pVal}
                  currentPage={page === pVal}
                />
              );
            })}
            <PageItem
              display={page < totalPages}
              onChange={() => onPageChange(R.add(1, page))}
              title="Next"
              value={<MdChevronRight />}
            />
            <PageItem
              display={page < pageMaxSub}
              onChange={() => onPageChange(totalPages)}
              value={<MdLastPage />}
            />
          </Stack>
        </>
      ) : (
        <Stack
          spacing={4}
          direction="row"
          align="center"
          justifyContent="center"
          my="20px"
        >
          <Select
            w="8em"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Stack>
      )}
    </div>
  );
};

export default PaginationComponent;

type PageItemsTypes = {
  display: boolean;
  onChange: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  disable?: boolean;
  currentPage?: boolean;
  value: string | number | JSX.Element;
};

const PageItem = ({
  display,
  onChange,
  title,
  disable,
  currentPage,
  value,
}: PageItemsTypes) =>
  R.ifElse(
    (x: unknown) => x === true,
    () => (
      <Button
        isDisabled={disable}
        onClick={onChange}
        title={title}
        variant={currentPage ? "outline" : ""}
      >
        {value}
      </Button>
    ),
    () => <></>
  )(display);
