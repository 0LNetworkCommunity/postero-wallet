import { FC } from "react";
import _ from "lodash";
import { View, ScrollView, Pressable } from "react-native";
import ListItem from "./ListItem";
import DAppScreen from "../DAppScreen";
import PanelPreview from "../../preview-panel/PanelPreview";
import { useDApps } from "../hook";


interface Props {
  activeDAppId?: string;
  onDAppPress: (dAppId: string) => void;
}

const DAppList: FC<Props> = ({ activeDAppId, onDAppPress }) => {
  const dApps = useDApps();

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View>
              {dApps.map((dApp) => (
                <Pressable
                  key={dApp.id}
                  onPress={() => onDAppPress(dApp.id)}
                >
                  <ListItem dApp={dApp} active={dApp.id === activeDAppId} />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <PanelPreview>
        {activeDAppId !== undefined && <DAppScreen dAppId={activeDAppId} />}
      </PanelPreview>
    </>
  );
};

export default DAppList;
