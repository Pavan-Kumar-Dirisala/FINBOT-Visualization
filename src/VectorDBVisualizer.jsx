import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  StepForward,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Scissors,
  Cpu,
  Database,
  Save,
  FileText,
} from "lucide-react";

// ---- Minimal UI primitives (styled like your other visualizer) ----
const Card = ({ className = "", children, glowing = false }) => (
  <div
    className={`rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm bg-white/80 ${
      glowing ? "shadow-2xl shadow-blue-500/20 border-blue-200/50" : ""
    } ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 pt-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);

const Button = ({
  children,
  onClick,
  variant = "default",
  disabled = false,
  glowing = false,
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 transition-all duration-300 font-semibold shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed
      ${
        variant === "default"
          ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 ${
              glowing ? "shadow-blue-500/50 animate-pulse" : ""
            }`
          : "bg-white/80 border border-white/40 hover:bg-white/90 text-gray-700"
      }
    `}
  >
    {children}
  </motion.button>
);

// ---- Steps for Vector DB Creation ----
const steps = [
  {
    id: 0,
    title: "Ingest documents",
    subtitle: "Bank KB → raw text",
    color: "from-indigo-500 to-blue-500",
    icon: () => <BookOpen className="text-indigo-50" size={22} />,
    details: (
      <div className="space-y-3 text-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-200"
        >
          PDFs · Rule books · Policies · FAQs
        </motion.div>
        <p className="text-gray-600">
          We read source files and extract plain text for downstream processing.
        </p>
      </div>
    ),
  },
  {
    id: 1,
    title: "Chunking",
    subtitle: "Split into bite-size passages",
    color: "from-rose-500 to-pink-500",
    icon: () => <Scissors className="text-rose-50" size={22} />,
    details: (
      <div className="space-y-3 text-sm">
        <div className="mt-1 space-y-1 text-xs bg-gradient-to-r from-rose-50 to-pink-50 border rounded-2xl p-3 border-rose-200">
          <div className="flex items-center gap-1">
            <FileText size={14} />
            "Grace period is 3 days…"
          </div>
          <div className="flex items-center gap-1">
            <FileText size={14} />
            "Late fee is ₹500…"
          </div>
          <div className="flex items-center gap-1">
            <FileText size={14} />
            "Reported after 30 DPD…"
          </div>
        </div>
        <p className="text-gray-600">
          Sentences/paragraphs with small overlap preserve context while keeping
          chunks compact.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    title: "Embed chunks",
    subtitle: "Text → vectors (meaning)",
    color: "from-amber-500 to-orange-500",
    icon: () => <Cpu className="text-amber-50" size={22} />,
    details: (
      <div className="space-y-3 text-sm">
        <div className="font-mono bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 overflow-x-auto">
          [0.021, -0.113, 0.087, 0.005, … ×768]
        </div>
        <p className="text-gray-600">
          SentenceTransformer converts each chunk to a dense 768-D vector.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: "Build FAISS index",
    subtitle: "Add vectors → fast ANN search",
    color: "from-blue-500 to-indigo-500",
    icon: () => <Database className="text-blue-50" size={22} />,
    details: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="font-mono bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
          index.d = 768
        </div>
        <div className="font-mono bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
          type = IndexFlatIP
        </div>
        <p className="col-span-full text-gray-600">
          Vectors are inserted and the index is serialized for fast search at
          runtime.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "Save artifacts",
    subtitle: "Persist for runtime use",
    color: "from-emerald-500 to-teal-500",
    icon: () => <Save className="text-emerald-50" size={22} />,
    details: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="font-mono bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200">
          chunks.npy ← text chunks
        </div>
        <div className="font-mono bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200">
          faiss_index.bin ← index
        </div>
        <p className="col-span-full text-gray-600">
          These two files together are your lightweight **Vector DB**.
        </p>
      </div>
    ),
  },
];

export default function VectorDBVisualizer() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);

  // animated background particles (to match the other visualizer vibe)
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      })),
    []
  );

  // autoplay
  useEffect(() => {
    if (!auto) return;
    if (active >= steps.length - 1) return;
    const t = setTimeout(
      () => setActive((a) => Math.min(a + 1, steps.length - 1)),
      1500
    );
    return () => clearTimeout(t);
  }, [auto, active]);

  const reset = () => {
    setActive(0);
    setAuto(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header + controls (styled like the other one) */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Vector DB Creation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A concise, animated walkthrough of converting documents into a
              fast, searchable vector index
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => setAuto(true)}
                disabled={auto || active === steps.length - 1}
                glowing={!auto}
              >
                <Play size={18} /> Play Demo
              </Button>
              <Button onClick={() => setAuto(false)} variant="outline">
                <Square size={18} /> Pause
              </Button>
              <Button
                onClick={() =>
                  setActive((a) => Math.min(a + 1, steps.length - 1))
                }
                variant="outline"
              >
                <StepForward size={18} /> Next Step
              </Button>
              <Button onClick={reset} variant="outline">
                <RefreshCw size={18} /> Reset
              </Button>
            </div>
          </motion.header>

          {/* Main content layout */}
          <div className="grid xl:grid-cols-[400px_1fr] gap-8 items-start">
            {/* Left timeline (styled to match) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-6"
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="text-blue-500" /> Build pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {steps.map((s, idx) => {
                      const isActive = idx === active;
                      const isCompleted = idx < active;

                      return (
                        <motion.li
                          key={s.id}
                          whileHover={{ scale: 1.02 }}
                          className={`relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300
                          ${
                            isActive
                              ? `bg-gradient-to-r ${s.color} text-white shadow-lg`
                              : isCompleted
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "hover:bg-gray-50 border border-gray-100"
                          }`}
                          onClick={() => {
                            setActive(idx);
                            setAuto(false);
                          }}
                        >
                          <div
                            className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold
                            ${
                              isActive
                                ? "bg-white/20 text-white"
                                : isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-xl bg-white/20"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">
                              {s.title}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                isActive ? "text-white/80" : "text-gray-500"
                              }`}
                            >
                              {s.subtitle}
                            </div>
                          </div>

                          {/* step icon bubble when active */}
                          <div className="hidden md:block">
                            <div
                              className={`p-2 rounded-xl bg-gradient-to-r ${
                                s.color
                              } ${isActive ? "opacity-100" : "opacity-60"}`}
                            >
                              {s.icon()}
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="space-y-6"
              >
                {/* Step detail card */}
                <Card glowing>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-2xl bg-gradient-to-r ${steps[active].color}`}
                        >
                          {steps[active].icon()}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">
                            {steps[active].title}
                          </CardTitle>
                          <p className="text-gray-500 text-lg mt-1">
                            {steps[active].subtitle}
                          </p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="text-gray-400" size={28} />
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>{steps[active].details}</CardContent>
                </Card>

                {/* Data flow row (matches the other visualizer’s style) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                      Data flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: "Docs", on: active >= 0 },
                        { label: "Chunks", on: active >= 1 },
                        { label: "Embeddings", on: active >= 2 },
                        { label: "FAISS Index", on: active >= 3 },
                        { label: "Artifacts", on: active >= 4 },
                      ].map((b, i) => (
                        <motion.div
                          key={i}
                          className={`relative p-4 rounded-2xl border text-center transition-all duration-500 ${
                            b.on
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl border-blue-300"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                          animate={b.on ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="text-sm font-semibold">{b.label}</div>
                          {b.on && (
                            <motion.div
                              className="absolute inset-0 rounded-2xl border-2 border-white/30"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="relative mt-6 h-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-gradient-to-r from-white/40 to-white/40 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{
                              width: `${((active + 1) / steps.length) * 100}%`,
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress dots (matches the other one) */}
                <div className="flex justify-center items-center gap-4">
                  <div className="text-gray-600 text-sm font-semibold">
                    Progress:
                  </div>
                  <div className="flex gap-3">
                    {steps.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`relative w-4 h-4 rounded-full transition-all duration-500 ${
                          i === active
                            ? "bg-blue-600 scale-150 shadow-lg shadow-blue-400/50"
                            : i < active
                            ? "bg-green-500 scale-125"
                            : "bg-gray-300"
                        }`}
                        animate={
                          i === active
                            ? {
                                scale: [1.5, 1.7, 1.5],
                                boxShadow: [
                                  "0 0 10px rgba(37, 99, 235, 0.5)",
                                  "0 0 20px rgba(37, 99, 235, 0.8)",
                                  "0 0 10px rgba(37, 99, 235, 0.5)",
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {i === active && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-blue-300/40"
                            animate={{
                              scale: [1, 2, 1],
                              opacity: [0.4, 0, 0.4],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Step {active + 1} of {steps.length}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
