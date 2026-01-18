import { Box, Button, createListCollection, Heading, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuX } from "react-icons/lu";

import CenterSpinner from "../../components/centerSpinner";
import CodeBlock from "../../components/codeBlock";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../../components/ui/select";

import { useDownloadMutation, useGetQuery, usePostMutation, type ResultOption } from "./rtkqErrorHandlingApi";

const GetResult = ({ option }: { option: ResultOption }) => {
  const { data, error, isFetching } = useGetQuery(option);

  if (isFetching) {
    return <CenterSpinner />;
  }

  if (error) {
    return <LuX />;
  }

  return (
    <Stack>
      <CodeBlock data-test="query-results">{JSON.stringify(data)}</CodeBlock>
    </Stack>
  );
};

const PostResult = ({ option }: { option: ResultOption }) => {
  const [post, result] = usePostMutation();

  return (
    <>
      <Stack>
        <Box>
          <Button onClick={async () => post(option)} loading={result.isLoading}>
            Post
          </Button>
        </Box>
        {result.data ? (
          <CodeBlock data-test="mutation-results-data">{JSON.stringify(result.data, null, 2)}</CodeBlock>
        ) : null}
        {result.error ? (
          <CodeBlock data-test="mutation-results-error">{JSON.stringify(result.error, null, 2)}</CodeBlock>
        ) : null}
      </Stack>
    </>
  );
};

const Download = () => {
  const [download, { error, isLoading }] = useDownloadMutation();

  return (
    <>
      <Wrap gap={"1"} my={"5"}>
        <WrapItem>
          <Button
            colorPalette={"primary"}
            loading={isLoading}
            disabled={isLoading}
            onClick={async () => download("Success")}
            data-test="download-success"
          >
            Download
          </Button>
        </WrapItem>
        <WrapItem>
          <Button
            colorPalette={"error"}
            loading={isLoading}
            disabled={isLoading}
            onClick={async () => download("Failure")}
            data-test="download-failure"
          >
            Fail Download
          </Button>
        </WrapItem>
      </Wrap>

      {error ? <CodeBlock data-test="mutation-download-error">{JSON.stringify(error, null, 2)}</CodeBlock> : null}
    </>
  );
};

const RTKQErrorHandlingPage = () => {
  const { t } = useTranslation();
  const [selectQueryValue, setSelectQueryValue] = useState<ResultOption>();
  const [selectMutationValue, setSelectMutationValue] = useState<ResultOption>();

  const options = createListCollection({
    items: [
      { label: "200", value: "200" as ResultOption },
      { label: "200WithWrongSchema", value: "200WithWrongSchema" as ResultOption },
      { label: "400", value: "400" as ResultOption },
      { label: "429", value: "429" as ResultOption },
      { label: "500", value: "500" as ResultOption },
      { label: "Error", value: "Error" as ResultOption },
      { label: "Timeout", value: "Timeout" as ResultOption },
    ],
  });

  return (
    <Stack>
      <Heading>{t("rtkqErrorHandling.title")}</Heading>
      <Text>{t("rtkqErrorHandling.description")}</Text>
      <Box>
        <Heading size={"md"}>RTK Query</Heading>
        <Wrap gap={"1"} my={"5"}>
          <WrapItem>
            <SelectRoot
              name="query"
              collection={options}
              size="sm"
              w="xs"
              onValueChange={({ value }) => {
                setSelectQueryValue(value[0] as ResultOption);
              }}
              value={selectQueryValue ? [selectQueryValue] : undefined}
            >
              <SelectTrigger clearable>
                <SelectValueText />
              </SelectTrigger>
              <SelectContent>
                {options.items.map(x => (
                  <SelectItem item={x} key={x.value}>
                    {x.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </WrapItem>
        </Wrap>
        {selectQueryValue !== undefined ? <GetResult option={selectQueryValue} /> : null}
      </Box>

      <Box>
        <Heading size={"md"}>RTK Mutation</Heading>
        <Wrap gap={"1"} my={"5"}>
          <WrapItem>
            <SelectRoot
              name="mutation"
              collection={options}
              size="sm"
              width="xs"
              onValueChange={({ value }) => {
                setSelectMutationValue(value[0] as ResultOption);
              }}
              value={selectMutationValue ? [selectMutationValue] : undefined}
            >
              <SelectTrigger clearable>
                <SelectValueText />
              </SelectTrigger>
              <SelectContent>
                {options.items.map(x => (
                  <SelectItem item={x} key={x.value}>
                    {x.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </WrapItem>
        </Wrap>
        {selectMutationValue !== undefined ? <PostResult option={selectMutationValue} /> : null}
      </Box>

      <Box>
        <Heading size={"md"}>Download File</Heading>
        <Download />
      </Box>
    </Stack>
  );
};

export default RTKQErrorHandlingPage;
