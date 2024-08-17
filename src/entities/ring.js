import k from "../kaplayCtx";

export function makeRing(pos, speed) {
  return k.add([
    k.sprite("ring", { anim: "spin" }),
    k.area(),
    k.scale(4),
    k.anchor("center"),
    k.move(k.vec2(-1, 0), speed),
    k.pos(pos),
    k.offscreen(),
    "ring",
  ]);
}
