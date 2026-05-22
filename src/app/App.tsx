import { useCallback, useRef, useState, type CSSProperties } from "react";
import splashImg from "@/imports/fee78946-d512-4e29-bf15-7a41dfb5dd0c.jpg";
import mapImg from "@/imports/eccdc319-2c9b-46c5-9db0-88ac3b951d6d.jpg";
import reportsImg from "@/imports/d3ea7516-ab31-4740-b259-1ea7054cf948.jpg";
import adminImg from "@/imports/60d1bcc3-97ad-4346-b161-1eae1c82330d.jpg";
import { Camera, Map, BarChart3, Shield, ThumbsUp, Bell, Download } from "lucide-react";

const phones = [
  { src: splashImg, alt: "FixMyStreet launch screen", label: "Launch Screen", rotation: -4 },
  { src: mapImg, alt: "Interactive map with report pins", label: "Map View", rotation: 1 },
  { src: reportsImg, alt: "My reports dashboard", label: "My Reports", rotation: -2 },
  { src: adminImg, alt: "Admin management dashboard", label: "Admin Panel", rotation: 3 },
];

const features = [
  {
    icon: Camera,
    title: "Photo Reporting",
    desc: "Snap a photo of any infrastructure issue and submit it with auto-detected GPS coordinates.",
  },
  {
    icon: Map,
    title: "Live Map View",
    desc: "Browse all community reports pinned to an interactive map organized by location.",
  },
  {
    icon: BarChart3,
    title: "Report Tracking",
    desc: "Monitor the status of every report you've submitted — pending, in review, or resolved.",
  },
  {
    icon: Shield,
    title: "Admin Dashboard",
    desc: "Government staff can manage reports, update statuses, and notify residents in one place.",
  },
  {
    icon: ThumbsUp,
    title: "Community Upvoting",
    desc: "Residents upvote reports to surface the most urgent issues to local authorities.",
  },
  {
    icon: Bell,
    title: "Push Notifications",
    desc: "Users receive real-time updates when the status of their report changes.",
  },
];

const techStack = [
  "Flutter",
  "Dart",
  "Firebase",
  "Cloud Firestore",
  "flutter_map",
  "Firebase Auth",
];

const BASE_WIDTH = 168;
const FOCUSED_WIDTH = 272;
const ASPECT = 2048 / 1280;
const ANIM_MS = 520;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type SlotRect = { left: number; top: number; width: number; height: number };

function slotHeight(phoneWidth: number) {
  return phoneWidth * ASPECT + 12 + 20;
}

function centerRect(container: HTMLElement): SlotRect {
  const w = FOCUSED_WIDTH;
  const h = slotHeight(w);
  return {
    left: (container.offsetWidth - w) / 2,
    top: (container.offsetHeight - h) / 2,
    width: w,
    height: h,
  };
}

function PhoneVisual({
  src,
  alt,
  label,
  rotation,
  phoneWidth,
  focused,
  interactive,
  onClick,
}: {
  src: string;
  alt: string;
  label: string;
  rotation: number;
  phoneWidth: number;
  focused: boolean;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${ANIM_MS}ms ${EASE}`,
        }}
      >
        <div
          style={{
            borderRadius: "2.6rem",
            border: focused ? "10px solid #3b63ff" : "8px solid #151d3a",
            boxShadow: focused
              ? "0 0 0 1px rgba(59,99,255,0.4), inset 0 0 0 2px rgba(255,255,255,0.06), 0 36px 90px rgba(0,0,0,0.7), 0 0 60px rgba(59,99,255,0.25)"
              : "0 0 0 1px rgba(80,110,220,0.18), inset 0 0 0 2px rgba(255,255,255,0.04), 0 28px 72px rgba(0,0,0,0.65), 0 0 40px rgba(59,99,255,0.07)",
            background: "#151d3a",
            width: `${phoneWidth}px`,
            overflow: "hidden",
            position: "relative",
            transition: `width ${ANIM_MS}ms ${EASE}, border 0.3s ease, box-shadow 0.35s ease`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "28px",
              background: "#151d3a",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "14px",
                background: "#0d1226",
                borderRadius: "20px",
              }}
            />
          </div>
          <img
            src={src}
            alt={alt}
            style={{
              width: `${phoneWidth}px`,
              display: "block",
              aspectRatio: "1280 / 2048",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontSize: focused ? "11px" : "10px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: focused ? "#8ab4ff" : "#5a6e98",
          transition: `color 0.3s ease, font-size 0.3s ease`,
        }}
      >
        {label}
      </span>
    </div>
  );

  if (!interactive) return inner;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${label}`}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b63ff] rounded-3xl border-0 bg-transparent p-0 cursor-pointer"
      style={{ transition: "transform 0.35s ease" }}
    >
      <div className="group-hover:scale-105 transition-transform duration-300">
        {inner}
      </div>
    </button>
  );
}

function PhoneGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [originRect, setOriginRect] = useState<SlotRect | null>(null);
  const [animateMotion, setAnimateMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const measureSlot = useCallback((index: number): SlotRect | null => {
    const slot = slotRefs.current[index];
    const container = containerRef.current;
    if (!slot || !container) return null;
    const s = slot.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    return {
      left: s.left - c.left,
      top: s.top - c.top,
      width: s.width,
      height: s.height,
    };
  }, []);

  const openPhone = (index: number) => {
    const rect = measureSlot(index);
    if (!rect) return;
    setOriginRect(rect);
    setSelected(index);
    setExpanded(false);
    setAnimateMotion(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimateMotion(true);
        setExpanded(true);
      });
    });
  };

  const closePhone = () => {
    setExpanded(false);
  };

  const handleOverlayTransitionEnd = () => {
    if (!expanded && selected !== null) {
      setSelected(null);
      setOriginRect(null);
      setAnimateMotion(false);
    }
  };

  const handlePhoneClick = (index: number) => {
    if (selected === index) {
      closePhone();
      return;
    }
    if (selected !== null) {
      closePhone();
      return;
    }
    openPhone(index);
  };

  const targetRect =
    expanded && containerRef.current ? centerRect(containerRef.current) : null;
  const overlayRect = expanded && targetRect ? targetRect : originRect;
  const overlayPhone = selected !== null ? phones[selected] : null;
  const motionTransition = animateMotion
    ? `left ${ANIM_MS}ms ${EASE}, top ${ANIM_MS}ms ${EASE}, width ${ANIM_MS}ms ${EASE}, height ${ANIM_MS}ms ${EASE}`
    : "none";

  return (
    <div
      style={{
        position: "relative",
        marginBottom: "5rem",
        padding: "3rem 1rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse, rgba(59,99,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "min(420px, 58vh)",
        }}
      >
        {selected !== null && (
          <button
            type="button"
            aria-label="Close phone preview"
            onClick={closePhone}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 15,
              border: "none",
              background: "rgba(5, 8, 20, 0.45)",
              cursor: "pointer",
              opacity: expanded ? 1 : 0,
              transition: `opacity ${ANIM_MS}ms ease`,
            }}
          />
        )}

        {/* Row — layout never changes; other phones stay put */}
        <div
          className="flex justify-center flex-wrap"
          style={{
            gap: "clamp(16px, 3vw, 36px)",
            alignItems: "flex-end",
            position: "relative",
            zIndex: 2,
          }}
        >
          {phones.map((phone, index) => (
            <div
              key={phone.label}
              ref={(el) => {
                slotRefs.current[index] = el;
              }}
              style={{
                visibility: selected === index ? "hidden" : "visible",
              }}
            >
              <PhoneVisual
                {...phone}
                phoneWidth={BASE_WIDTH}
                rotation={phone.rotation}
                focused={false}
                interactive
                onClick={() => handlePhoneClick(index)}
              />
            </div>
          ))}
        </div>

        {/* Flying overlay — from slot → center → slot */}
        {selected !== null && overlayRect && overlayPhone && (
          <div
            role="presentation"
            onTransitionEnd={(e) => {
              if (
                e.target === e.currentTarget &&
                (e.propertyName === "left" || e.propertyName === "top")
              ) {
                handleOverlayTransitionEnd();
              }
            }}
            style={{
              position: "absolute",
              left: overlayRect.left,
              top: overlayRect.top,
              width: overlayRect.width,
              height: overlayRect.height,
              zIndex: 40,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              transition: motionTransition,
              pointerEvents: expanded ? "auto" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              closePhone();
            }}
          >
            <PhoneVisual
              {...overlayPhone}
              phoneWidth={expanded ? FOCUSED_WIDTH : BASE_WIDTH}
              rotation={expanded ? 0 : overlayPhone.rotation}
              focused
            />
          </div>
        )}
      </div>

      {selected !== null && (
        <p
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "12px",
            color: "#5a6e98",
          }}
        >
          Tap the backdrop or the phone again to close
        </p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(59,99,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <section
        className="relative mx-auto px-6 py-20"
        style={{ maxWidth: "1100px", zIndex: 1 }}
      >
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: "36px", height: "2px", background: "#3b63ff" }} />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#3b63ff",
              }}
            >
              Featured Project
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            FixMyStreet
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "#7b8db0",
              maxWidth: "560px",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}
          >
            A mobile platform that lets citizens photograph and report local
            infrastructure problems — potholes, broken lights, damaged roads —
            directly to their municipal government with GPS precision.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <a
              href="/fixmystreet.apk"
              download="FixMyStreet.apk"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "999px",
                background: "#3b63ff",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(59,99,255,0.35)",
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
              }}
              className="hover:bg-[#2d52e0] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(59,99,255,0.45)]"
            >
              <Download size={15} />
              Download APK
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "999px",
                  background: "#0f1628",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#8a9bc2",
                  letterSpacing: "0.04em",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <PhoneGallery />

        <div
          className="grid gap-10"
          style={{ gridTemplateColumns: "1fr", alignItems: "start" }}
        >
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "3rem",
            }}
          >
            <div
              className="grid gap-10"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                alignItems: "start",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#c8d4f0",
                    marginBottom: "1rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  About the App
                </h2>
                <p
                  style={{
                    color: "#7b8db0",
                    lineHeight: 1.75,
                    fontSize: "0.95rem",
                    marginBottom: "1rem",
                  }}
                >
                  FixMyStreet bridges the gap between citizens and local government
                  by making infrastructure reporting fast and accessible. Users open
                  the app, take a photo, and submit — the system handles location
                  detection automatically.
                </p>
                <p
                  style={{
                    color: "#7b8db0",
                    lineHeight: 1.75,
                    fontSize: "0.95rem",
                  }}
                >
                  Reports are visible on a shared community map, where neighbors can
                  upvote issues to escalate priority. Admins review incoming reports
                  from a dedicated dashboard and push status notifications back to
                  residents.
                </p>
              </div>

              <div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#c8d4f0",
                    marginBottom: "1.25rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Key Features
                </h2>
                <div
                  className="grid gap-3"
                  style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
                >
                  {features.map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "14px",
                        borderRadius: "14px",
                        background: "#0f1628",
                        border: "1px solid rgba(255,255,255,0.06)",
                        transition: "border-color 0.2s",
                      }}
                      className="hover:border-[rgba(59,99,255,0.3)]"
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          background: "#1a2a5e",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={15} style={{ color: "#4f76ff" }} />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#c8d4f0",
                            marginBottom: "3px",
                          }}
                        >
                          {title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "#5a6e98",
                            lineHeight: 1.6,
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
