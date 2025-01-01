import { FC, PropsWithChildren, useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";

import { settingsContext } from "./context";
import { Settings } from "./types";

const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      accentColor
    }
  }
`;

type Props = PropsWithChildren<{}>;

const SettingsProvider: FC<Props> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>();
  const apolloClient = useApolloClient();

  useEffect(() => {
    const load = async () => {
      const res = await apolloClient.query<{
        settings: Settings;
      }>({
        query: GET_SETTINGS,
      });
      setSettings(res.data.settings);
    };
    load();
  }, []);

  if (!settings) {
    return null;
  }

  return (
    <settingsContext.Provider value={settings}>
      {children}
    </settingsContext.Provider>
  );
};

export default SettingsProvider;
