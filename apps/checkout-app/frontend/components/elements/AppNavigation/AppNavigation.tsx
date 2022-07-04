import { PageTabs, PageTab } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { channelListPath, customizationPath } from "routes";
import { useIntl } from "react-intl";
import { sectionMessages } from "@/checkout-app/frontend/misc/commonMessages";
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
        value={channelListPath}
        label={intl.formatMessage(sectionMessages.channels)}
      />
      <PageTab
        value={customizationPath}
        label={intl.formatMessage(sectionMessages.customization)}
      />
    </PageTabs>
  );
};
export default AppNavigation;
