import { BeltColor } from "@/types/users.types";
import { BeltIcon } from "./belt.component";
import { Timestamp } from "firebase/firestore";

export const BJJ_BELT_HEX_ADULT: BeltColor[] = [
  BeltColor.WHITE,
  BeltColor.BLUE,
  BeltColor.PURPLE,
  BeltColor.BROWN,
  BeltColor.BLACK,
  BeltColor.RED_WHITE,
  BeltColor.RED_BLACK,
  BeltColor.RED,
];

export const BJJ_BELT_HEX_CHILD: BeltColor[] = [
  BeltColor.WHITE,
  BeltColor.GREY_WHITE,
  BeltColor.GREY,
  BeltColor.GREY_BLACK,
  BeltColor.YELLOW_WHITE,
  BeltColor.YELLOW,
  BeltColor.YELLOW_BLACK,
  BeltColor.ORANGE_WHITE,
  BeltColor.ORANGE,
  BeltColor.ORANGE_BLACK,
  BeltColor.GREEN_WHITE,
  BeltColor.GREEN,
  BeltColor.GREEN_BLACK,
];

export const BJJ_BELT_HEX = BJJ_BELT_HEX_ADULT.concat(BJJ_BELT_HEX_CHILD);

export const isAdult = (input: Timestamp | Date): BeltColor[] => {
  // Normalize to JS Date
  const birthDate = input instanceof Timestamp ? input.toDate() : input;
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If birth month/day hasn't occurred yet this year, subtract one year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 16 ? BJJ_BELT_HEX_ADULT : BJJ_BELT_HEX_CHILD;
};

interface AllBeltsDisplayProps {
  birthday: Timestamp | null;
  scale?: number;
}

export const AllBeltsDisplay: React.FC<AllBeltsDisplayProps> = ({
  birthday,
  scale = 1,
}) => {
  if (!birthday) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {BJJ_BELT_HEX_ADULT.concat(BJJ_BELT_HEX_CHILD).map((belt) => (
          <BeltIcon key={belt} belt={belt} stripes={6} scale={scale} />
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {(isAdult(birthday) ? BJJ_BELT_HEX_ADULT : BJJ_BELT_HEX_CHILD).map(
        (belt) => (
          <BeltIcon key={belt} belt={belt} stripes={6} scale={scale} />
        )
      )}
    </div>
  );
};
