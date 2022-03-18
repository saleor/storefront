import {
  OffsettedList,
  OffsettedListBody,
  OffsettedListItem,
  OffsettedListItemCell,
} from "@saleor/macaw-ui";
import clsx from "clsx";
import { useStyles } from "./styles";

export interface Item {
  id: string;
  label: string;
}

interface AppSidebarProps {
  items: Item[];
  selectedItem?: Item;
  onItemClick: (item: Item) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  items,
  selectedItem,
  onItemClick,
}) => {
  const classes = useStyles();

  return (
    <OffsettedList gridTemplate={["1fr"]} className={classes.itemList}>
      <OffsettedListBody>
        {items?.map((item) => (
          <OffsettedListItem
            key={item.id}
            className={clsx(classes.itemListItem, {
              [classes.itemListItemActive]: item.id === selectedItem?.id,
            })}
            onClick={() => onItemClick(item)}
          >
            <OffsettedListItemCell>{item.label}</OffsettedListItemCell>
          </OffsettedListItem>
        ))}
      </OffsettedListBody>
    </OffsettedList>
  );
};
export default AppSidebar;
