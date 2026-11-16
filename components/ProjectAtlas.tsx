"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { projects } from "@/content/projects";

const markerPositions: readonly (readonly [number, number])[] = [
  [-1.6, -0.35],
  [-0.75, 0.55],
  [0.2, -0.55],
  [1.25, 0.35],
  [1.85, -0.55],
];

export function ProjectAtlas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const applySelectionRef = useRef<((index: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 4.7, 8.5);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const terrain = new THREE.Group();
    terrain.rotation.x = -0.12;
    scene.add(terrain);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x27303c, 2.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(-3, 7, 5);
    scene.add(keyLight);

    const contourMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.58,
    });
    const contours: THREE.LineLoop[] = [];

    for (let ring = 0; ring < 8; ring += 1) {
      const progress = ring / 7;
      const radiusX = 0.62 + progress * 2.55;
      const radiusZ = 0.42 + progress * 1.35;
      const points: THREE.Vector3[] = [];

      for (let step = 0; step < 100; step += 1) {
        const angle = (step / 100) * Math.PI * 2;
        const unevenness = 1 + 0.035 * Math.sin(angle * 3 + ring * 0.7);
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radiusX * unevenness,
            (1 - progress) * 0.28 + 0.025 * Math.sin(angle * 2 + ring),
            Math.sin(angle) * radiusZ * unevenness,
          ),
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const contour = new THREE.LineLoop(geometry, contourMaterial);
      terrain.add(contour);
      contours.push(contour);
    }

    const markers = projects.map((_, index) => {
      const group = new THREE.Group();
      const [x, z] = markerPositions[index] ?? [0, 0];
      group.position.set(x, 0.27, z);

      const pinMaterial = new THREE.MeshStandardMaterial({
        color: 0x5b9bf8,
        roughness: 0.48,
        metalness: 0.08,
      });
      const base = new THREE.Mesh(
        new THREE.SphereGeometry(0.115, 16, 12),
        pinMaterial,
      );
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.07, 0.22, 10),
        pinMaterial,
      );
      stem.position.y = -0.13;
      group.add(base, stem);
      terrain.add(group);
      return { group, pinMaterial };
    });

    const readTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      const muted = styles.getPropertyValue("--ink-3").trim();
      contourMaterial.color.set(muted || "#6f7280");
      markers.forEach(({ pinMaterial }) => {
        pinMaterial.color.set(muted || "#6f7280");
      });
      renderer.render(scene, camera);
    };

    const selectMarker = (index: number) => {
      activeIndexRef.current = index;
      markers.forEach(({ group, pinMaterial }, markerIndex) => {
        const selected = markerIndex === index;
        group.scale.setScalar(selected ? 1.22 : 0.82);
        pinMaterial.color.set(
          selected
            ? getComputedStyle(document.documentElement)
                .getPropertyValue("--accent")
                .trim() || "#5b9bf8"
            : getComputedStyle(document.documentElement)
                .getPropertyValue("--ink-3")
                .trim() || "#6f7280",
        );
      });
      renderer.render(scene, camera);
    };

    applySelectionRef.current = selectMarker;

    const resizeObserver = new ResizeObserver(() => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(host);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const markerMeshes = markers
      .map(({ group }) => group.children[0])
      .filter((mesh): mesh is THREE.Object3D => mesh !== undefined);
    const findMarker = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(markerMeshes, false)[0];
      return hit ? markerMeshes.indexOf(hit.object) : -1;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const index = findMarker(event);
      renderer.domElement.style.cursor = index >= 0 ? "pointer" : "";
      if (
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const bounds = renderer.domElement.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        terrain.rotation.y = x * 0.1;
        terrain.rotation.x = -0.12 - y * 0.05;
        renderer.render(scene, camera);
      }
    };
    const handlePointerLeave = () => {
      renderer.domElement.style.cursor = "";
      terrain.rotation.set(-0.12, 0, 0);
      renderer.render(scene, camera);
    };
    const handlePointerDown = (event: PointerEvent) => {
      const index = findMarker(event);
      if (index >= 0) {
        setActiveIndex(index);
        selectMarker(index);
        document
          .getElementById(`project-${projects[index]?.slug}`)
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
            block: "center",
          });
      }
    };

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);

    const themeObserver = new MutationObserver(() => {
      readTheme();
      selectMarker(activeIndexRef.current);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    readTheme();
    selectMarker(0);

    return () => {
      applySelectionRef.current = null;
      resizeObserver.disconnect();
      themeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      terrain.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      contourMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const chooseProject = (index: number) => {
    setActiveIndex(index);
    activeIndexRef.current = index;
    applySelectionRef.current?.(index);
    const slug = projects[index]?.slug;
    if (!slug) return;
    document.getElementById(`project-${slug}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "center",
    });
  };

  return (
    <div className="project-atlas reveal" role="group" aria-label="Explore projects">
      <div ref={hostRef} className="project-atlas__scene" />
      <div className="project-atlas__legend" role="group" aria-label="Projects">
        {projects.map((project, index) => (
          <button
            key={project.slug}
            type="button"
            className="project-atlas__item"
            aria-pressed={activeIndex === index}
            onClick={() => chooseProject(index)}
          >
            <span className="project-atlas__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="truncate">{project.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}