import { filterProps } from "@/styles/filter.props.helper";
import { BeltColor } from "@/types/users.types";

export const BJJ_BELT_HEX = {
  WHITE: "#FFFFFF",
  GREY: "#A9A9A9",
  GREY_WHITE: "#A9A9A9",
  GREY_BLACK: "#A9A9A9",
  YELLOW: "#FCEC03",
  YELLOW_WHITE: "#FCEC03",
  YELLOW_BLACK: "#FCEC03",
  ORANGE: "#FFA500",
  ORANGE_WHITE: "#FFA500",
  ORANGE_BLACK: "#FFA500",
  GREEN: "#4DC223",
  GREEN_WHITE: "#4DC223",
  GREEN_BLACK: "#4DC223",
  BLUE: "#0000FF",
  PURPLE: "#9827B8",
  BROWN: "#8B4513",
  BLACK: "#000000",
  RED: "#B30000",
  RED_WHITE: "#B30000",
  RED_BLACK: "#B30000",
} as const;

export const beltColorToHex = (color: BeltColor): string => BJJ_BELT_HEX[color];

export const getRankBarColor = (belt: BeltColor): string | null => {
  if (belt === BeltColor.BLACK) return BJJ_BELT_HEX[BeltColor.RED];
  if (
    [
      BeltColor.WHITE,
      BeltColor.GREY,
      BeltColor.GREY_WHITE,
      BeltColor.GREY_BLACK,
      BeltColor.YELLOW,
      BeltColor.YELLOW_WHITE,
      BeltColor.YELLOW_BLACK,
      BeltColor.ORANGE,
      BeltColor.ORANGE_WHITE,
      BeltColor.ORANGE_BLACK,
      BeltColor.GREEN,
      BeltColor.GREEN_WHITE,
      BeltColor.GREEN_BLACK,
      BeltColor.BLUE,
      BeltColor.PURPLE,
      BeltColor.BROWN,
    ].includes(belt)
  )
    return BJJ_BELT_HEX[BeltColor.BLACK];
  if (/^(grey|yellow|orange|green)/.test(belt))
    return BJJ_BELT_HEX[BeltColor.BLACK];
  return null;
};

export const getBeltMidlineStripe = (belt: BeltColor): string | null => {
  if (belt.endsWith("_WHITE")) return BJJ_BELT_HEX[BeltColor.WHITE];
  if (belt.endsWith("_BLACK")) return BJJ_BELT_HEX[BeltColor.BLACK];
  return null;
};

// maximum stripes per belt type
export const BELT_CONFIG = {
  default: { maxStripes: 4 },
  black: { maxStripes: 6 },
};
export const BeltWrapper = filterProps<{ scale: number }>("div")`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => 4 * props.scale}px;
  font-family: sans-serif;
`;

export const BeltBand = filterProps<{ color: string; scale: number }>("div")`
  background-color: ${(props) => props.color};
  width: ${(props) => 70 * props.scale}px;
  height: ${(props) => 20 * props.scale}px;
  border-radius: ${(props) => 4 * props.scale}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 ${(props) => 1 * props.scale}px ${(props) =>
  3 * props.scale}px rgba(0, 0, 0, 0.2);
`;

export const StripeContainer = filterProps<{ color: string; scale: number }>(
  "div"
)`
  background-color: ${(props) => props.color};
  display: flex;
  padding-left: ${(props) => 4 * props.scale}px;
  gap: ${(props) => 5 * props.scale}px;
  height: 100%;
  width: ${(props) => 40 * props.scale}px;
  z-index: 1;
`;

export const Stripe = filterProps<{ color: string; scale: number }>("div")`
  background-color: ${(props) => props.color};
  width: ${(props) => 4 * props.scale}px;
  height: 100%;
`;

export const OverlayStripe = filterProps<{ color: string; scale: number }>(
  "div"
)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: ${(props) => 6 * props.scale}px;
  width: 100%;
  background-color: ${(props) => props.color};
  pointer-events: none;
  border-radius: ${(props) => 2 * props.scale}px;
`;

export const BlackBeltStripeContainer = filterProps<{
  color: string;
  scale: number;
}>("div")`
  background-color: ${(props) => props.color};
  display: flex;
  padding-left: ${(props) => 3.5 * props.scale}px;
  gap: ${(props) => 3 * props.scale}px;
  height: 100%;
  width: ${(props) => 40 * props.scale}px;
  z-index: 1;
`;

export const BlackBeltStripe = filterProps<{ color: string; scale: number }>(
  "div"
)`
  background-color: ${(props) => props.color};
  width: ${(props) => 3 * props.scale}px;
  height: 100%;
`;

export const RedBeltStripeContainer = filterProps<{ scale: number }>("div")`
  display: flex;
  gap: 25%;
  height: 100%;
  width: ${(props) => 80 * props.scale}px;
  z-index: 1;
  border-radius: ${(props) => 4 * props.scale}px;
  overflow: hidden;
`;

export const RedBeltStripe = filterProps<{ color: string; scale: number }>(
  "div"
)`
  background-color: ${(props) => props.color};
  width: ${(props) => 20 * props.scale}px;
  height: 100%;
`;
