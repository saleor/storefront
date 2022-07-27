import { FC } from "react";
import clsx from "clsx";
import { Switch as HeadlessSwitch } from "@headlessui/react";

import styles from "./Switch.module.css";
import labelStyles from "../Label/Label.module.css";
import { ClassNames } from "@lib/globalTypes";

export interface SwitchProps {
  checked?: boolean;
  label?: string;
  classNames?: ClassNames<"container" | "toggle" | "label">;
  onChange(checked: boolean): void;
}

export const Switch: FC<SwitchProps> = ({
  checked = false,
  label,
  classNames,
  onChange,
}) => (
  <div className={classNames?.container}>
    <HeadlessSwitch.Group>
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        className={clsx(
          styles.toggle,
          {
            [styles["toggle-active"]]: checked,
          },
          classNames?.toggle
        )}>
        <span
          aria-hidden='true'
          className={clsx(styles.dot, {
            [styles["dot-active"]]: checked,
          })}
        />
      </HeadlessSwitch>
      {label && (
        <HeadlessSwitch.Label
          className={clsx(labelStyles.label, styles.label, classNames?.label)}>
          {label}
        </HeadlessSwitch.Label>
      )}
    </HeadlessSwitch.Group>
  </div>
);
