import { Box, Heading, List } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const DetailsPageExampleMainView = () => {
  const { t } = useTranslation();
  return (
    <Box ml={"5"}>
      <Heading>{t("playground")}</Heading>
      <Box>
        <Heading size="md" my={"5"}>
          {t("notification_example")}
        </Heading>
        {t("detailspage_clickIdToViewDetails")}
        <List.Root>
          <List.Item asChild>
            <Link to="1">ID# 1</Link>
          </List.Item>
          <List.Item>
            <Link to="2">ID# 2</Link>
          </List.Item>
          <List.Item>
            <Link to="3">ID# 3</Link>
          </List.Item>
          <List.Item>
            <Link to="4">ID# 4</Link>
          </List.Item>
        </List.Root>
      </Box>
    </Box>
  );
};

export default DetailsPageExampleMainView;
