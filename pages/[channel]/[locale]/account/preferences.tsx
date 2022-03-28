import React, { ReactElement } from "react";

import { AccountLayout } from "@/components";
import { EmailPreferences } from "@/components/accountPreferences/EmailPreferences";
import { PasswordPreferences } from "@/components/accountPreferences/PasswordPreferences";

function AccountPreferencesPage() {
  return (
    <>
      <div className="checkout-section-container">
        <EmailPreferences />
      </div>
      <div className="checkout-section-container">
        <PasswordPreferences />
      </div>
    </>
  );
}

export default AccountPreferencesPage;

AccountPreferencesPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};
