import { ButtonHTMLAttributes } from "react";

import Bag from "./bagIcon.svg"; // in the final version it should be imported from ui-kit package
import Close from "./closeIocn.svg"; // in the final version it should be imported from ui-kit package
import MenuIcon from "./menuIcon.svg"; // in the final version it should be imported from ui-kit package
import styles from "./Navbar.module.css"; // in the final version it should be imported from ui-kit package
import Spyglass from "./spyglassIcon.svg"; // in the final version it should be imported from ui-kit package
import User from "./userIcon.svg"; // in the final version it should be imported from ui-kit package

interface NavIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: "user" | "bag" | "spyglass" | "menu" | "close";
  counter?: number;
}

const getIcon = (iconName: NavIconButtonProps["icon"]) => {
  switch (iconName) {
    case "user":
      return <User />;
    case "bag":
      return <Bag />;
    case "spyglass":
      return <Spyglass />;
    case "menu":
      return <MenuIcon />;
    case "close":
      return <Close />;
    default:
      return iconName;
  }
};

function NavIconButton({ icon, counter, ...rest }: NavIconButtonProps) {
  return (
    <button type="button" className={styles["nav-icon-button"]} {...rest}>
      {getIcon(icon)}
      {!!counter && (
        <span className={styles["nav-icon-counter"]} data-testid="cartCounter">
          {counter}
        </span>
      )}
    </button>
  );
}

export default NavIconButton;
