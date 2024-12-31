import * as React from "react";
import { View } from "react-native";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { SharedValue } from "react-native-reanimated";
 
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { SBItem } from "./SBItem";
 
interface Props {
  width: number;
  height: number;
}

function Index({ width, height }: Props) {
  const scrollOffsetValue = useSharedValue<number>(0);
  const data = [...new Array(4).keys()];
  const ref = React.useRef<ICarouselInstance>(null);
  const progressValue = useSharedValue<number>(0);
 
  return (
    <>
      <Carousel
        style={{
          width,
          height: height - 10,
          justifyContent: "center",
        }}
        width={width - 40}
        height={height - 20}
        loop={data.length > 2}
        ref={ref}
        defaultScrollOffsetValue={scrollOffsetValue}
        data={data}
        onScrollEnd={() => {
          console.log("===2");
        }}
        pagingEnabled={true}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => {
          return (
            <SBItem
              index={index}
              onPress={() => {
                if (!ref.current) {
                  return;
                }
                const currentIndex = ref.current?.getCurrentIndex();
                if (currentIndex === 0 && index === data.length - 1) {
                  ref.current.prev();
                  return;
                }
                if (currentIndex === data.length - 1 && index === 0) {
                  ref.current.next();
                  return;
                }
                if (index === currentIndex + 1) {
                  ref.current.next();
                  return;
                }
                if (index === currentIndex - 1) {
                  ref.current.prev();
                  return;
                }
                ref.current?.scrollTo({ index, animated: true });
              }}
            />
          );
        }}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
      />

      {!!progressValue && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
          }}
        >
          {data.map((_, index) => {
            return (
              <PaginationItem
                animValue={progressValue}
                index={index}
                key={index}
                length={data.length}
              />
            );
          })}
        </View>
      )}
    </>
  );
}

const PaginationItem: React.FC<{
  index: number
  length: number
  animValue: SharedValue<number>
}> = (props) => {
  const { animValue, index, length } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        animValue?.value,
        index === 0 && animValue?.value > length - 1
          ? [length - 1, length, length + 1]
          : [index - 1, index, index + 1],
        [width, width + 10, width],
        Extrapolation.CLAMP
      ),

      opacity: interpolate(
        animValue?.value,
        index === 0 && animValue?.value > length - 1
          ? [length - 1, length, length + 1]
          : [index - 1, index, index + 1],
        [0.17, 1, 0.17],
        Extrapolation.CLAMP
      ),
    };
  }, [animValue, index, length]);
  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#141414",
          height: 10,
          borderRadius: 10,
          marginHorizontal: 4,
        },
        animStyle,
      ]}
    />
  );
};
 
export default Index;
 