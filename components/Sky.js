'use client';
import { useEffect, useRef } from 'react';

export default function Sky() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, cx = cv.getContext('2d');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, stars = [], mx = 0, my = 0, raf;
    const size = () => {
      W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
      stars = Array.from({ length: Math.round((W * H) / 5500) }, () => ({
        x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.9 + 0.1, p: Math.random() * 6
      }));
    };
    const move = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    const draw = (t) => {
      cx.clearRect(0, 0, W, H);
      for (const s of stars) {
        cx.globalAlpha = s.z * (still ? 1 : 0.65 + 0.35 * Math.sin(t / 900 + s.p));
        cx.fillStyle = s.z > 0.8 ? '#e8c987' : '#dfe6f7';
        cx.beginPath(); cx.arc(s.x - mx * 22 * s.z, s.y - my * 22 * s.z, s.z * 1.4, 0, 6.283); cx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    size(); raf = requestAnimationFrame(draw);
    addEventListener('resize', size); addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} className="sky" />;
}
