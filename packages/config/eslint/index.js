import base from "./base.js";
import react from "./react.js";

/** 공통 base + React 설정. 앱별로 추가 설정을 spread 하여 사용 */
export const reactBase = [...base, ...react];

export { default as base } from "./base.js";
export { default as react } from "./react.js";
