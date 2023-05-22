import { PageTabs, PageTab } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { channelListPath, customizationPath } from "@/saleor-app-checkout/routes";
import { useIntl } from "react-intl";
import { sectionMessages } from "@/saleor-app-checkout/frontend/misc/commonMessages";
import { useStyles } from "./styles";

const AppNavigation: React.FC = () => {
  const router = useRouter();
  const intl = useIntl();
  const classes = useStyles();

  return (
    <PageTabs
      onChange={(route) => {
        void router.push(route);
      }}
      value={router.pathname}
      className={classes.tabs}
    >
      <PageTab
        data-testid="channels-tab"
        value={channelListPath}
        label={intl.formatMessage(sectionMessages.channels)}
      />
      <PageTab
        data-testid="customization-tab"
        value={customizationPath}
        label={intl.formatMessage(sectionMessages.customization)}
      />
    </PageTabs>
  );
};
export default AppNavigation;
