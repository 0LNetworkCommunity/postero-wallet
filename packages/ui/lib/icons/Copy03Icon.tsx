import { Svg, Path } from "react-native-svg";
import { IconProps } from "./types";

export function Copy03Icon({ size = 24, color = "#000000" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.362001,1.32698881 C21.9265089,1.61462834 22.3854955,2.07361106 22.672994,2.63800499 C22.9689514,3.21881463 23,3.598809 23,5.2 L22.9986952,13.2667151 C22.9905287,14.4834538 22.9378028,14.8423582 22.6730395,15.3619258 C22.3854573,15.9264391 21.9264391,16.3854573 21.3620319,16.6729855 C20.7812325,16.9689514 20.4012295,17 18.8,17 L17,17 L16.9986952,19.2667151 C16.9905287,20.4834538 16.9378028,20.8423582 16.6730395,21.3619258 C16.3854573,21.9264391 15.9264391,22.3854573 15.3620319,22.6729855 C14.7812325,22.9689514 14.4012295,23 12.8,23 L4.73329502,22.9986952 C3.516583,22.9905289 3.15768969,22.9378046 2.63812295,22.6730541 C2.07361106,22.3854955 1.61462834,21.9265089 1.32699612,21.3620153 C1.04662311,20.8117902 1.00400189,20.4417789 1.0002921,19.0428833 L1.00130476,10.733298 C1.00947114,9.5165929 1.06219707,9.15769058 1.32697417,8.63804776 C1.61459005,8.07354122 2.07354122,7.61459005 2.63802153,7.32698754 C3.18825643,7.04662265 3.55826043,7.00400186 4.95712253,7.0002921 L7,7 L7.0002921,4.95712254 C7.00400183,3.55826051 7.04662195,3.18825781 7.32697417,2.63804776 C7.61459005,2.07354122 8.07354122,1.61459005 8.63802153,1.32698754 C9.18825643,1.04662265 9.55826043,1.00400186 10.9571225,1.0002921 L19.2667132,1.00130478 C20.4834473,1.0094713 20.8423568,1.06219862 21.362001,1.32698881 Z M13.3652838,9.00252449 L4.62496808,9.00252449 C3.89916553,9.01075449 3.68295149,9.03922006 3.54599224,9.10900583 C3.35783878,9.20486995 3.20486995,9.35783878 3.10899246,9.54601847 L3.07964567,9.61641629 C3.02208565,9.78793068 3.0026108,10.1049203 3.0002513,10.9977047 L3.0026321,19.3750351 C3.01075458,20.1008447 3.03921894,20.3170727 3.10899119,20.453999 C3.20487052,20.6421674 3.35784519,20.7951433 3.54603501,20.891006 L3.61152322,20.9186822 C3.79406691,20.9817419 4.14199297,21 5.2,21 L13.3539537,20.9975962 C14.0966739,20.9897873 14.3157608,20.9614428 14.4540742,20.8909605 C14.6421609,20.7951427 14.7951427,20.6421609 14.8910145,20.4539681 L14.9186874,20.3884877 C14.9817401,20.2059576 15,19.8580034 15,18.8 L14.9975963,10.6460492 C14.9897874,9.90333605 14.9614418,9.68426371 14.8909459,9.54591705 C14.7951433,9.35784519 14.6421674,9.20487052 14.4539847,9.10898388 L14.3832414,9.07952195 C14.2373064,9.03064962 13.9860462,9.00927386 13.3652838,9.00252449 Z M19.375035,3.00263204 L10.6249681,3.00263204 C9.89916553,3.01075449 9.68295149,3.03922006 9.54599224,3.10900583 C9.35783878,3.20486995 9.20486995,3.35783878 9.10899246,3.54601847 L9.07964567,3.61641629 C9.02208565,3.78793068 9.0026108,4.10492031 9.0002513,4.99770466 L9,7 L13.0428833,7.0002921 C14.4417789,7.00400187 14.8117894,7.04662273 15.362001,7.32698881 C15.9265089,7.61462834 16.3854955,8.07361106 16.672994,8.63800499 C16.9689514,9.21881463 17,9.598809 17,11.2 L17,15 L19.3539537,14.9975962 C20.0966739,14.9897873 20.3157608,14.9614428 20.4540742,14.8909605 C20.6421609,14.7951427 20.7951427,14.6421609 20.8910145,14.4539681 L20.9186874,14.3884877 C20.9817401,14.2059576 21,13.8580034 21,12.8 L20.9975963,4.64604922 C20.9897874,3.90333605 20.9614418,3.68426371 20.8909459,3.54591705 C20.7951433,3.35784519 20.6421674,3.20487052 20.4539847,3.10898388 L20.383595,3.07964048 C20.2384779,3.03094111 19.9891812,3.00950475 19.375035,3.00263204 L19.375035,3.00263204 Z"
        fill={color}
        fillRule="nonzero"
      />
    </Svg>
  );
}
