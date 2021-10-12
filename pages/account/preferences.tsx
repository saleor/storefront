import React from "react";
import { EmailPreferences } from "../../components/accountPreferences/EmailPreferences";
import { PasswordPreferences } from "../../components/accountPreferences/PasswordPreferences";
import AccountBaseTemplate from "@/components/AccountBaseTemplate";

const AccountPreferencesPage: React.VFC<any> = ({}) => {
  return (
    <AccountBaseTemplate>
      <div className="checkout-section-container">
        <EmailPreferences />
      </div>
      <div className="checkout-section-container">
        <PasswordPreferences />
      </div>
    </AccountBaseTemplate>
  );
};

export default AccountPreferencesPage;
