import Skeleton from "@material-ui/lab/Skeleton";
import {
  OffsettedList,
  OffsettedListBody,
  OffsettedListItem,
  OffsettedListItemCell,
} from "@saleor/macaw-ui";
import clsx from "clsx";
import { Item } from "types/common";
import { useStyles } from "./styles";

interface AppSidebarProps {
  items: Item[];
  selectedItem?: Item;
  loading: boolean;
  onItemClick: (item: Item) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  items,
  selectedItem,
  loading,
  onItemClick,
}) => {
  const classes = useStyles();

  return (
    <OffsettedList gridTemplate={["1fr"]} className={classes.itemList}>
      <OffsettedListBody>
        {loading ? (
          <OffsettedListItem className={classes.itemListItem}>
            <Skeleton className={classes.itemListItemSkeleton} />
          </OffsettedListItem>
        ) : (
          items?.map((item) => (
            <OffsettedListItem
              key={item.id}
              className={clsx(classes.itemListItem, {
                [classes.itemListItemActive]: item.id === selectedItem?.id,
              })}
              onClick={() => onItemClick(item)}
            >
              <OffsettedListItemCell>
                {item.logo ? (
                  <item.logo className={classes.itemListItemLogo} />
                ) : (
                  item.label
                )}
              </OffsettedListItemCell>
            </OffsettedListItem>
          ))
        )}
      </OffsettedListBody>
    </OffsettedList>
  );
};
export default AppSidebar;
