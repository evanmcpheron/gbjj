import React, { type JSX } from "react";
import styled from "styled-components";

const standardHtmlProps: Set<string> = new Set([
  "data-selected",
  "data-disabled",
  "data-read-only",
  "data-focus",
  "data-error",
  "data-visible",
  "data-language",
  "data-id",
  "onPress",
  "onChange",
  "onBlur",
  "onFocus",
  "abbr",
  "accept",
  "acceptCharset",
  "accessKey",
  "action",
  "allowFullScreen",
  "allowTransparency",
  "alt",
  "async",
  "autoComplete",
  "autoFocus",
  "autoPlay",
  "capture",
  "cellPadding",
  "cellSpacing",
  "challenge",
  "charSet",
  "checked",
  "cite",
  "classID",
  "className",
  "colSpan",
  "cols",
  "content",
  "contentEditable",
  "contextMenu",
  "controls",
  "coords",
  "crossOrigin",
  "data",
  "dateTime",
  "default",
  "defer",
  "dir",
  "disabled",
  "download",
  "draggable",
  "encType",
  "form",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "frameBorder",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hrefLang",
  "htmlFor",
  "httpEquiv",
  "icon",
  "id",
  "inputMode",
  "integrity",
  "is",
  "keyParams",
  "keyType",
  "kind",
  "label",
  "lang",
  "list",
  "loop",
  "low",
  "manifest",
  "marginHeight",
  "marginWidth",
  "max",
  "maxLength",
  "media",
  "mediaGroup",
  "method",
  "min",
  "minLength",
  "multiple",
  "muted",
  "name",
  "noValidate",
  "nonce",
  "open",
  "optimum",
  "pattern",
  "placeholder",
  "playsInline",
  "poster",
  "preload",
  "profile",
  "radioGroup",
  "readOnly",
  "referrerPolicy",
  "rel",
  "required",
  "reversed",
  "role",
  "rows",
  "rowSpan",
  "sandbox",
  "scope",
  "scoped",
  "scrolling",
  "seamless",
  "selected",
  "shape",
  "size",
  "sizes",
  "span",
  "spellCheck",
  "src",
  "srcDoc",
  "srcLang",
  "srcSet",
  "start",
  "step",
  "style",
  "summary",
  "tabIndex",
  "target",
  "title",
  "type",
  "useMap",
  "value",
  "width",
  "wmode",
  "wrap",

  // Custom
  "onPress",
  "onOut",
  "onMove",
  "onUp",
  "onDown",
  "onOver",
  "groupId",
  "active",
]);

export const getClassName = (tag: string, className?: string) =>
  `GreenevilleBJJ-${tag} ${className ? className : ""}`;

export const filterProps = <P extends object>(
  component: keyof JSX.IntrinsicElements | React.ComponentType<any>,
  filteredProps?: (keyof P)[] | string[]
) => {
  return styled(
    React.forwardRef<any, P & { children?: React.ReactNode }>(
      ({ children, ...props }, ref) => {
        const componentProps: Record<string, any> = { ref, children };

        const propsToFilter =
          filteredProps ?? (Object.keys(props) as (keyof P | string)[]);

        Object.keys(props).forEach((prop) => {
          if (
            standardHtmlProps.has(prop) ||
            !propsToFilter.includes(prop as keyof P | string)
          ) {
            if (prop === "active") {
              componentProps[prop] = (props as Record<string, any>)[
                prop
              ].toString();
            } else {
              componentProps[prop] = (props as Record<string, any>)[prop];
            }
          }
        });

        return React.createElement(component, componentProps);
      }
    )
  );
};
