import { Svg, Path } from "react-native-svg";
import { IconProps } from "./types";

export function ArrowNarrowLeftIcon({ size = 24, color = "#000000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9.29289322,5.29289322 C9.68341751,4.90236893 10.3165825,4.90236893 10.7071068,5.29289322 C11.0976311,5.68341751 11.0976311,6.31658249 10.7071068,6.70710678 L6.414,11 L20,11 C20.5128358,11 20.9355072,11.3860402 20.9932723,11.8833789 L21,12 C21,12.5522847 20.5522847,13 20,13 L6.415,13 L10.7071068,17.2928932 C11.0675907,17.6533772 11.0953203,18.2206082 10.7902954,18.6128994 L10.7071068,18.7071068 C10.3165825,19.0976311 9.68341751,19.0976311 9.29289322,18.7071068 L3.29289322,12.7071068 L3.21968877,12.625449 L3.214,12.616 L3.198,12.594 L3.15568797,12.5360882 L3.147,12.52 L3.14038077,12.5114029 L3.126,12.483 L3.10164115,12.4397747 L3.095,12.422 L3.0849217,12.4039426 L3.073,12.37 L3.05829863,12.3372588 L3.051,12.311 L3.0433274,12.2918437 L3.038,12.265 L3.02641071,12.2292908 L3.022,12.2 L3.01559786,12.1764315 L3.013,12.148 L3.00672773,12.1166211 L3.005,12.085 L3.0017331,12.0590314 L3.002,12.033 L3,12 L3.002,11.967 L3.0017331,11.9409686 L3.005,11.913 L3.00672773,11.8833789 L3.013,11.851 L3.01559786,11.8235685 L3.022,11.799 L3.02641071,11.7707092 L3.038,11.734 L3.0433274,11.7081563 L3.051,11.688 L3.05829863,11.6627412 L3.073,11.629 L3.0849217,11.5960574 L3.095,11.577 L3.10164115,11.5602253 L3.126,11.516 L3.14038077,11.4885971 L3.147,11.479 L3.15568797,11.4639118 L3.198,11.405 L3.20970461,11.3871006 L3.214,11.383 L3.21968877,11.374551 C3.24259799,11.3460062 3.26704116,11.3187453 3.29289322,11.2928932 L9.29289322,5.29289322 Z"
        fill={color}
        fillRule="nonzero"
      />
    </Svg>
  );
}
