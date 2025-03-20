import { Box, Button, createListCollection, Heading, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";

import CenterSpinner from "../../components/centerSpinner";
import CodeBlock from "../../components/codeBlock";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "../../components/ui/select";

import { useGetQuery, usePostMutation, type ResultOption } from "./rtkqErrorHandlingApi";

const GetResult = ({ option }: { option: ResultOption }) => {
  const { data, error, isFetching } = useGetQuery(option);

  if (isFetching) {
    return <CenterSpinner />;
  }

  if (error) {
    return <IoMdClose />;
  }

  return <Stack><CodeBlock>{JSON.stringify(data)}</CodeBlock></Stack>;
}

const PostResult = ({ option }: { option: ResultOption }) => {
  const [post, result] = usePostMutation();

  return <>
    <Stack>
      <Box><Button onClick={async () => post(option)} loading={result.isLoading}>Post</Button></Box>
      {(result.data ? <CodeBlock>{JSON.stringify(result.data, null, 2)}</CodeBlock> : null)}
      {(result.error ? <CodeBlock>{JSON.stringify(result.error, null, 2)}</CodeBlock> : null)}
    </Stack>
  </>;
}

const RTKQErrorHandlingPage = () => {
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = useState<ResultOption>();

  const options = createListCollection({
    "items": [
      { label: "200", value: "200" as ResultOption },
      { label: "200WithSchemaError", value: "200WithWrongSchema" as ResultOption },
      { label: "400", value: "400" as ResultOption },
      { label: "429", value: "429" as ResultOption },
      { label: "500", value: "500" as ResultOption },
      { label: "Error", value: "Error" as ResultOption },
      { label: "Timeout", value: "Timeout" as ResultOption },
    ]
  });

  return (
    <Box>
      <Heading>{t("rtkqErrorHandling.title")}</Heading>
      <Box>
        <Text>{t("rtkqErrorHandling.description")}</Text>
        <Wrap gap={1} my={"20px"}>
          <WrapItem>
            <SelectRoot
              collection={options}
              size="sm"
              width="320px"
              onValueChange={({ value }) => { setSelectValue(value[0] as ResultOption); }}
              value={selectValue ? [selectValue] : undefined}
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
        <Heading size={"md"}>RTK Query</Heading>
        {(selectValue !== undefined ? <GetResult option={selectValue} /> : null)}
        <Heading size={"md"}>RTK Mutation</Heading>
        {(selectValue !== undefined ? <PostResult option={selectValue} /> : null)}
      </Box>
    </Box>
  );
};

export default RTKQErrorHandlingPage;
