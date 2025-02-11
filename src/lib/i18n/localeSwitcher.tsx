import { Button } from "@chakra-ui/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MdExpandMore } from "react-icons/md";

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../../components/ui/menu";
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
    return null;
  }

  return (
    <MenuRoot>
      <MenuTrigger as={Button} >
        <MdExpandMore />
        {i18n.language}
      </MenuTrigger>
      <MenuContent>
        {Object.entries(supportedLngs).map(([k, v]) => (
          <MenuItem value={v} key={k} onClick={async () => swith(k)}>
            {v}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
};

