import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Play,
  Square,
  StepForward,
  RefreshCw,
  Zap,
  Database,
  Brain,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// UI primitives (same aesthetic)
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

// -------------------------------------------------------------------
// Demo knobs (simulate backend results; flip these as you like)
const HAS_CHAT_HISTORY_SUMMARY = true;

// Steps
const steps = [
  // 0
  {
    id: 0,
    title: "User Login (Django UI)",
    subtitle: "Credentials → Django frontend",
    icon: MessageSquare,
    color: "from-sky-500 to-indigo-500",
    details: (
      <div className="space-y-4 text-sm">
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-2xl border border-sky-200">
          <div className="text-gray-700 font-semibold mb-2">Login Form</div>
          <div className="grid gap-2">
            <div className="bg-white/90 rounded-xl p-2 border text-gray-600">
              username: <span className="font-mono">prabhas</span>
            </div>
            <div className="bg-white/90 rounded-xl p-2 border text-gray-600">
              password: ••••••••
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Submitted via Django template / React mount.
          </div>
        </div>
        <p className="text-gray-600">
          The user signs in on the Django page. Credentials get posted to the
          Django backend.
        </p>
      </div>
    ),
  },
  // 1
  {
    id: 1,
    title: "MySQL Authentication",
    subtitle: "Django backend → MySQL users",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200"
        >
          <div className="text-emerald-700 font-semibold mb-2">
            Auth Check (MySQL)
          </div>
          <div className="font-mono text-xs bg-white/80 p-3 rounded-xl">
            user = authenticate(request, username=prabhas, password=hashed_password)
            <br />
            // verify hash → issue session 
          </div>
        </motion.div>
        <p className="text-gray-600">
          Django verifies credentials against MySQL and issues a session.
        </p>
      </div>
    ),
  },
  // 2
  {
    id: 2,
    title: "Access Chatbot",
    subtitle: "Authenticated UI available",
    icon: MessageSquare,
    color: "from-fuchsia-500 to-pink-500",
    details: (
      <div className="space-y-4 text-sm">
        <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 p-4 rounded-2xl border border-pink-200">
          <div className="text-gray-700 font-semibold mb-2">Chat UI</div>
          <div className="font-mono bg-white/80 p-3 rounded-xl">
            "what if I miss my EMI this month?"
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Request now carries user/session identity.
          </div>
        </div>
        <p className="text-gray-600">
          After login, the chat interface is unlocked for the user.
        </p>
      </div>
    ),
  },
  // 3
  {
    id: 3,
    title: "Fetch User Profile (MySQL)",
    subtitle: "Read user facts for personalization",
    icon: Database,
    color: "from-teal-500 to-cyan-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-2xl border border-teal-200"
        >
          <div className="text-teal-700 font-semibold mb-2">User Facts</div>
          <div className="bg-white/80 p-3 rounded-xl font-mono text-sm">
            {`{
  id: 42,
  name: "Saima",
  loan_emi: 8540,
  due_date: "2025-08-28",
  grace_days: 3,
  ecs_bounce_fee: 350
}`}
          </div>
        </motion.div>
        <p className="text-gray-600">
          Backend fetches profile/loan facts required to answer precisely.
        </p>
      </div>
    ),
  },
  // 4
  {
    id: 4,
    title: "Fetch Chat History Summary (if any)",
    subtitle: "Condense prior turns",
    icon: Sparkles,
    color: "from-violet-500 to-indigo-500",
    details: (
      <div className="space-y-4 text-sm">
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-2xl border border-violet-200">
          <div className="text-violet-700 font-semibold mb-2">
            History Summary
          </div>
          {HAS_CHAT_HISTORY_SUMMARY ? (
            <div className="bg-white/80 p-3 rounded-xl text-gray-700">
              User previously asked about late fees & grace policy. Prefers
              concise answers with concrete dates/amounts.
            </div>
          ) : (
            <div className="bg-white/80 p-3 rounded-xl text-gray-500 italic">
              No prior conversation summary available.
            </div>
          )}
        </div>
        <p className="text-gray-600">
          If available, a compact summary of previous chats is attached to the
          context (not the whole chat).
        </p>
      </div>
    ),
  },
  // 5
  {
    id: 5,
    title: "Embed the query",
    subtitle: "Text → Vector (meaning fingerprint)",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-200 shadow-inner overflow-x-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={12} className="text-yellow-600" />
            <span className="text-yellow-700 font-semibold">768-D Vector</span>
          </div>
          [
          {Array.from({ length: 16 })
            .map((_, i) => Math.sin(i * 1.37).toFixed(3))
            .join(", ")}
          {", ... (768 dimensions)"}]
        </motion.div>
        <p className="text-gray-600 leading-relaxed">
          SentenceTransformer converts the query into a high-dimensional vector
          that captures semantic meaning.
        </p>
      </div>
    ),
  },
  // 6
  {
    id: 6,
    title: "FAISS similarity search",
    subtitle: "Vector → nearest neighbors",
    icon: Search,
    color: "from-blue-500 to-indigo-500",
    details: (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="font-mono bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200"
          >
            <div className="text-blue-700 font-semibold mb-1">Indices</div>
            [2, 3, 5]
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="font-mono bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200"
          >
            <div className="text-blue-700 font-semibold mb-1">
              Similarity Scores
            </div>
            [0.92, 0.89, 0.86]
          </motion.div>
        </div>
        <p className="text-gray-600 leading-relaxed">
          FAISS finds the most semantically similar document chunks.
        </p>
      </div>
    ),
  },
  // 7
  {
    id: 7,
    title: "Map indices → chunks",
    subtitle: "Retrieve the actual text",
    icon: Database,
    color: "from-purple-500 to-pink-500",
    details: (
      <div className="space-y-4 text-sm">
        {[
          { idx: 2, text: "After grace, a flat late fee of ₹500 applies." },
          { idx: 3, text: "Overdue interest accrues at 2% per month (daily)." },
          { idx: 5, text: "At ≥30 DPD, delay may be reported to bureaus." },
        ].map((chunk, i) => (
          <motion.div
            key={chunk.idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="font-mono bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {chunk.idx}
              </div>
              <span className="text-purple-700 font-semibold">
                Retrieved Chunk
              </span>
            </div>
            "{chunk.text}"
          </motion.div>
        ))}
        <p className="text-gray-600 leading-relaxed">
          We fetch the actual policy text from{" "}
          <span className="font-semibold text-purple-600">chunks.npy</span>{" "}
          using the FAISS indices.
        </p>
      </div>
    ),
  },
  // 8
  {
    id: 8,
    title: "Compose Context (Policy + User + History)",
    subtitle: "Personalized, grounded context",
    icon: Database,
    color: "from-teal-500 to-cyan-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200">
            <div className="text-purple-700 font-semibold mb-2">Policy</div>
            <div className="font-mono bg-white/80 p-3 rounded-xl text-sm">
              {"["}₹500 late fee, 2%/mo interest, report at ≥30 DPD{"]"}
            </div>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-2xl border border-teal-200">
            <div className="text-teal-700 font-semibold mb-2">User Facts</div>
            <div className="font-mono bg-white/80 p-3 rounded-xl text-sm">
              EMI ₹8,540; Due 28-Aug-2025; Grace 3d; ECS ₹350
            </div>
          </div>
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-2xl border border-violet-200">
            <div className="text-violet-700 font-semibold mb-2">History</div>
            <div className="font-mono bg-white/80 p-3 rounded-xl text-sm">
              {HAS_CHAT_HISTORY_SUMMARY
                ? "Prefers concise, concrete dates/amounts."
                : "—"}
            </div>
          </div>
        </motion.div>
        <p className="text-gray-600">
          All context is merged and sent to the LLM with a structured prompt.
        </p>
      </div>
    ),
  },
  // 9
  {
    id: 9,
    title: "LLM Generation",
    subtitle: "Structured prompt → clear answer",
    icon: Brain,
    color: "from-rose-500 to-red-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-3"
        >
          <div className="font-mono bg-gradient-to-r from-rose-50 to-red-50 p-4 rounded-2xl border border-rose-200">
            <div className="text-rose-700 font-semibold mb-2">
              System Prompt
            </div>
            <div className="bg-white/80 p-3 rounded-xl text-gray-700">
              "Answer strictly from policy + user facts + (optional) history
              summary. Use exact numbers/dates. Be concise."
            </div>
          </div>
          <div className="font-mono bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
            <div className="text-green-700 font-semibold mb-2">
              Generated Answer
            </div>
            <div className="bg-white/80 p-3 rounded-xl text-gray-700">
              "Grace till 31-Aug; from 1-Sep add ₹500 late fee and ~₹5.69/day
              interest; ECS bounce ₹350; 30+ DPD may affect credit score."
            </div>
          </div>
        </motion.div>
        <p className="text-gray-600">
          The LLM outputs a precise, personalized answer grounded in the merged
          context.
        </p>
      </div>
    ),
  },
];

