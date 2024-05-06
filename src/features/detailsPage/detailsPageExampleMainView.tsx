import { Box, Heading, List, ListItem } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const DetailsPageExampleMainView = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <Heading>{t("Playground")}</Heading>
      <Box>
        <Heading size="md" my={"20px"}>
          {t("notification_example")}
        </Heading>
        {t("detailspage_clickIdToViewDetails")}
        <List>
          <ListItem>
            <Link to="1">ID# 1</Link>
          </ListItem>
          <ListItem>
            <Link to="2">ID# 2</Link>
          </ListItem>
          <ListItem>
            <Link to="3">ID# 3</Link>
          </ListItem>
          <ListItem>
            <Link to="4">ID# 4</Link>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default DetailsPageExampleMainView;
