import { createElement, Fragment, type ReactNode } from "react";

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  lt: "<",
  gt: ">",
  amp: "&",
  quot: '"',
  ldquo: "\u201C", // "
  rdquo: "\u201D", // "
  lsquo: "\u2018", // '
  rsquo: "\u2019", // '
  ndash: "\u2013", // –
};

/**
 * HTML 엔티티를 실제 문자로 파싱하고, <br> 태그를 줄바꿈(\n)으로 변환합니다.
 */
export const formatText = (text: string): string => {
  const decoded = text.replace(
    /&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z]+));/g,
    (_, dec, hex, name) => {
      if (name !== undefined) {
        const key = name.toLowerCase();
        return NAMED_ENTITIES[key] ?? `&${name};`;
      }
      if (dec !== undefined) {
        return String.fromCharCode(parseInt(dec, 10));
      }
      if (hex !== undefined) {
        return String.fromCharCode(parseInt(hex, 16));
      }
      return "";
    },
  );
  return decoded.replace(/<br\s*\/?>/gi, "\n");
};

export const formatTextToNodes = (text: string): ReactNode => {
  const decoded = formatText(text);
  const lines = decoded.split(/\r?\n/);
  const children: (ReactNode | string)[] = lines.flatMap((line, i) =>
    i === 0 ? [line] : [createElement("br", { key: `br-${i}` }), line],
  );
  return createElement(Fragment, null, ...children);
};