export default function RetrievalVisualizer() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);

  // autoplay
  useEffect(() => {
    if (!auto) return;
    if (active >= steps.length - 1) return;
    const t = setTimeout(
      () => setActive((a) => Math.min(a + 1, steps.length - 1)),
      2000
    );
    return () => clearTimeout(t);
  }, [auto, active]);

  const reset = () => {
    setActive(0);
    setAuto(false);
  };

  // background particles
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
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              FinBot Retrieval (Auth + Personalization)
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Login → Auth → Chat access → Fetch user & history → Embed → Search
              → Retrieve → Compose → Generate
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

          {/* Main content */}
          <div className="grid xl:grid-cols-[400px_1fr] gap-8 items-start">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-6"
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="text-blue-500" />
                    Auth + Retrieval Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isActive = idx === active;
                      const isCompleted = idx < active;

                      return (
                        <motion.li
                          key={step.id}
                          whileHover={{ scale: 1.02 }}
                          className={`relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300
                            ${
                              isActive
                                ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
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
                            className={`relative flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm
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
                              {step.title}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                isActive ? "text-white/80" : "text-gray-500"
                              }`}
                            >
                              {step.subtitle}
                            </div>
                          </div>
                          <Icon size={16} className={isActive ? "text-white/80" : "text-gray-400"} />
                        </motion.li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right pane */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="space-y-6"
              >
                {/* Step detail */}
                <Card glowing>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${steps[active].color}`}>
                          {React.createElement(steps[active].icon, {
                            size: 24,
                            className: "text-white",
                          })}
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

                {/* Data flow to match new pipeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                      Real-time Data Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {[
                        { label: "Login", on: active >= 0 },
                        { label: "Auth (MySQL)", on: active >= 1 },
                        { label: "Chat Access", on: active >= 2 },
                        { label: "User Profile", on: active >= 3 },
                        { label: "History Summary", on: active >= 4 },
                        { label: "Embedder", on: active >= 5 },
                        { label: "FAISS", on: active >= 6 },
                        { label: "Chunks", on: active >= 7 },
                        { label: "Compose Ctx", on: active >= 8 },
                        { label: "LLM", on: active >= 9 },
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

                {/* Progress dots */}
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
