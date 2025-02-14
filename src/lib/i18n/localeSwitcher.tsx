import { Button } from "@chakra-ui/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { GoChevronDown } from "react-icons/go";

import { MenuItemGroup, MenuTrigger, MenuContent, MenuItem, MenuRoot } from "../../components/ui/menu";
import { supportedLngs } from "../../config/lang";

export const LocaleSwitcher = () => {
  const { i18n } = useTranslation();

  const swith = useCallback(
    async (k: string) => {
      await i18n.changeLanguage(k);
    },
    [i18n],
  );

  if (Object.entries(supportedLngs).length < 2) {
    return <></>;
  }
  return (
    <MenuRoot>
      <MenuTrigger>
        <Button variant={"ghost"} colorPalette={"brandPalette"}>
          {i18n.language}
          <GoChevronDown />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItemGroup title={"Language"}>
          {Object.entries(supportedLngs).map(([k, v]) => (
            <MenuItem value={k} key={k} onClick={async () => swith(k)}>
              {v}
            </MenuItem>
          ))}
        </MenuItemGroup>
      </MenuContent>
    </MenuRoot>
  );
};
