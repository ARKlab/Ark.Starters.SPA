import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ChackraPlainTable } from "../../components/tables/plainTable/chackraPlainTable";

import { useFetchPostsQuery } from "./jsonPlaceholderSlice";

export const PostDataSchema = z.object({
  id: z.number().nullable(),
  userId: z.number().nullable(),
  title: z.string().nullable(),
  body: z.string().nullable(),
});

export type PostDataType = z.infer<typeof PostDataSchema>;
const JsonPlaceholderPostsTable = () => {
  const { data, isLoading, isError, error } /*This also contains error and isSuccess*/ = useFetchPostsQuery(null, {
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
        error={error}
        schema={PostDataSchema}
      />
    </>
  );
};

export default JsonPlaceholderPostsTable;
