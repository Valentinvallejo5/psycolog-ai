import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Film grain shader
const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    intensity: { value: 0 },
    grainSize: { value: 1.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    uniform float grainSize;
    varying vec2 vUv;
    
    float random(vec2 p) {
      return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      
      vec2 grainUV = vUv * grainSize;
      float grain = random(grainUV + time * 0.1);
      grain = (grain - 0.5) * intensity;
      
      color.rgb += grain;
      
      float vignette = 1.0 - length(vUv - 0.5) * 0.3 * intensity;
      color.rgb *= vignette;
      
      gl_FragColor = color;
    }
  `
};

// Gradient distortion shader
const GradientDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    distortion: { value: 0 },
    mouseX: { value: 0.5 },
    mouseY: { value: 0.5 },
    gradientShift: { value: 0 },
    bloomThreshold: { value: 0.8 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float distortion;
    uniform float mouseX;
    uniform float mouseY;
    uniform float gradientShift;
    uniform float bloomThreshold;
    varying vec2 vUv;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 mouse = vec2(mouseX, mouseY);
      float dist = distance(uv, mouse);
      
      float wave = sin(dist * 10.0 - time * 2.0) * distortion;
      uv += normalize(uv - mouse) * wave * 0.02;
      
      vec4 color = texture2D(tDiffuse, uv);
      
      float gradientAngle = time * 0.5 + gradientShift;
      float gradientPos = uv.x * cos(gradientAngle) + uv.y * sin(gradientAngle);
      vec3 gradientColor = hsv2rgb(vec3(gradientPos + time * 0.1, 0.7, 1.0));
      
      color.rgb = mix(color.rgb, gradientColor, 0.3 * distortion);
      
      float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      if (brightness > bloomThreshold * (1.0 - distortion * 0.3)) {
        color.rgb *= 1.0 + distortion * 0.5;
      }
      
      float r = texture2D(tDiffuse, uv + vec2(0.002, 0.0) * distortion).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - vec2(0.002, 0.0) * distortion).b;
      
      vec3 finalColor = vec3(r, g, b);
      finalColor = mix(finalColor, gradientColor, 0.2 * distortion);
      
      gl_FragColor = vec4(finalColor, color.a);
    }
  `
};

