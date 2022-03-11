import { IconButton, SettingsIcon } from "@saleor/macaw-ui";
import AppHeader from "@elements/AppHeader";
import AppSidebar, { Item } from "@elements/AppSidebar";
import { useStyles } from "./styles";

interface AppLayoutProps {
  title: string;
  items: Item[];
  selectedItem?: Item;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  onItemClick: (item: Item) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  items,
  selectedItem,
  onBackClick,
  onSettingsClick,
  onItemClick,
  children,
}) => {
  const classes = useStyles();

  return (
    <>
      <AppHeader
        onBack={onBackClick}
        menu={
          onSettingsClick && (
            <IconButton onClick={onSettingsClick}>
              <SettingsIcon />
            </IconButton>
          )
        }
      >
        {title}
      </AppHeader>
      <div className={classes.root}>
        <AppSidebar
          items={items}
          selectedItem={selectedItem}
          onItemClick={onItemClick}
        />
        <div className={classes.content}>{children}</div>
      </div>
    </>
  );
};
export default AppLayout;
