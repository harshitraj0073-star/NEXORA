import React, { useState } from 'react';
import { useTranslation } from '../utils/i18n';
import { useStore } from '../hooks/useStore';
import { useChatbot } from '../hooks/useChatbot';
import { CheckInChat } from '../components/CheckInChat';
import { StressReportModal } from '../components/StressReportModal';
import { ConsultDoctorModal, DOCTORS_LIST, Doctor } from '../components/ConsultDoctorModal';
import { 
  PhoneCall, 
  Users, 
  Info, 
  Bot, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Stethoscope, 
  HeartPulse, 
  Calendar, 
  Clock, 
  Star,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VictimDashboard: React.FC = () => {
  const { state } = useStore();
  const t = useTranslation(state.language);
  const navigate = useNavigate();

  const { 
    stressResult, 
    setIsStressModalOpen, 
    isStressModalOpen, 
    clearConversation,
    setIsOpen: setChatbotOpen 
  } = useChatbot();

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc_1');

  const handleOpenDoctorModal = (doctorId?: string) => {
    if (doctorId) setSelectedDoctorId(doctorId);
    setIsDoctorModalOpen(true);
  };

  const handleStartAIChat = () => {
    // Navigate to full AI chat page or open floating assistant
    navigate('/nexora-ai');
  };

  // Stress Level categorization (High, Medium, Low)
  const stressLevel = stressResult 
    ? (stressResult.level === 'Critical' || stressResult.level === 'High') 
      ? 'High' 
      : stressResult.level === 'Moderate' 
        ? 'Medium' 
        : 'Low'
    : null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      
      {!showCheckIn ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Welcome & AI Chat Callout Header */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-primary text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            
            <div className="relative z-10 space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15 backdrop-blur-md">
                <HeartPulse className="w-3.5 h-3.5 text-blue-300" />
                Victim Wellbeing Sanctuary
              </span>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
                {t('victim.greeting') || 'Hello, You are in a Safe Space'}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Talk confidentially with our compassionate AI assistant. When you end your conversation, NEXORA evaluates your real-time emotional stress level (<strong>High</strong>, <strong>Medium</strong>, or <strong>Low</strong>) and connects you with accredited doctors.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleStartAIChat}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Bot className="w-4 h-4 text-primary" />
                  Chat with NEXORA AI
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => setShowCheckIn(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl border border-white/20 transition-colors backdrop-blur-sm"
                >
                  <Calendar className="w-4 h-4 text-blue-200" />
                  {t('victim.startCheckIn') || 'Daily Check-in'}
                </button>
              </div>
            </div>
          </div>

          {/* Section: AI Chat Stress Evaluation Results (If chat completed) */}
          {stressResult ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    stressLevel === 'High' 
                      ? 'bg-red-50 text-red-600' 
                      : stressLevel === 'Medium' 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      Recent AI Chat Stress Assessment
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                        Evaluated
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Calculated from your conversation with NEXORA AI
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStressModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
                  >
                    View Full Analysis
                  </button>
                  <button
                    onClick={handleStartAIChat}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl transition-colors"
                    title="Start a new chat to re-evaluate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    New Chat
                  </button>
                </div>
              </div>

              {/* Stress Level Big Badge & Score Banner */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-5 ${
                stressLevel === 'High'
                  ? 'bg-red-50/70 border-red-200 text-red-900'
                  : stressLevel === 'Medium'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 shadow-md ${
                    stressLevel === 'High' ? 'bg-red-600' : stressLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}>
                    <span className="text-2xl leading-none">{stressResult.score}%</span>
                    <span className="text-[10px] uppercase font-bold opacity-90 mt-1">/ 100</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                        stressLevel === 'High' 
                          ? 'bg-red-200 text-red-900' 
                          : stressLevel === 'Medium' 
                            ? 'bg-amber-200 text-amber-900' 
                            : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {stressLevel} Stress Level
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {stressResult.headline}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                      {stressResult.summary}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenDoctorModal()}
                  className={`w-full sm:w-auto px-5 py-3 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 ${
                    stressLevel === 'High' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : stressLevel === 'Medium' 
                        ? 'bg-amber-600 hover:bg-amber-700' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  {stressLevel === 'High' ? 'Consult Urgent Doctor Now' : 'Consult a Doctor'}
                </button>
              </div>

              {/* Emotional Tone Telemetry Cards */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Anxiety</span>
                  <span className="text-xs font-extrabold text-amber-600">{stressResult.emotionalTone.anxiety}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sadness</span>
                  <span className="text-xs font-extrabold text-blue-600">{stressResult.emotionalTone.sadness}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Frustration</span>
                  <span className="text-xs font-extrabold text-rose-600">{stressResult.emotionalTone.frustration}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hope</span>
                  <span className="text-xs font-extrabold text-indigo-600">{stressResult.emotionalTone.hope}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calmness</span>
                  <span className="text-xs font-extrabold text-emerald-600">{stressResult.emotionalTone.calm}%</span>
                </div>
              </div>
            </div>
          ) : (
            /* Prompt to Chat if no chat yet */
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    No Stress Assessment Yet
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chat with NEXORA AI to calculate your emotional stress score (High / Medium / Low) and view tailored doctor referrals.
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartAIChat}
                className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Start AI Chat Session
              </button>
            </div>
          )}

          {/* Section: Consult a Doctor Portal (Tailored to High / Medium / Low) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    Consult a Doctor Portal
                    {stressLevel && (
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        stressLevel === 'High' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : stressLevel === 'Medium' 
                            ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        Tailored for {stressLevel} Stress
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Certified psychiatrists & trauma specialists available for confidential tele-consultation
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleOpenDoctorModal()}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                View all doctors & timings →
              </button>
            </div>

            {/* Severity-Specific Advisory Banner */}
            {stressLevel === 'High' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-red-900">
                    High Emotional Distress Detected — Priority Consultation Queue
                  </h5>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Based on your conversation, your distress levels are significantly elevated. An emergency priority consultation slot has been reserved for you with our senior trauma psychiatrist.
                  </p>
                </div>
              </div>
            )}

            {stressLevel === 'Medium' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-amber-900">
                    Moderate Stress Detected — Routine Psychological Support
                  </h5>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    You are coping with noticeable stress from your legal proceedings. Booking a consultation can provide practical grounding techniques and anxiety relief.
                  </p>
                </div>
              </div>
            )}

            {stressLevel === 'Low' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-emerald-900">
                    Low Stress — Emotional State Stable
                  </h5>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Your responses indicate a calm and resilient state. Regular check-ins or optional maintenance sessions are available whenever you need them.
                  </p>
                </div>
              </div>
            )}

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOCTORS_LIST.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-primary/50 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={doc.avatar} 
                        alt={doc.name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {doc.rating} • {doc.experience}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-normal font-medium line-clamp-2">
                      {doc.specialty}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className={`text-[11px] font-bold ${doc.isAvailableNow ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {doc.available}
                    </span>
                    <button
                      onClick={() => handleOpenDoctorModal(doc.id)}
                      className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-xs transition-all"
                    >
                      Consult
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support & Hotlines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleOpenDoctorModal('doc_1')}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex items-center gap-4 hover:border-primary/50 transition-colors group text-left"
            >
              <div className="p-3.5 bg-blue-50 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Dedicated Caseworker & Counsellor</h4>
                <p className="text-xs text-slate-500 mt-0.5">Connect directly with your legal case counsellor</p>
              </div>
            </button>

            <a
              href="tel:14416"
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex items-center gap-4 hover:border-emerald-500/50 transition-colors group text-left"
            >
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">24/7 Tele-MANAS Medical Hotline</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dial 14416 toll-free for immediate psychological aid</p>
              </div>
            </a>
          </div>

          {/* Case Status Brief */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-start gap-4 shadow-md">
            <Info className="w-6 h-6 text-blue-300 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-base">{t('victim.caseStatus') || 'Legal Case Status'}</h3>
              <p className="text-slate-300 text-xs">
                Case #CR-2024-8891 • Investigation & Pre-Trial Phase • Status: Active Support
              </p>
              <p className="text-[11px] text-slate-400">
                Your assigned doctor and caseworker have been briefed on your emotional check-in history.
              </p>
            </div>
          </div>

        </div>
      ) : (
        /* Full Check-In Experience */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setShowCheckIn(false)}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 mb-4 flex items-center gap-1 transition-colors"
          >
            ← Back to Victim Dashboard
          </button>
          <CheckInChat onComplete={() => setShowCheckIn(false)} />
        </div>
      )}

      {/* Stress Report Modal */}
      <StressReportModal
        isOpen={isStressModalOpen}
        onClose={() => setIsStressModalOpen(false)}
        result={stressResult}
      />

      {/* Consult Doctor Modal */}
      <ConsultDoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        stressResult={stressResult}
        initialDoctorId={selectedDoctorId}
      />
    </div>
  );
};
