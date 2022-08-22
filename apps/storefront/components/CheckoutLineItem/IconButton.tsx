import {
  IconButton as UiKitIconButton,
  IconButtonProps as UiKitIconButtonProps,
} from "@saleor/ui-kit";

export type IconButtonProps = UiKitIconButtonProps;

export const IconButton: React.FC<IconButtonProps> = ({ ...rest }) => <UiKitIconButton {...rest} />;
