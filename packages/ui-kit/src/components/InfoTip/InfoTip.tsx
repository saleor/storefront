import { FC } from "react";
import clsx from "clsx";

import styles from "./InfoTip.module.css";
import { Text } from "../Text";
import { HorizontalAlignment } from "@lib/globalTypes";

export interface InfoTipProps {
  content: string;
  className?: string;
  alignment?: HorizontalAlignment;
}

export const InfoTip: FC<InfoTipProps> = ({
  content,
  className,
  alignment = "left",
  ...rest
}) => (
  <Text
    as='div'
    className={clsx(
      styles.infotip,
      {
        [styles["infotip-triangle-left"]]: alignment !== "right",
        [styles["infotip-triangle-right"]]: alignment === "right",
      },
      className
    )}
    {...rest}>
    {content}
  </Text>
);
