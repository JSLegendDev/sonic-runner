import k from "../kaplayCtx";

export function makeSonic(pos) {
  return k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(pos),
    k.body({ jumpForce: 1700 }),
    {
      setControls() {
        k.onKeyPress("space", () => {
          if (this.isGrounded()) {
            this.play("jump");
            this.jump();
          }
        });
      },
      setEvents() {
        this.onGround(() => {
          this.play("run");
        });
      },
    },
  ]);
}
