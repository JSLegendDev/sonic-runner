import { makeMotobug } from "./entities/motobug";
import { makeRing } from "./entities/ring";
import { makeSonic } from "./entities/sonic";
import k from "./kaplayCtx";

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
k.loadSprite("ring", "graphics/ring.png", {
  sliceX: 16,
  sliceY: 1,
  anims: {
    spin: { from: 0, to: 15, loop: true, speed: 30 },
  },
});
k.loadSprite("motobug", "graphics/motobug.png", {
  sliceX: 5,
  sliceY: 1,
  anims: {
    run: { from: 0, to: 4, loop: true, speed: 8 },
  },
});
k.loadFont("mania", "fonts/mania.ttf");

k.scene("game", () => {
  k.setGravity(3000);
  const bgPieceWidth = 1920;
  const bgPieces = [
    k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.8)]),
    k.add([
      k.sprite("chemical-bg"),
      k.pos(1920, 0),
      k.scale(2),
      k.opacity(0.8),
    ]),
  ];

  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
    k.add([k.sprite("platforms"), k.pos(384, 450), k.scale(4)]),
  ];

  const sonic = makeSonic(k.vec2(200, 745));
  sonic.setControls();
  sonic.setEvents();

  const scoreText = k.add([
    k.text("SCORE : 0", { font: "mania", size: 64 }),
    k.pos(20, 20),
  ]);
  let score = 0;
  sonic.onCollide("ring", (ring) => {
    k.destroy(ring);
    score++;
    scoreText.text = `SCORE : ${score}`;
  });
  sonic.onCollide("motobug", (motobug) => {
    if (!sonic.isGrounded()) {
      k.destroy(motobug);
      sonic.play("jump");
      sonic.jump();
      score += 10;
      scoreText.text = `SCORE : ${score}`;
      return;
    }

    k.setData("final-score", score);
    k.go("gameover");
  });

  let gameSpeed = 300;
  k.loop(1, () => {
    gameSpeed += 50;
  });

  const spawnMotoBug = () => {
    const motobug = makeMotobug(k.vec2(1950, 773), gameSpeed + 300);
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }
      motobug.move(-gameSpeed / 2, 0);
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) k.destroy(motobug);
    });

    const waitTime = k.rand(0.5, 4);

    k.wait(waitTime, spawnMotoBug);
  };

  spawnMotoBug();

  k.loop(1, () => {
    const ring = makeRing(k.vec2(2000, 745));
    ring.onUpdate(() => {
      if (gameSpeed < 3000) {
        ring.move(-gameSpeed, 0);
        return;
      }
      ring.move(-gameSpeed / 2, 0);
    });
    ring.onExitScreen(() => {
      if (ring.pos.x < 0) k.destroy(ring);
    });
  });

  k.add([
    k.rect(1920, 300),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true }),
    "platform",
  ]);

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    // for jump effect
    bgPieces[0].moveTo(bgPieces[0].pos.x, -sonic.pos.y / 10 - 50);
    bgPieces[1].moveTo(bgPieces[1].pos.x, -sonic.pos.y / 10 - 50);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  });
});

k.scene("gameover", () => {
  k.add([
    k.text("GAME OVER", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 200),
  ]);
  k.add([
    k.text(`BEST SCORE : ${k.getData("final-score")}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y),
  ]);
  k.add([
    k.text(`CURRENT SCORE : ${k.getData("final-score")}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y),
  ]);

  k.wait(1, () => k.onKeyPress("space", () => k.go("game")));
});

k.go("game");
