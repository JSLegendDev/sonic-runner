import kaplay from "kaplay";

const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true,
  background: [0, 0, 0],
});

k.loadSprite("greenhill-bg", "graphics/greenhill-bg.png");
k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("sonic", "graphics/sonic.png", {
  sliceX: 8,
  sliceY: 2,
  anims: {
    run: { from: 0, to: 7, loop: true, speed: 30 },
    jump: { from: 8, to: 15, loop: true, speed: 100 },
  },
});

k.scene("game", () => {
  k.setGravity(3000);
  const bgLeft = k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2)]);
  const bgRight = k.add([k.sprite("chemical-bg"), k.pos(1920, 0), k.scale(2)]);
  const bgPieces = [bgLeft, bgRight];

  const platforms = [
    k.add([
      k.sprite("platforms", { tiled: true, width: 384, height: 160 }),
      k.pos(0, 450),
      k.scale(4),
    ]),
    k.add([
      k.sprite("platforms", { tiled: true, width: 384, height: 160 }),
      k.pos(384, 450),
      k.scale(4),
    ]),
    k.add([
      k.sprite("platforms", { tiled: true, width: 384, height: 160 }),
      k.pos(384 * 2, 450),
      k.scale(4),
    ]),
  ];

  const sonic = k.add([
    k.sprite("sonic", { anim: "run" }),
    k.scale(4),
    k.area(),
    k.anchor("center"),
    k.pos(200, 745),
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
  sonic.setControls();
  sonic.setEvents();

  const platformHitbox = k.add([
    k.rect(1920, 300),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true }),
    "platform",
  ]);

  k.onUpdate(() => {
    for (const bgPiece of bgPieces) {
      bgPiece.moveTo(bgPiece.pos.x, -sonic.pos.y / 10 - 50);
      if (bgPiece.pos.x < -3840) {
        bgPieces.push(bgPieces.shift());
        bgPiece.moveTo(3840, 0);
      }
    }
    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + 3840, 0);

    for (const platform of platforms) {
      if (platform.pos.x < -1920) {
        platforms.push(platforms.shift());
        platform.moveTo(1920, 450);
      }
    }

    platforms[0].move(-4000, 0);
    platforms[1].moveTo(platforms[0].pos.x + 1532, 450);
    platforms[2].moveTo(platforms[1].pos.x + 1532, 450);
  });
});

k.go("game");
