import type { HeadingProps } from "@chakra-ui/react";
import { Button, Heading, HStack } from "@chakra-ui/react";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

export function PageTitle(props: { pageTitle: string; backBtn?: boolean } & HeadingProps) {
  const { pageTitle, backBtn = true, ...rest } = props;

  const navigate = useNavigate();

  async function goBack() {
    await navigate(-1);
  }

  return (
    <HStack alignItems={"center"} mb="4">
      {backBtn && (
        <Button variant={"subtle"} size={"xs"} onClick={goBack}>
          <LuChevronLeft />
        </Button>
      )}

      <Heading as={"h1"} size={"2xl"} fontWeight={"bold"} {...rest}>
        {pageTitle}
      </Heading>
    </HStack>
  );
}
