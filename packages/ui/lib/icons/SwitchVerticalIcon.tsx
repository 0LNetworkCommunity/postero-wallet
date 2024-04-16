import Svg, { Path } from "react-native-svg";
import { IconProps } from "./types";

function SwitchVerticalIcon({ size = 24, color = "#000000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M7,3 C7.55228475,3 8,3.44771525 8,4 L8,17.584 L10.2928932,15.2928932 C10.6533772,14.9324093 11.2206082,14.9046797 11.6128994,15.2097046 L11.7071068,15.2928932 C12.0976311,15.6834175 12.0976311,16.3165825 11.7071068,16.7071068 L7.70710678,20.7071068 C7.68125472,20.7329588 7.65399378,20.757402 7.62544899,20.7803112 L7.616,20.786 L7.594,20.802 L7.53608818,20.844312 L7.52,20.853 L7.51140295,20.8596192 L7.483,20.874 L7.43977467,20.8983588 L7.422,20.905 L7.40394259,20.9150783 L7.37,20.927 L7.33725878,20.9417014 L7.311,20.949 L7.29184367,20.9566726 L7.265,20.962 L7.22929083,20.9735893 L7.2,20.978 L7.17643151,20.9844021 L7.148,20.987 L7.11662113,20.9932723 L7.085,20.995 L7.05903139,20.9982669 L7.033,20.998 L7,21 L6.967,20.998 L6.94096861,20.9982669 L6.913,20.995 L6.88337887,20.9932723 L6.851,20.987 L6.82356849,20.9844021 L6.799,20.978 L6.77070917,20.9735893 L6.734,20.962 L6.70815633,20.9566726 L6.688,20.949 L6.66274122,20.9417014 L6.629,20.927 L6.59605741,20.9150783 L6.577,20.905 L6.56022533,20.8983588 L6.516,20.874 L6.48859705,20.8596192 L6.479,20.853 L6.46391182,20.844312 L6.405,20.802 L6.38710056,20.7902954 L6.383,20.786 L6.37455101,20.7803112 C6.34600622,20.757402 6.31874528,20.7329588 6.29289322,20.7071068 L2.29289322,16.7071068 C1.90236893,16.3165825 1.90236893,15.6834175 2.29289322,15.2928932 C2.68341751,14.9023689 3.31658249,14.9023689 3.70710678,15.2928932 L6,17.585 L6,4 C6,3.48716416 6.38604019,3.06449284 6.88337887,3.00672773 L7,3 Z M17.085,3.005 L17.1166211,3.00672773 L17.148,3.013 L17.1764315,3.01559786 L17.2,3.022 L17.2292908,3.02641071 L17.265,3.038 L17.2918437,3.0433274 L17.311,3.051 L17.3372588,3.05829863 L17.37,3.073 L17.4039426,3.0849217 L17.422,3.095 L17.4397747,3.10164115 L17.483,3.126 L17.5114029,3.14038077 L17.52,3.147 L17.5360882,3.15568797 L17.594,3.198 L17.6128994,3.20970461 L17.616,3.214 L17.625449,3.21968877 L17.7071068,3.29289322 L21.7071068,7.29289322 C22.0976311,7.68341751 22.0976311,8.31658249 21.7071068,8.70710678 C21.3165825,9.09763107 20.6834175,9.09763107 20.2928932,8.70710678 L18,6.415 L18,20 C18,20.5128358 17.6139598,20.9355072 17.1166211,20.9932723 L17,21 C16.4477153,21 16,20.5522847 16,20 L16,6.414 L13.7071068,8.70710678 C13.3466228,9.06759074 12.7793918,9.09532028 12.3871006,8.79029539 L12.2928932,8.70710678 C11.9023689,8.31658249 11.9023689,7.68341751 12.2928932,7.29289322 L16.2928932,3.29289322 L16.374551,3.21968877 L16.383,3.214 L16.405,3.198 L16.4639118,3.15568797 L16.479,3.147 L16.4885971,3.14038077 L16.516,3.126 L16.5602253,3.10164115 L16.577,3.095 L16.5960574,3.0849217 L16.629,3.073 L16.6627412,3.05829863 L16.688,3.051 L16.7081563,3.0433274 L16.734,3.038 L16.7707092,3.02641071 L16.799,3.022 L16.8235685,3.01559786 L16.851,3.013 L16.8833789,3.00672773 L16.913,3.005 L16.9409686,3.0017331 L16.967,3.002 L17,3 L17.033,3.002 L17.0590314,3.0017331 L17.085,3.005 Z"
        fill={color}
        fillRule="nonzero"
      />
    </Svg>
  );
}

export default SwitchVerticalIcon;