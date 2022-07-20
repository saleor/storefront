import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

export type IconComponent = OverridableComponent<SvgIconTypeMap<{}, "svg">>;
