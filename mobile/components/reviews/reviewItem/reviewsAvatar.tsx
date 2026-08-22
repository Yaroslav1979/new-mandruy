import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export default function ReviewsAvatar() {
  return (
    <Svg width="34" height="34" viewBox="0 0 34 34">
      <Circle cx="17" cy="17" r="17" fill="white" />
      <Circle cx="17" cy="17" r="16" stroke="#FF662D" strokeWidth="2" />
      <Path
        fill="#FF662D"
        d="M4.8 28.8C7 25.5 10.7 23.5 14.7 23.5H19.3C23.3 23.5 27 25.5 29.2 28.8C32.2 25.8 34 21.6 34 17C34 7.6 26.4 0 17 0C7.6 0 0 7.6 0 17C0 21.6 1.8 25.8 4.8 28.8ZM17 7C12.9 7 9.6 10.3 9.6 14.4C9.6 18.4 12.9 21.8 17 21.8C21.1 21.8 24.4 18.4 24.4 14.4C24.4 10.3 21.1 7 17 7Z"
      />
    </Svg>
  );
}
