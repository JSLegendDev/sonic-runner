import k from "../kaplayCtx";

export function makeMotobug(pos, speed) {
  return k.add([k.sprite("motobug", { anim: "run" }), k.pos(pos), k.scale(4)]);
}
