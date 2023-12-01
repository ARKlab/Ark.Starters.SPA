import { useTranslate } from "../../translate";
import { useEffect, useState } from "react";
import * as c from "../../redux/commonConstants";
export default function Footer() {
  const translate = useTranslate();

  //************************************************************************/
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  });
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };
  const isMobile = width < c.MobileWitdh;

  return <></>;
}
