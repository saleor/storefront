import { useApp } from "@/frontend/hooks/useApp";
import { getClient } from "@/frontend/misc/auth";
import { useMemo } from "react";
import { Provider } from "urql";

const ClientProvider: React.FC = (props) => {
  const app = useApp();

  const token = app?.getState()?.token;

  const client = useMemo(() => {
    if (token) {
      return getClient(token);
    }
  }, [token]);

  if (client) {
    return <Provider value={client} {...props} />;
  }

  return null;
};
export default ClientProvider;
