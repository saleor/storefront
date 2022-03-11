import { PageTabs, PageTab } from "@saleor/macaw-ui";
import { useRouter } from "next/router";
import { channelListPath, customizationPath } from "routes";
import { useIntl } from "react-intl";
import { sectionMessages } from "@misc/commonMessages";

const AppNavigation: React.FC = () => {
  const router = useRouter();
  const intl = useIntl();

  return (
    <PageTabs onChange={router.push} value={router.pathname}>
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
