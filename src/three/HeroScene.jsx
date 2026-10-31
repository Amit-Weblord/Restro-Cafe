import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '../lib/gsap';
import { readAccent } from '../lib/theme';

const { damp } = THREE.MathUtils;

/** Soft round alpha mask so the photo melts into the plate instead of a hard edge. */
function useFeatherMask() {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, size * 0.43, size / 2, size / 2, size * 0.5);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(1, '#000');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Lathe profile for a glossy black charger plate with a raised rim. */
function useChargerGeometry() {
  return useMemo(() => {
    const pts = [
      [0, 0],
      [1.16, 0],
      [1.22, 0.02],
      [1.33, 0.085],
      [1.41, 0.135],
      [1.45, 0.152],
      [1.465, 0.14],
      [1.42, 0.115],
      [1.31, 0.065],
      [1.17, 0.036],
      [0, 0.036],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(pts, 160);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Plate({ image, zoom, ready, progress, mouse, accent }) {
  const outer = useRef(null);
  const spin = useRef(null);
  const angle = useRef(0);
  const intro = useRef({ v: 0 });
  const texture = useTexture(image);
  const mask = useFeatherMask();
  const charger = useChargerGeometry();
  const { viewport, size, gl } = useThree();

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.center.set(0.5, 0.5);
    texture.repeat.set(1 / zoom, 1 / zoom);
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }, [texture, zoom, gl]);

  useEffect(() => {
    if (!ready) return undefined;
    const tween = gsap.to(intro.current, { v: 1, duration: 2.6, ease: 'expo.out', delay: 0.2 });
    return () => tween.kill();
  }, [ready]);

  useFrame((state, dt) => {
    const g = outer.current;
    if (!g) return;
    const v = intro.current.v;
    const p = progress.current;
    const m = mouse.current;
    const t = state.clock.elapsedTime;
    const portrait = size.width < size.height;

    // Responsive placement: right side on desktop, lower-centre on phones
    const fit = Math.min(1, viewport.width / (portrait ? 3.3 : 7.6)) * (portrait ? 1 : 0.94);
    const baseX = portrait ? viewport.width * 0.2 : viewport.width * 0.245;
    const baseY = portrait ? -viewport.height * 0.39 : -0.05;

    const targetX = baseX + (1 - v) * viewport.width * 0.45 + m.x * 0.12;
    const targetY = baseY + Math.sin(t * 0.9) * 0.05 + p * viewport.height * 0.55 + (1 - v) * 0.4;
    g.position.x = damp(g.position.x, targetX, 5, dt);
    g.position.y = damp(g.position.y, targetY, 5, dt);
    g.rotation.x = damp(g.rotation.x, 1.08 - m.y * 0.22 - p * 0.5, 4, dt);
    g.rotation.z = damp(g.rotation.z, -0.18 - m.x * 0.16 + p * 0.4, 4, dt);
    const s = fit * (0.35 + 0.65 * v) * (1 - p * 0.25);
    g.scale.setScalar(s);

    angle.current += dt * (0.14 + p * 1.6);
    spin.current.rotation.y = angle.current - (1 - v) * 5;
  });

  return (
    <group ref={outer} position={[viewport.width, 0, 0]} scale={0.01}>
      <group ref={spin}>
        <mesh geometry={charger}>
          <meshPhysicalMaterial color="#121009" roughness={0.28} metalness={0.15} clearcoat={1} clearcoatRoughness={0.12} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.039}>
          <circleGeometry args={[1.17, 128]} />
          <meshBasicMaterial map={texture} alphaMap={mask} transparent toneMapped={false} />
        </mesh>
        <mesh rotation-x={Math.PI / 2} position-y={0.152}>
          <torusGeometry args={[1.452, 0.013, 16, 200]} />
          <meshStandardMaterial color={accent} metalness={1} roughness={0.22} />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroScene({ image, zoom = 1, ready, progress, active }) {
  const mouse = useRef({ x: 0, y: 0 });
  const [accent, setAccent] = useState(readAccent);
  const [mobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onTheme = () => setAccent(readAccent());
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('themechange', onTheme);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('themechange', onTheme);
    };
  }, []);

  return (
    <Canvas
      className="!pointer-events-none"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, mobile ? 1.5 : 1.8]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 5]} intensity={1.6} />
      <pointLight position={[-4, -1, 3]} intensity={18} color={accent} />
      <Suspense fallback={null}>
        <Plate image={image} zoom={zoom} ready={ready} progress={progress} mouse={mouse} accent={accent} />
        <Environment key={accent} resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 3, 1]} rotation-x={Math.PI / 2.5} />
          <Lightformer form="rect" intensity={2} color={accent} position={[-5, 0, 2]} scale={[2, 8, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="circle" intensity={1.5} position={[5, 1, 1]} scale={3} rotation-y={-Math.PI / 2} />
        </Environment>
      </Suspense>
      <Sparkles count={mobile ? 35 : 70} scale={[9, 5, 3]} size={mobile ? 2.2 : 3} speed={0.35} opacity={0.85} color={accent} noise={1.2} />
    </Canvas>
  );
}
