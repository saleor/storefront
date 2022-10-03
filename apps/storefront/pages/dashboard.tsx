import { NextPage } from "next";

export const isInIframe = () => {
  try {
    return document.location !== window.parent.location;
  } catch (e) {
    return false;
  }
};

const DashboardPage: NextPage = () => {
  if (!isInIframe()) {
    return <div>This is forbidden page</div>;
  }

  return <div>This page is visible in dashboard</div>;
};

export default DashboardPage;
