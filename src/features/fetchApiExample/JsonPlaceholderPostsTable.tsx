import { Heading } from "@chakra-ui/react";
import { ChackraPlainTable } from "../../components/tables/plainTable/chackraPlainTable";
import { useFetchPostsQuery } from "./jsonPlaceholderSlice";
import { useTranslation } from "react-i18next";
const JsonPlaceholderPostsTable = () => {
  const {
    data,
    isLoading,
    isError,
  } /*This also contains error and isSuccess*/ = useFetchPostsQuery(null, {
    pollingInterval: 30000,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const { t } = useTranslation();

  return (
    <>
      <Heading>{t("fetch_example_Page")}</Heading>
      <ChackraPlainTable
        colorscheme="teal"
        variant="striped"
        data={data || []}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
};

export default JsonPlaceholderPostsTable;