export const AdvancedButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = ''
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const borderGradientRef = useRef<SVGRectElement>(null);
  const filmGrainRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const distortionPassRef = useRef<ShaderPass | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const filmGrainPassRef = useRef<ShaderPass | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.0,
      0.6,
      0.7
    );
    bloomPassRef.current = bloomPass;
    composer.addPass(bloomPass);

    const distortionPass = new ShaderPass(GradientDistortionShader);
    distortionPassRef.current = distortionPass;
    composer.addPass(distortionPass);

    const filmGrainPass = new ShaderPass(FilmGrainShader);
    filmGrainPassRef.current = filmGrainPass;
    composer.addPass(filmGrainPass);

    // Malva/Purple gradient colors - adapted to psicolog.ia theme
    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0xC9A6FF) }, // Malva primary
        color2: { value: new THREE.Color(0xB39DDB) }, // Lighter purple
        color3: { value: new THREE.Color(0xFFD8F2) }, // Soft pink accent
        time: { value: 0 },
        mouseX: { value: 0.5 },
        mouseY: { value: 0.5 },
        hover: { value: 0 },
        bloomStrength: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform float hover;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float displacement = sin(pos.x * 10.0 + time) * sin(pos.y * 10.0 + time) * 0.02 * hover;
          pos.z += displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        uniform float hover;
        uniform float bloomStrength;
        varying vec2 vUv;
        
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 mouse = vec2(mouseX, mouseY);
          
          float mouseDist = distance(uv, mouse);
          float mouseInfluence = 1.0 - smoothstep(0.0, 0.5, mouseDist);
          
          float noise = snoise(uv * 3.0 + time * 0.2) * 0.5 + 0.5;
          
          vec3 gradient = mix(color1, color2, uv.x + sin(time * 0.5) * 0.2);
          gradient = mix(gradient, color3, uv.y + cos(time * 0.3) * 0.2);
          
          gradient = mix(gradient, color3, noise * 0.3);
          
          vec3 mouseGradient = mix(color2, color3, mouseInfluence);
          gradient = mix(gradient, mouseGradient, hover * 0.5);
          
          float radial = 1.0 - length(uv - 0.5) * 2.0;
          radial = smoothstep(0.0, 1.0, radial);
          gradient *= 0.8 + radial * 0.2;
          
          float shimmer = sin(uv.x * 20.0 - time * 3.0) * sin(uv.y * 20.0 + time * 2.0);
          shimmer = shimmer * 0.05 * hover;
          gradient += shimmer;
          
          float bloomBoost = 1.0 + bloomStrength * mouseInfluence * 2.0;
          gradient *= bloomBoost;
          
          float hotSpot = smoothstep(0.3, 0.0, mouseDist) * hover;
          gradient += vec3(hotSpot * 0.5);
          
          gl_FragColor = vec4(gradient, 1.0);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = performance.now() * 0.001;
      
      if (meshRef.current && meshRef.current.material) {
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        mat.uniforms.time.value = time;
        mat.uniforms.hover.value = gsap.utils.interpolate(
          mat.uniforms.hover.value,
          isHovered ? 1 : 0,
          0.1
        );
        mat.uniforms.bloomStrength.value = gsap.utils.interpolate(
          mat.uniforms.bloomStrength.value,
          isHovered ? 1 : 0,
          0.1
        );
      }
      
      if (bloomPassRef.current) {
        bloomPassRef.current.strength = gsap.utils.interpolate(
          bloomPassRef.current.strength,
          isHovered ? 1.5 : 0,
          0.1
        );
      }
      
      if (filmGrainPassRef.current && filmGrainPassRef.current.uniforms) {
        filmGrainPassRef.current.uniforms.time.value = time;
        filmGrainPassRef.current.uniforms.intensity.value = gsap.utils.interpolate(
          filmGrainPassRef.current.uniforms.intensity.value,
          isHovered ? 0.3 : 0,
          0.1
        );
      }
      
      if (distortionPassRef.current && distortionPassRef.current.uniforms) {
        distortionPassRef.current.uniforms.time.value = time;
        distortionPassRef.current.uniforms.distortion.value = gsap.utils.interpolate(
          distortionPassRef.current.uniforms.distortion.value,
          isHovered ? 1 : 0,
          0.1
        );
        distortionPassRef.current.uniforms.gradientShift.value = mousePos.x * Math.PI * 2;
      }
      
      if (composerRef.current) {
        composerRef.current.render();
      }
    };

    const handleResize = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        renderer.setSize(rect.width, rect.height);
        composer.setSize(rect.width, rect.height);
      }
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, []);

  useEffect(() => {
  }, [isHovered, mousePos]);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });
    
    tl.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(textRef.current, {
      letterSpacing: '0.05em',
      duration: 0.3,
      ease: 'power2.out'
    }, 0)
    .to(glowRef.current, {
      opacity: 1,
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    }, 0)
    .to(gradientRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    }, 0);

    if (borderGradientRef.current) {
      tl.to(borderGradientRef.current, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0);
    }

    if (filmGrainRef.current) {
      tl.to(filmGrainRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);
    }

    if (buttonRef.current) {
      (buttonRef.current as any)._timeline = tl;
    }

    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        '--gradient-angle': '360deg',
        duration: 10,
        repeat: -1,
        ease: 'none'
      });
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    
    if (buttonRef.current && (buttonRef.current as any)._timeline) {
      (buttonRef.current as any)._timeline.play();
    }
    
    if (rippleRef.current) {
      gsap.to(rippleRef.current, {
        scale: 1,
        opacity: 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        filter: 'blur(40px)',
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    
    if (buttonRef.current && (buttonRef.current as any)._timeline) {
      (buttonRef.current as any)._timeline.reverse();
    }
    
    if (rippleRef.current) {
      gsap.to(rippleRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        filter: 'blur(20px)',
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePos({ x, y });
    
    if (distortionPassRef.current && distortionPassRef.current.uniforms) {
      distortionPassRef.current.uniforms.mouseX.value = x;
      distortionPassRef.current.uniforms.mouseY.value = y;
    }

    if (meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.mouseX.value = x;
        mat.uniforms.mouseY.value = y;
      }
    }

    if (rippleRef.current) {
      gsap.to(rippleRef.current, {
        x: (x - 0.5) * rect.width,
        y: (y - 0.5) * rect.height,
        duration: 0.1
      });
    }

    buttonRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
    buttonRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple gradient-ripple bloom-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    buttonRef.current.appendChild(ripple);
    
    gsap.fromTo(ripple, {
      scale: 0,
      opacity: 1
    }, {
      scale: 3,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
    
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        opacity: 1,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }

    if (bloomPassRef.current) {
      gsap.to(bloomPassRef.current, {
        strength: 2.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
    
    onClick?.(e);
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={buttonRef}
      className={`advanced-button relative overflow-hidden rounded-lg font-semibold text-white transition-all ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      disabled={disabled}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      } as React.CSSProperties}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div ref={filmGrainRef} className="absolute inset-0 opacity-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" style={{ animation: 'grain 0.5s steps(10) infinite' }} />
      
      <div ref={gradientRef} className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-r from-primary via-accent to-secondary" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="border-gradient-malva" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9A6FF">
              <animate attributeName="stop-color" values="#C9A6FF;#B39DDB;#FFD8F2;#C9A6FF" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#B39DDB">
              <animate attributeName="stop-color" values="#B39DDB;#FFD8F2;#C9A6FF;#B39DDB" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#FFD8F2">
              <animate attributeName="stop-color" values="#FFD8F2;#C9A6FF;#B39DDB;#FFD8F2" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <rect
          ref={borderGradientRef}
          x="1"
          y="1"
          width="98"
          height="98"
          fill="none"
          stroke="url(#border-gradient-malva)"
          strokeWidth="2"
          strokeDasharray="400"
          strokeDashoffset="400"
          rx="8"
        />
      </svg>
      
      <div ref={glowRef} className="absolute inset-0 opacity-0 bg-primary/30 blur-xl pointer-events-none" style={{ filter: 'blur(20px)' }} />
      <div ref={rippleRef} className="absolute w-8 h-8 rounded-full bg-white/20 pointer-events-none" style={{ transform: 'scale(0)' }} />
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
    </button>
  );
};
