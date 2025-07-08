import { CSSProperties } from "react";

export interface DomProperties {
  style?: CSSProperties;
  className?: string;
}

export type GenericGreenevilleBJJObject = Record<string, any> | any | undefined;
export type GreenevilleBJJObject<T = GenericGreenevilleBJJObject> =
  | Record<string, T>
  | T
  | undefined;

export interface ClickActions {
  onPress?: (ev: GreenevilleBJJObject) => void;
  onOut?: (ev: GreenevilleBJJObject) => void;
  onMove?: (ev: GreenevilleBJJObject) => void;
  onUp?: (ev: GreenevilleBJJObject) => void;
  onDown?: (ev: GreenevilleBJJObject) => void;
  onOver?: (ev: GreenevilleBJJObject) => void;
  groupId?: string;
  active?: boolean;
  selected?: boolean;
}
