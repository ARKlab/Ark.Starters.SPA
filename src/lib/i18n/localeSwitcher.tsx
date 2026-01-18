import { Button } from "@chakra-ui/react";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronDown , LuGlobe } from "react-icons/lu";

import { MenuItemGroup, MenuTrigger, MenuContent, MenuItem, MenuRoot } from "../../components/ui/menu";
import { supportedLngs } from "../../config/lang";

export const LocaleSwitcher = ({ portalRef }: { portalRef?: React.RefObject<HTMLDivElement | null> }) => {
  const { i18n } = useTranslation();

  const swith = async (k: string) => {
    await i18n.changeLanguage(k);
  };

  if (Object.entries(supportedLngs).length < 2) {
    return <></>;
  }
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"}>
          <LuGlobe />
          {i18n.language}
          <LuChevronDown />
        </Button>
      </MenuTrigger>
      <MenuContent portalRef={portalRef as RefObject<HTMLElement> | undefined}>
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
