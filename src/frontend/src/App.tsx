import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Briefcase,
  ChevronDown,
  Code2,
  ExternalLink,
  FlaskConical,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Menu,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as THREE from "three";
import { useActor } from "./hooks/useActor";

// ─── Three.js Background ─────────────────────────────────────────────────────
function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 800 : 2000;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050a14, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;

    // Particles
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      velocities.push(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        0,
      );
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.35,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Wireframe icosahedra
    const icoCount = isMobile ? 8 : 15;
    const icos: THREE.Mesh[] = [];
    const icoSpeeds: { rx: number; ry: number; rz: number }[] = [];
    for (let i = 0; i < icoCount; i++) {
      const size = Math.random() * 4 + 1;
      const geo = new THREE.IcosahedronGeometry(size, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60 - 20,
      );
      icos.push(mesh);
      icoSpeeds.push({
        rx: (Math.random() - 0.5) * 0.005,
        ry: (Math.random() - 0.5) * 0.005,
        rz: (Math.random() - 0.5) * 0.003,
      });
      scene.add(mesh);
    }

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const pos = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        (pos.array as Float32Array)[i * 3] += velocities[i * 3];
        (pos.array as Float32Array)[i * 3 + 1] += velocities[i * 3 + 1];
        if ((pos.array as Float32Array)[i * 3] > 100)
          (pos.array as Float32Array)[i * 3] = -100;
        if ((pos.array as Float32Array)[i * 3] < -100)
          (pos.array as Float32Array)[i * 3] = 100;
        if ((pos.array as Float32Array)[i * 3 + 1] > 100)
          (pos.array as Float32Array)[i * 3 + 1] = -100;
        if ((pos.array as Float32Array)[i * 3 + 1] < -100)
          (pos.array as Float32Array)[i * 3 + 1] = 100;
      }
      pos.needsUpdate = true;
      for (let idx = 0; idx < icos.length; idx++) {
        icos[idx].rotation.x += icoSpeeds[idx].rx;
        icos[idx].rotation.y += icoSpeeds[idx].ry;
        icos[idx].rotation.z += icoSpeeds[idx].rz;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("visible");
        }
      },
      { threshold: 0.1 },
    );
    for (const el of els) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

