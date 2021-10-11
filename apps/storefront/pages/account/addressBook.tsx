import BaseTemplate from "@/components/BaseTemplate";
import { NavigationPanel } from "@/components/NavigationPanel";

const AddressBookPage: React.VFC = () => {
  return (
    <BaseTemplate>
      <div className="py-10">
        <header className="mb-4">
          <h1 className="max-w-7xl text-2xl mx-auto px-8">Account</h1>
        </header>
        <main className="flex max-w-7xl mx-auto px-8">
          <div className="flex-initial w-2/5">
            <NavigationPanel active={"AddressBook"} />
          </div>
          <div className="border-r flex flex-auto flex-col overflow-y-auto px-4 pt-4 space-y-4 pb-4">
            <div>Address Book Component goes here</div>
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default AddressBookPage;
