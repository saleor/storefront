import { PageTabs, PageTab } from "@saleor/macaw-ui";
import { useRouter } from "next/router";

const AppNavigation: React.FC = () => {
  const router = useRouter();

  return (
    <PageTabs onChange={router.push} value={router.pathname}>
      <PageTab value="/channels" label="Channels" />
      <PageTab value="/design" label="Design" />
    </PageTabs>
  );
};
export default AppNavigation;
