import k from "../kaplayCtx";

export function makeBuzzBomber(pos) {
  return k.add([
    k.sprite("buzzbomber", { anim: "fly" }),
    k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 22) }),
    k.scale(4),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(),
    "enemy",
  ]);
}
