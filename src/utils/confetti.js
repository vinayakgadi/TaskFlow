import confetti from 'canvas-confetti';

export function fireCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55
  });
  fire(0.2, {
    spread: 60
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}

export function fireMiniBurst(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 35,
    spread: 50,
    origin: { x, y },
    ticks: 120,
    gravity: 1.2,
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6']
  });
}
