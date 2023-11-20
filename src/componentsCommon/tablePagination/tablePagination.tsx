//THIS COMPONENT NEED TO BE REFACTOR TO BE CHACKRA COMPLIANT

import * as R from "ramda";
type PaginationComponentTypes = {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => any;
};

const PaginationComponent = ({
  count,
  pageSize,
  page,
  onPageChange,
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

  return (
    <div>
      {count > pageSize ? (
        <div>
          <PageItem
            display={page > pageMinRange}
            onChange={() => onPageChange(1)}
            title="First Page"
            value={<i className="fa fa-angle-double-left" />}
          />
          <PageItem
            display={page > 1}
            onChange={() => onPageChange(R.subtract(page, 1))}
            title="Previous"
            value={<i className="fa fa-angle-left" />}
          />
          {pageRange.map((p: any, i: number) => {
            const pVal = R.add(1, p);
            return (
              <PageItem
                display={(pVal - 1) * pageSize < count}
                key={i}
                // className={R.equals(pVal, page) ? is active  : is not active} // active page style apply here
                onChange={() => onPageChange(pVal)}
                title={R.toString(pVal)}
                value={pVal}
              />
            );
          })}
          <PageItem
            display={page < totalPages}
            onChange={() => onPageChange(R.add(1, page))}
            title="Next"
            value={<i className="fa fa-angle-right" />}
          />
          <PageItem
            display={page < pageMaxSub}
            onChange={() => onPageChange(totalPages)}
            value={<i className="fa fa-angle-double-right" />}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PaginationComponent;

type PageItemsTypes = {
  display: boolean;
  onChange: any;
  title?: string;
  disable?: boolean;
  className?: string;
  value: string | number | JSX.Element;
};

const PageItem = ({
  display,
  onChange,
  title,
  disable,
  className = "",
  value,
}: PageItemsTypes) =>
  R.ifElse(
    (x: any) => x === true,
    () => (
      <div
        //className={` ${className} ${disable ? styles.disabled + styles.pageNo : styles.pageNo  }`}
        onClick={onChange}
        title={title}
      >
        {value}
      </div>
    ),
    () => <></>
  )(display);
