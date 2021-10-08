import React from "react";
import { EmailPreferences } from "./EmailPreferences";
import { PasswordPreferences } from "./PasswordPreferences";

export const AccountPreferences: React.VFC<any> = ({}) => {
  return (
    <section className="border-r flex flex-auto flex-col overflow-y-auto px-4 pt-4 space-y-4 pb-4">
      <div className="checkout-section-container">
        <EmailPreferences />
      </div>
      <div className="checkout-section-container">
        <PasswordPreferences />
      </div>
    </section>
  );
};
