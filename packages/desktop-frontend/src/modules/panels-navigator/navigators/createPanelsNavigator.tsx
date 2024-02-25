import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type ParamListBase,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  useNavigationBuilder,
} from "@react-navigation/native";
import {
  PanelsNavigationConfig,
  PanelsNavigationEventMap,
  PanelsNavigationOptions,
} from "../types";
import { PanelsView } from "../views/PanelsView";

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  PanelsNavigationOptions,
  PanelsNavigationEventMap
> &
  TabRouterOptions &
  PanelsNavigationConfig;

function PanelsNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      PanelsNavigationOptions,
      PanelsNavigationEventMap
    >(TabRouter, {
      id,
      initialRouteName,
      backBehavior,
      children,
      // layout,
      screenListeners,
      screenOptions,
    });

  return (
    <NavigationContent>
      <PanelsView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export const createPanelsNavigator = createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  PanelsNavigationOptions,
  PanelsNavigationEventMap,
  typeof PanelsNavigator
>(PanelsNavigator);
