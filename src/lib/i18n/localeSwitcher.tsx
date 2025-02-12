import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

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
    <Menu>
      {({ open }: { open: boolean }) => (
        <>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isActive={open}>
            {i18n.language}
          </MenuButton>
          <MenuList>
            {Object.entries(supportedLngs).map(([k, v]) => (
              <MenuItem key={k} onClick={async () => swith(k)}>
                {v}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