// ─── Navigation ──────────────────────────────────────────────────────────────
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  // Contact gets a special CTA treatment — handled with nav-link-cta class
  { label: "Contact", href: "#contact", cta: true },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-sans text-lg font-black gradient-text tracking-[-0.03em] hover:opacity-80 transition-opacity"
        >
          Alex Morgan
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <button
              type="button"
              key={link.href}
              data-ocid={`nav.link.${i + 1}`}
              onClick={() => handleNav(link.href)}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-md ${
                link.cta
                  ? "nav-link-cta"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          data-ocid="nav.toggle"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-card border-t border-border/50 px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <button
              type="button"
              key={link.href}
              data-ocid={`nav.link.${i + 1}`}
              onClick={() => handleNav(link.href)}
              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-all ${
                link.cta
                  ? "text-cyan border border-cyan/20 hover:bg-cyan/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollDown = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Multi-layer radial atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.78 0.18 195 / 0.07) 0%, transparent 65%)",
            "radial-gradient(ellipse 40% 35% at 30% 70%, oklch(0.65 0.2 290 / 0.05) 0%, transparent 55%)",
            "radial-gradient(ellipse 30% 25% at 75% 30%, oklch(0.68 0.18 220 / 0.04) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Availability pill */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card mb-10 text-xs font-semibold tracking-[0.3em] uppercase"
          style={{
            color: "oklch(0.78 0.18 195)",
            border: "1px solid oklch(0.78 0.18 195 / 0.25)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.78 0.18 195)",
              boxShadow: "0 0 6px oklch(0.78 0.18 195)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Open to opportunities
        </div>

        {/* ── FIX 1: Hero title — clamp-scaled, ultra-tight tracking ── */}
        <h1 className="hero-display mb-5">
          <span className="block" style={{ color: "oklch(0.97 0.005 265)" }}>
            Alex
          </span>
          <span className="block gradient-text">Morgan</span>
        </h1>

        {/* Role badges — refined sizing + spacing */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-7">
          {["Project Manager", "QA Specialist", "Software Developer"].map(
            (title) => (
              <span
                key={title}
                className="px-4 py-1.5 rounded-full text-xs font-bold glass-card tracking-wide uppercase"
                style={{
                  border: "1px solid oklch(0.78 0.18 195 / 0.28)",
                  color: "oklch(0.78 0.18 195)",
                  letterSpacing: "0.08em",
                }}
              >
                {title}
              </span>
            ),
          )}
        </div>

        {/* ── FIX 1: Tagline — larger, more weight ── */}
        <p
          className="text-xl sm:text-2xl max-w-2xl mx-auto mb-12 leading-[1.5]"
          style={{ color: "oklch(0.68 0.025 255)" }}
        >
          Building quality software, leading agile teams,{" "}
          <span style={{ color: "oklch(0.82 0.015 265)" }}>
            ensuring excellence at every stage.
          </span>
        </p>

        {/* ── FIX 3: CTA buttons — primary with pulsing aura, secondary properly bordered ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={scrollToProjects}
            className="btn-primary-cta inline-flex items-center gap-2.5 px-9 py-4 text-base"
          >
            View My Work
            <ExternalLink size={17} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-secondary-cta inline-flex items-center gap-2 px-9 py-4 text-base"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={scrollDown}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-300 hover:-translate-y-1"
        aria-label="Scroll down"
        style={{
          color: "oklch(0.45 0.04 265)",
          animation: "float 6s ease-in-out infinite",
        }}
      >
        <ChevronDown size={30} strokeWidth={1.5} />
      </button>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="section-padding relative z-10">
      <div className="section-sep mb-0" />
      <div className="max-w-6xl mx-auto pt-0">
        <SectionHeader label="About Me" title="Who I Am" />

        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Avatar card */}
          <div className="reveal flex justify-center md:justify-start">
            <div className="relative">
              <div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl glass-card flex items-center justify-center"
                style={{ border: "1px solid oklch(0.78 0.18 195 / 0.25)" }}
              >
                {/* Inner avatar circle */}
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle at 40% 35%, oklch(0.78 0.18 195 / 0.25), oklch(0.65 0.2 290 / 0.15))",
                    border: "1.5px solid oklch(0.78 0.18 195 / 0.4)",
                    boxShadow:
                      "0 0 30px oklch(0.78 0.18 195 / 0.15), inset 0 1px 0 oklch(0.98 0.01 0 / 0.1)",
                  }}
                >
                  <span
                    className="gradient-text"
                    style={{
                      fontSize: "2rem",
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    AM
                  </span>
                </div>
                {/* Corner accents — top-right and bottom-left only */}
                <span
                  className="absolute top-4 right-4 w-2.5 h-2.5 rounded-sm"
                  style={{ background: "oklch(0.78 0.18 195)", opacity: 0.8 }}
                />
                <span
                  className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-sm"
                  style={{ background: "oklch(0.65 0.2 290)", opacity: 0.8 }}
                />
              </div>
              {/* Floating stat badge */}
              <div
                className="absolute -bottom-5 -right-5 glass-card px-4 py-2.5 rounded-xl text-xs font-bold"
                style={{
                  border: "1px solid oklch(0.78 0.18 195 / 0.3)",
                  color: "oklch(0.78 0.18 195)",
                  boxShadow: "0 0 16px oklch(0.78 0.18 195 / 0.12)",
                }}
              >
                10+ Years Experience
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="reveal reveal-delay-2 space-y-6">
            <p
              className="text-lg leading-[1.8]"
              style={{ color: "oklch(0.68 0.025 255)" }}
            >
              I'm a versatile technology professional with over a decade of
              experience spanning software development, quality assurance, and
              project management. I thrive at the intersection of code and
              process — writing clean, testable software while driving teams
              toward delivery excellence.
            </p>
            <p
              className="text-lg leading-[1.8]"
              style={{ color: "oklch(0.68 0.025 255)" }}
            >
              My philosophy is simple:{" "}
              <span
                className="font-semibold"
                style={{ color: "oklch(0.82 0.14 195)" }}
              >
                quality isn't a phase, it's a mindset
              </span>
              . Whether architecting microservices, automating test suites, or
              orchestrating multi-team sprints — I bring relentless attention to
              detail and commitment to measurable outcomes.
            </p>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { value: "10+", label: "Years" },
                { value: "50+", label: "Projects" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-2xl p-5 text-center"
                  style={{ border: "1px solid oklch(0.78 0.18 195 / 0.12)" }}
                >
                  <div
                    className="text-2xl font-black gradient-text mb-0.5"
                    style={{ letterSpacing: "-0.03em" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.55 0.04 255)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
const skillCategories = [
  {
    icon: Briefcase,
    title: "Agile / Scrum",
    color: "0.78 0.18 195",
    skills: [
      "Jira",
      "Confluence",
      "Scrum",
      "Kanban",
      "SAFe",
      "Sprint Planning",
    ],
  },
  {
    icon: FlaskConical,
    title: "Testing Tools",
    color: "0.65 0.2 290",
    skills: ["Selenium", "Cypress", "Postman", "JUnit", "TestRail", "Jest"],
  },
  {
    icon: Code2,
    title: "Programming",
    color: "0.78 0.18 195",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "Bash"],
  },
  {
    icon: Award,
    title: "Frameworks & Tools",
    color: "0.65 0.2 290",
    skills: ["React", "Node.js", "Git", "Docker", "CI/CD", "Kubernetes"],
  },
];

function Skills() {
  return (
    <section id="skills" className="section-padding relative z-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="Expertise" title="Skills & Technologies" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              // ── FIX 2: glass-card-interactive replaces raw scale hover ──
              <div
                key={cat.title}
                data-ocid={`skills.card.${idx + 1}`}
                className={`reveal reveal-delay-${idx + 1} glass-card-interactive rounded-2xl p-6`}
                style={{ border: `1px solid oklch(${cat.color} / 0.18)` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `oklch(${cat.color} / 0.12)`,
                    border: `1px solid oklch(${cat.color} / 0.25)`,
                    boxShadow: `0 0 16px oklch(${cat.color} / 0.12)`,
                  }}
                >
                  <Icon size={20} style={{ color: `oklch(${cat.color})` }} />
                </div>
                <h3
                  className="font-sans font-bold text-base mb-4 tracking-tight"
                  style={{ color: `oklch(${cat.color})` }}
                >
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{
                        background: `oklch(${cat.color} / 0.09)`,
                        color: `oklch(${cat.color} / 0.9)`,
                        border: `1px solid oklch(${cat.color} / 0.18)`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const projects = [
  {
    title: "E-Commerce Platform Overhaul",
    description:
      "Full-stack re-architecture of legacy monolith into a scalable, performant shopping platform with modern UX.",
    tags: ["React", "Node.js", "PostgreSQL"],
    results: ["40% faster load times", "25% conversion increase"],
    color: "0.78 0.18 195",
  },
  {
    title: "QA Automation Framework",
    description:
      "Built comprehensive automated testing infrastructure from scratch, integrating CI/CD pipelines with zero-tolerance defect policies.",
    tags: ["Selenium", "Python", "Jenkins"],
    results: ["70% less manual testing", "Zero critical prod bugs"],
    color: "0.65 0.2 290",
  },
  {
    title: "Agile Transformation Initiative",
    description:
      "Led organization-wide adoption of Scrum practices across 5 product teams, establishing KPIs and coaching frameworks.",
    tags: ["Jira", "Confluence", "Scrum"],
    results: ["15 sprints on-time", "35% velocity increase"],
    color: "0.72 0.16 165",
  },
  {
    title: "Microservices Migration",
    description:
      "Orchestrated migration of monolithic application to containerized microservices architecture with zero downtime deployment.",
    tags: ["Docker", "Kubernetes", "Node.js"],
    results: ["99.9% system uptime", "50% faster deployments"],
    color: "0.68 0.18 220",
  },
];

function Projects() {
  return (
    <section id="projects" className="section-padding relative z-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="Portfolio" title="Featured Projects" />
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((proj, idx) => (
            // ── FIX 2: glass-card-interactive for proper hover depth ──
            <div
              key={proj.title}
              data-ocid={`projects.item.${idx + 1}`}
              className={`reveal reveal-delay-${(idx % 2) + 1} glass-card-interactive rounded-2xl p-7`}
              style={{ border: `1px solid oklch(${proj.color} / 0.18)` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3
                  className="font-sans font-bold text-xl leading-tight pr-4 tracking-tight"
                  style={{ color: "oklch(0.94 0.008 265)" }}
                >
                  {proj.title}
                </h3>
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: `oklch(${proj.color} / 0.12)`,
                    border: `1px solid oklch(${proj.color} / 0.22)`,
                  }}
                >
                  <ExternalLink
                    size={14}
                    style={{ color: `oklch(${proj.color})` }}
                  />
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "oklch(0.62 0.025 255)" }}
              >
                {proj.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: `oklch(${proj.color} / 0.09)`,
                      color: `oklch(${proj.color})`,
                      border: `1px solid oklch(${proj.color} / 0.22)`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="pt-4 border-t"
                style={{ borderColor: `oklch(${proj.color} / 0.12)` }}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  {proj.results.map((r) => (
                    <div
                      key={r}
                      className="text-xs font-bold px-3 py-2.5 rounded-xl text-center"
                      style={{
                        background: `oklch(${proj.color} / 0.07)`,
                        color: `oklch(${proj.color})`,
                        border: `1px solid oklch(${proj.color} / 0.15)`,
                      }}
                    >
                      ✦ {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
const experiences = [
  {
    role: "Senior Project Manager",
    company: "TechCorp Solutions",
    period: "2021 – Present",
    details: [
      "Led cross-functional teams of 20+ engineers, designers, and stakeholders",
      "Managed $2M+ annual project budgets with consistent on-time delivery",
      "Implemented OKR framework improving team alignment by 40%",
    ],
    color: "0.78 0.18 195",
  },
  {
    role: "QA Lead",
    company: "Innovate Systems",
    period: "2018 – 2021",
    details: [
      "Built QA processes from scratch for a 50-person engineering org",
      "Achieved 98% automated test coverage across all core services",
      "Reduced production incidents by 85% in 18 months",
    ],
    color: "0.65 0.2 290",
  },
  {
    role: "Software Developer",
    company: "CodeBase Inc.",
    period: "2015 – 2018",
    details: [
      "Full-stack development using React, Node.js, and PostgreSQL",
      "Designed and implemented 30+ REST API endpoints",
      "Optimized database queries resulting in 60% faster page loads",
    ],
    color: "0.72 0.16 165",
  },
];

function Experience() {
  return (
    <section id="experience" className="section-padding relative z-10">
      <div className="max-w-4xl mx-auto">
        <SectionHeader label="History" title="Work Experience" />
        <div className="relative">
          {/* Timeline gradient line */}
          <div className="absolute left-6 md:left-8 top-4 bottom-4 w-px timeline-line" />

          <div className="space-y-7">
            {experiences.map((exp, idx) => (
              <div
                key={exp.role}
                className={`reveal reveal-delay-${idx + 1} flex gap-7 md:gap-10`}
              >
                {/* Timeline node */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div
                    className="w-12 md:w-16 h-12 md:h-16 rounded-full glass-card flex items-center justify-center"
                    style={{
                      border: `1.5px solid oklch(${exp.color} / 0.45)`,
                      boxShadow: `0 0 20px oklch(${exp.color} / 0.2), inset 0 1px 0 oklch(0.98 0.01 0 / 0.08)`,
                    }}
                  >
                    <Briefcase
                      size={17}
                      style={{ color: `oklch(${exp.color})` }}
                    />
                  </div>
                </div>

                {/* Experience card */}
                <div
                  className="flex-1 glass-card-interactive rounded-2xl p-6 mb-1"
                  style={{ border: `1px solid oklch(${exp.color} / 0.16)` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div>
                      <h3
                        className="font-sans font-bold text-xl tracking-tight mb-0.5"
                        style={{ color: "oklch(0.94 0.008 265)" }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: `oklch(${exp.color})` }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold font-mono px-3 py-1.5 rounded-lg"
                      style={{
                        background: `oklch(${exp.color} / 0.1)`,
                        color: `oklch(${exp.color})`,
                        border: `1px solid oklch(${exp.color} / 0.22)`,
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {exp.details.map((d) => (
                      <li
                        key={d}
                        className="flex gap-2.5 text-sm leading-relaxed"
                        style={{ color: "oklch(0.62 0.025 255)" }}
                      >
                        <span
                          className="mt-0.5 shrink-0 text-xs"
                          style={{ color: `oklch(${exp.color} / 0.8)` }}
                        >
                          ▸
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────
const certs = [
  {
    title: "PMP – Project Management Professional",
    issuer: "PMI",
    year: "2022",
    color: "0.78 0.18 195",
  },
  {
    title: "ISTQB Certified Tester",
    issuer: "ISTQB",
    year: "2019",
    color: "0.65 0.2 290",
  },
  {
    title: "AWS Certified Developer",
    issuer: "Amazon",
    year: "2021",
    color: "0.72 0.16 165",
  },
  {
    title: "Certified Scrum Master",
    issuer: "Scrum Alliance",
    year: "2020",
    color: "0.68 0.18 220",
  },
];

function Certifications() {
  return (
    <section id="certifications" className="section-padding relative z-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="Credentials" title="Certifications" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certs.map((cert, idx) => (
            // ── FIX 2: glass-card-interactive for hover depth ──
            <div
              key={cert.title}
              className={`reveal reveal-delay-${idx + 1} glass-card-interactive rounded-2xl p-7 text-center`}
              style={{ border: `1px solid oklch(${cert.color} / 0.22)` }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: `oklch(${cert.color} / 0.12)`,
                  border: `1.5px solid oklch(${cert.color} / 0.35)`,
                  boxShadow: `0 0 22px oklch(${cert.color} / 0.2), inset 0 1px 0 oklch(0.98 0.01 0 / 0.08)`,
                }}
              >
                <Award size={22} style={{ color: `oklch(${cert.color})` }} />
              </div>
              <h3
                className="font-sans font-bold text-sm leading-snug mb-2.5 tracking-tight"
                style={{ color: "oklch(0.9 0.008 265)" }}
              >
                {cert.title}
              </h3>
              <p
                className="text-xs font-bold mb-1"
                style={{ color: `oklch(${cert.color})` }}
              >
                {cert.issuer}
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: "oklch(0.5 0.03 265)" }}
              >
                {cert.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const { actor } = useActor();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setStatus("loading");
    try {
      await actor?.submitContact(form.name, form.email, form.message);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent! I'll get back to you soon.");
    } catch {
      setStatus("error");
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="section-padding relative z-10">
      <div className="max-w-5xl mx-auto">
        <SectionHeader label="Get In Touch" title="Contact Me" />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: info */}
          <div className="reveal space-y-7">
            <p
              className="text-lg leading-[1.75]"
              style={{ color: "oklch(0.65 0.025 255)" }}
            >
              Have a project in mind, need a PM, or just want to connect? My
              inbox is always open.
            </p>

            {/* Email link */}
            <a
              href="mailto:alex.morgan@email.com"
              className="flex items-center gap-3.5 glass-card-interactive rounded-2xl p-4 group"
              style={{ border: "1px solid oklch(0.78 0.18 195 / 0.16)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.78 0.18 195 / 0.12)",
                  border: "1px solid oklch(0.78 0.18 195 / 0.22)",
                }}
              >
                <Mail size={18} style={{ color: "oklch(0.78 0.18 195)" }} />
              </div>
              <span
                className="text-sm font-semibold transition-colors"
                style={{ color: "oklch(0.82 0.015 265)" }}
              >
                alex.morgan@email.com
              </span>
            </a>

            {/* ── FIX 3: Social links with btn-social hover treatment ── */}
            <div>
              <p
                className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase"
                style={{ color: "oklch(0.45 0.03 265)" }}
              >
                Find me on
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                  { Icon: Github, href: "#", label: "GitHub" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="btn-social"
                  >
                    <Icon size={19} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleSubmit}
            className="reveal reveal-delay-2 glass-card rounded-2xl p-7 space-y-5"
            style={{ border: "1px solid oklch(0.78 0.18 195 / 0.18)" }}
          >
            <div>
              <label
                className="text-xs font-semibold mb-2 block tracking-[0.1em] uppercase"
                htmlFor="contact-name"
                style={{ color: "oklch(0.55 0.04 255)" }}
              >
                Name
              </label>
              <Input
                id="contact-name"
                data-ocid="contact.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Your full name"
                className="bg-white/5 border-white/10 focus:border-cyan/40 focus:ring-0 h-11"
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold mb-2 block tracking-[0.1em] uppercase"
                htmlFor="contact-email"
                style={{ color: "oklch(0.55 0.04 255)" }}
              >
                Email
              </label>
              <Input
                id="contact-email"
                data-ocid="contact.email_input"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="your@email.com"
                className="bg-white/5 border-white/10 focus:border-cyan/40 focus:ring-0 h-11"
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold mb-2 block tracking-[0.1em] uppercase"
                htmlFor="contact-message"
                style={{ color: "oklch(0.55 0.04 255)" }}
              >
                Message
              </label>
              <Textarea
                id="contact-message"
                data-ocid="contact.textarea"
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                placeholder="Tell me about your project or opportunity..."
                rows={5}
                className="bg-white/5 border-white/10 focus:border-cyan/40 focus:ring-0 resize-none"
              />
            </div>

            {status === "success" && (
              <div
                data-ocid="contact.success_state"
                className="flex items-center gap-2.5 text-sm font-medium rounded-xl px-4 py-3"
                style={{
                  color: "oklch(0.78 0.18 155)",
                  background: "oklch(0.78 0.18 155 / 0.08)",
                  border: "1px solid oklch(0.78 0.18 155 / 0.2)",
                }}
              >
                ✓ Message sent successfully!
              </div>
            )}
            {status === "error" && (
              <div
                data-ocid="contact.error_state"
                className="flex items-center gap-2.5 text-sm font-medium rounded-xl px-4 py-3"
                style={{
                  color: "oklch(0.65 0.22 25)",
                  background: "oklch(0.65 0.22 25 / 0.08)",
                  border: "1px solid oklch(0.65 0.22 25 / 0.2)",
                }}
              >
                ✗ Failed to send. Please try again.
              </div>
            )}

            {/* ── FIX 3: Contact submit uses btn-primary-cta ── */}
            <button
              data-ocid="contact.submit_button"
              type="submit"
              disabled={status === "loading"}
              className="btn-primary-cta w-full flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);
  return (
    <footer
      className="relative z-10 py-8 px-4 text-center"
      style={{ borderTop: "1px solid oklch(0.78 0.18 195 / 0.08)" }}
    >
      <p className="text-sm" style={{ color: "oklch(0.42 0.03 265)" }}>
        © {year}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:underline"
          style={{ color: "oklch(0.65 0.1 195)" }}
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
// ── FIX 1: uses .eyebrow and .section-title for proper typographic hierarchy ──
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="reveal mb-16 text-center">
      <p className="eyebrow mb-4" style={{ color: "oklch(0.72 0.16 195)" }}>
        {label}
      </p>
      <h2 className="section-title" style={{ color: "oklch(0.96 0.006 265)" }}>
        {title}
      </h2>
      {/* Gradient underline accent */}
      <div
        className="mx-auto mt-5"
        style={{
          height: "2px",
          width: "48px",
          background:
            "linear-gradient(90deg, oklch(0.78 0.18 195), oklch(0.65 0.2 290))",
          borderRadius: "1px",
        }}
      />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();

  return (
    <div className="relative" style={{ background: "oklch(0.10 0.02 260)" }}>
      <ThreeBackground />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
