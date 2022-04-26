import { ButtonHTMLAttributes } from "react";

import Bag from "./bagIcon.svg";
import MenuIcon from "./menuIcon.svg"; // in the final version it should be imported from ui-kit package
import styles from "./Navbar.module.css"; // in the final version it should be imported from ui-kit package
import Spyglass from "./spyglassIcon.svg"; // in the final version it should be imported from ui-kit package
import User from "./userIcon.svg"; // in the final version it should be imported from ui-kit package

interface NavIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: "user" | "bag" | "spyglass" | "menu";
  counter?: number;
}

const switchIcon = (icon: NavIconButtonProps["icon"]) => {
  switch (icon) {
    case "user":
      return <User />;
    case "bag":
      return <Bag />;
    case "spyglass":
      return <Spyglass />;
    case "menu":
      return <MenuIcon />;
    default:
      return icon;
  }
};

function NavIconButton({ icon, counter, ...rest }: NavIconButtonProps) {
  return (
    <button type="button" className={styles["nav-icon-button"]} {...rest}>
      {switchIcon(icon)}
      {!!counter && <span className={styles["nav-icon-counter"]}>{counter}</span>}
    </button>
  );
}

export default NavIconButton;
