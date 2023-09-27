import { type AriaLabel } from "@/checkout/src/lib/globalTypes";
import {
	IconButton as UiKitIconButton,
	type IconButtonProps as UiKitIconButtonProps,
} from "@/checkout/ui-kit";

export type IconButtonProps = AriaLabel & UiKitIconButtonProps;

export const IconButton: React.FC<IconButtonProps> = ({ ariaLabel, ...rest }) => (
	<UiKitIconButton type="button" aria-label={ariaLabel} {...rest} />
);
