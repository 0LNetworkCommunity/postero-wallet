import type {
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  RouteProp,
  TabActionHelpers,
  TabNavigationState,
} from '@react-navigation/native';

export type PanelsNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
};

export type PanelsNavigationHelpers = NavigationHelpers<
  ParamListBase,
  PanelsNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type PanelsNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  PanelsNavigationOptions,
  PanelsNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export interface PanelsNavigationOptions {

}

export type PanelsNavigationConfig = {

}

export type PanelsDescriptor = Descriptor<
  PanelsNavigationOptions,
  PanelsNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type PanelsDescriptorMap = Record<string, PanelsDescriptor>;

export type NavigationSidebarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: PanelsDescriptorMap;
  navigation: NavigationHelpers<ParamListBase, PanelsNavigationEventMap>;
};
