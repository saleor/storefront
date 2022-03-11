import { IconButton, ArrowRightIcon } from "@saleor/macaw-ui";
import { useStyles } from "./styles";

interface AppHeaderProps {
  onBack?: () => void;
  menu?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ children, menu, onBack }) => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      {onBack && (
        <IconButton onClick={onBack}>
          <ArrowRightIcon className={classes.backArrow} />
        </IconButton>
      )}
      <h1 className={classes.title}>{children}</h1>
      {menu}
    </header>
  );
};
export default AppHeader;
