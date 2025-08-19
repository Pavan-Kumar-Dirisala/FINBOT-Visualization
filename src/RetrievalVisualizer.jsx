import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Square, StepForward, RefreshCw, Zap, Database, Brain, Search, MessageSquare, Sparkles } from "lucide-react";

// Enhanced components with glassmorphism and modern styling
const Card = ({ className = "", children, glowing = false }) => (
  <div className={`rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm bg-white/80 ${glowing ? 'shadow-2xl shadow-blue-500/20 border-blue-200/50' : ''} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 pt-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, variant = "default", disabled = false, glowing = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 transition-all duration-300 font-semibold shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed
      ${variant === "default" 
        ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 ${glowing ? 'shadow-blue-500/50 animate-pulse' : ''}` 
        : "bg-white/80 border border-white/40 hover:bg-white/90 text-gray-700"}
    `}
  >
    {children}
  </motion.button>
);

const steps = [
  {
    id: 0,
    title: "User asks a question",
    subtitle: "Natural language → raw text",
    icon: MessageSquare,
    color: "from-emerald-500 to-teal-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 shadow-inner"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-700 font-semibold">User Input</span>
          </div>
          "what if I miss my EMI this month?"
        </motion.div>
        <p className="text-gray-600 leading-relaxed">The user types a natural language question in the chat interface. This raw text will be processed through our intelligent retrieval pipeline.</p>
      </div>
    ),
  },
  {
    id: 1,
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
            <Sparkles size={12} className="text-yellow-600"/>
            <span className="text-yellow-700 font-semibold">768-D Vector</span>
          </div>
          [{Array.from({ length: 16 })
            .map((_, i) => (Math.sin(i * 1.37).toFixed(3)))
            .join(", ")}{", ... (768 dimensions)"}]
        </motion.div>
        <p className="text-gray-600 leading-relaxed">SentenceTransformer converts the query into a high‑dimensional vector that captures semantic meaning. Each dimension represents learned linguistic patterns.</p>
      </div>
    ),
  },
  {
    id: 2,
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
            <div className="text-blue-700 font-semibold mb-1">Similarity Scores</div>
            [0.92, 0.89, 0.86]
          </motion.div>
        </div>
        <p className="text-gray-600 leading-relaxed">FAISS (Facebook AI Similarity Search) efficiently finds the most semantically similar document chunks using approximate nearest neighbor search.</p>
      </div>
    ),
  },
  {
    id: 3,
    title: "Map indices → chunks",
    subtitle: "Retrieve the actual text",
    icon: Database,
    color: "from-purple-500 to-pink-500",
    details: (
      <div className="space-y-4 text-sm">
        {[
          { idx: 2, text: "After grace, a flat late fee of ₹500 applies." },
          { idx: 3, text: "Overdue interest accrues at 2% per month (daily)." },
          { idx: 5, text: "At ≥30 DPD, delay may be reported to bureaus." }
        ].map((chunk, i) => (
          <motion.div 
            key={chunk.idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="font-mono bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">{chunk.idx}</div>
              <span className="text-purple-700 font-semibold">Retrieved Chunk</span>
            </div>
            "{chunk.text}"
          </motion.div>
        ))}
        <p className="text-gray-600 leading-relaxed">We fetch the actual policy text from <span className="font-semibold text-purple-600">chunks.npy</span> using the FAISS indices. This gives us relevant policy snippets.</p>
      </div>
    ),
  },
  {
    id: 4,
    title: "Compose context",
    subtitle: "Policy chunks + user facts",
    icon: Database,
    color: "from-teal-500 to-cyan-500",
    details: (
      <div className="space-y-4 text-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-2xl border border-teal-200 shadow-inner"
        >
          <div className="flex items-center gap-2 mb-2">
            <Database size={12} className="text-teal-600"/>
            <span className="text-teal-700 font-semibold">User Context</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl">
            {`{ 
  emi: ₹8,540, 
  due: 28‑Aug‑2025, 
  grace: 3d, 
  late_fee: 500, 
  rate: 2%/mo, 
  ecs_bounce: 350 
}`}
          </div>
        </motion.div>
        <p className="text-gray-600 leading-relaxed">We merge relevant policy snippets with secure, read‑only user loan facts from MySQL. This creates personalized context for accurate responses.</p>
      </div>
    ),
  },
  {
    id: 5,
    title: "LLM generation",
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
            <div className="text-rose-700 font-semibold mb-2">System Prompt</div>
            <div className="bg-white/80 p-3 rounded-xl text-gray-700">
              "Answer strictly from policy + facts. Use exact numbers/dates."
            </div>
          </div>
          <div className="font-mono bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
            <div className="text-green-700 font-semibold mb-2">Generated Answer</div>
            <div className="bg-white/80 p-3 rounded-xl text-gray-700">
              "Grace till 31‑Aug; from 1‑Sep add ₹500 late fee and ~₹5.69/day interest; ECS bounce ₹350; 30+ DPD may affect credit score."
            </div>
          </div>
        </motion.div>
        <p className="text-gray-600 leading-relaxed">The LLM generates a precise, personalized answer using the retrieved context and user-specific data, ensuring accuracy and relevance.</p>
      </div>
    ),
  },
];

export default function RetrievalVisualizer() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);

  // Auto-play controller
  useEffect(() => {
    if (!auto) return;
    if (active >= steps.length - 1) return;
    const t = setTimeout(() => setActive((a) => Math.min(a + 1, steps.length - 1)), 2000);
    return () => clearTimeout(t);
  }, [auto, active]);

  const reset = () => { setActive(0); setAuto(false); };

  // Background animation particles
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    })), []
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
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
              FinBot Retrieval
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how our AI-powered system transforms your questions into precise, personalized financial guidance
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => setAuto(true)} disabled={auto || active === steps.length - 1} glowing={!auto}>
                <Play size={18}/> Play Demo
              </Button>
              <Button onClick={() => setAuto(false)} variant="outline">
                <Square size={18}/> Pause
              </Button>
              <Button onClick={() => setActive((a) => Math.min(a + 1, steps.length - 1))} variant="outline">
                <StepForward size={18}/> Next Step
              </Button>
              <Button onClick={reset} variant="outline">
                <RefreshCw size={18}/> Reset
              </Button>
            </div>
          </motion.header>

          {/* Main content */}
          <div className="grid xl:grid-cols-[400px_1fr] gap-8 items-start">
            {/* Timeline sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-6"
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="text-blue-500"/> 
                    AI Pipeline
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
                            ${isActive 
                              ? `bg-gradient-to-r ${step.color} text-white shadow-lg` 
                              : isCompleted
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'hover:bg-gray-50 border border-gray-100'}`}
                          onClick={() => { setActive(idx); setAuto(false); }}
                        >
                          <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm
                            ${isActive 
                              ? 'bg-white/20 text-white' 
                              : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'}`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                            {isActive && (
                              <motion.div
                                className="absolute inset-0 rounded-xl bg-white/20"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{step.title}</div>
                            <div className={`text-xs mt-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                              {step.subtitle}
                            </div>
                          </div>
                          <Icon size={16} className={isActive ? 'text-white/80' : 'text-gray-400'}/>
                        </motion.li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main content area */}
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
                <Card glowing={true}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-r ${steps[active].color}`}>
                          {React.createElement(steps[active].icon, { 
                            size: 24, 
                            className: "text-white" 
                          })}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{steps[active].title}</CardTitle>
                          <p className="text-gray-500 text-lg mt-1">{steps[active].subtitle}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="text-gray-400" size={28}/>
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {steps[active].details}
                  </CardContent>
                </Card>

                {/* Data flow visualization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      Real-time Data Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: 'User Query', active: active >= 0, icon: MessageSquare },
                        { label: 'Embedder', active: active >= 1, icon: Zap },
                        { label: 'FAISS Index', active: active >= 2, icon: Search },
                        { label: 'chunks.npy', active: active >= 3, icon: Database },
                        { label: 'LLM Answer', active: active >= 5, icon: Brain },
                      ].map((block, i) => {
                        const Icon = block.icon;
                        return (
                          <motion.div 
                            key={i}
                            className={`relative p-4 rounded-2xl border text-center transition-all duration-500 ${
                              block.active 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl border-blue-300' 
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                            animate={block.active ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Icon size={20} className={`mx-auto mb-2 ${block.active ? 'text-white' : 'text-gray-400'}`}/>
                            <div className="text-sm font-semibold">{block.label}</div>
                            {block.active && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Progress indicator */}
                <div className="flex justify-center">
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          i === active ? 'bg-blue-500 scale-125' : i < active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        animate={i === active ? { scale: [1.25, 1.4, 1.25] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ))}
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