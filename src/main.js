import { makeBuzzBomber } from "./entities/buzzbomber";
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
k.loadSprite("buzzbomber", "graphics/buzzbomber.png", {
  sliceX: 3,
  sliceY: 1,
  anims: {
    fly: { from: 0, to: 2, loop: true, speed: 6 },
  },
});
k.loadFont("mania", "fonts/mania.ttf");

k.scene("main-menu", () => {
  if (!k.getData("best-score")) k.setData("best-score", 0);
  k.onKeyPress("space", () => k.go("game"));
});

k.scene("game", () => {
  k.setGravity(3100);
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
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      score += 10;
      scoreText.text = `SCORE : ${score}`;
      return;
    }

    k.setData("current-score", score);
    k.go("gameover");
  });

  let gameSpeed = 300;
  k.loop(1, () => {
    gameSpeed += 50;
  });

  const spawnBuzzBomber = () => {
    const buzzbomber = makeBuzzBomber(k.vec2(1940, 700));
    buzzbomber.onUpdate(() => {
      if (gameSpeed < 3000) {
        buzzbomber.move(-(gameSpeed + 1000), 0);
        return;
      }
      buzzbomber.move(-gameSpeed, 0);
    });

    buzzbomber.onExitScreen(() => {
      if (buzzbomber.pos.x < 0) k.destroy(buzzbomber);
    });

    const waitTime = k.rand(4, 8);

    k.wait(waitTime, spawnBuzzBomber);
  };

  spawnBuzzBomber();

  const spawnMotoBug = () => {
    const motobug = makeMotobug(k.vec2(1950, 773));
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }
      motobug.move(-gameSpeed, 0);
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) k.destroy(motobug);
    });

    const waitTime = k.rand(0.5, 4);

    k.wait(waitTime, spawnMotoBug);
  };

  spawnMotoBug();

  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 745));
    ring.onUpdate(() => {
      ring.move(-gameSpeed, 0);
    });
    ring.onExitScreen(() => {
      if (ring.pos.x < 0) k.destroy(ring);
    });

    const waitTime = k.rand(0.5, 4);

    k.wait(waitTime, spawnRing);
  };

  spawnRing();

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
  let bestScore = k.getData("best-score");
  const currentScore = k.getData("current-score");

  if (bestScore < currentScore) {
    k.setData("best-score", currentScore);
    bestScore = currentScore;
  }

  k.add([
    k.text("GAME OVER", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 200),
  ]);
  k.add([
    k.text(`BEST SCORE : ${bestScore}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x - 400, k.center().y),
  ]);
  k.add([
    k.text(`CURRENT SCORE : ${currentScore}`, {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center().x + 400, k.center().y),
  ]);

  k.wait(1, () => k.onKeyPress("space", () => k.go("game")));
});

k.go("main-menu");
