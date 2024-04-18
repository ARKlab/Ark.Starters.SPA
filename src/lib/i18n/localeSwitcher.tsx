import { useTranslation } from "react-i18next";

import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useCallback } from "react";
import { supportedLngs } from "../../globalConfigs";

export const LocaleSwitcher = () => {
  const { i18n } = useTranslation();

  const swith = useCallback(
    async (k: string) => {
      await i18n.changeLanguage(k);
    },
    [i18n]
  );

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            isActive={isOpen}
          >
            {i18n.resolvedLanguage}
          </MenuButton>
          <MenuList>
            {Object.entries(supportedLngs).map(([k, v]) => (
              <MenuItem key={k} onClick={() => swith(k)}>
                {v}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
