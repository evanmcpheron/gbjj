import { GreenevilleBJJObject } from "./base.types";

export type EventMapEntry<T = any> = {
  channelName: string;
  onMessage: (data: T) => void;
};

export interface PublishOptions {
  bubbles?: boolean;
  cancelable?: boolean;
}

export interface WebkitMargins {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface WebkitDevice {
  os?: string;
  type?: string;
  phone?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  orientation?: string;
  current?: string;
  old?: string;
  width?: number;
  height?: number;
  margins?: WebkitMargins;
}

export interface DeviceProperties {
  Content: {
    CustomBreakPoints: GreenevilleBJJObject[];
    ContentTop: GreenevilleBJJObject;
    ContentBottom: GreenevilleBJJObject;
    ContentBody: GreenevilleBJJObject;
    ContentSideWindow: GreenevilleBJJObject;
  };
  PreviousDevice: GreenevilleBJJObject;
  ChangeOrientationList: GreenevilleBJJObject[];
  DocumentElement: HTMLElement;
  userAgent: string;
  television: string | string[];
  orientationEvent: string;
  type: string | string[];
  os: string | string[];
  DeviceInfo: {
    os: string;
    type: string;
    phone: boolean;
    tablet: boolean;
    desktop: boolean;
    orientation: string;
    current: GreenevilleBJJObject;
    old: GreenevilleBJJObject;
    width: GreenevilleBJJObject;
    height: GreenevilleBJJObject;
    apple: AppleDevice;
    margins: {
      top: GreenevilleBJJObject;
      right: GreenevilleBJJObject;
      bottom: GreenevilleBJJObject;
      left: GreenevilleBJJObject;
    };
    standalone: boolean;
  };
  orientation: string;
  oldDevice: string;
  FirstLoad: boolean;

  CurrentExperience: string;
  CurrentOrientation: string;

  TouchType: {
    Pointer: string;
    PrimaryDevice: string;
    PointerEnabled: boolean;
    TouchEnabled: boolean;
  };
}

export interface AppleDevice {
  isSafari: boolean;
  osVersion: string;
  browserVersion: string;
}
