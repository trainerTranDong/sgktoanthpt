import React, { useState, useEffect, useMemo } from 'react';
import { Menu, ChevronRight, Book, Activity, CheckCircle, Lock, Unlock, PlayCircle, Star, X, Shuffle, RotateCcw, ArrowLeft } from 'lucide-react';
import { textbookData } from './data';
import { Chapter, Lesson, Exercise } from './types';
import MathRenderer from './components/MathRenderer';
import Chatbot from './components/Chatbot';

// Define unlocking threshold
const PASSING_THRESHOLD = 80;

const App: React.FC = () => {
  // --- STATE ---
  const [activeChapter, setActiveChapter] = useState<Chapter>(textbookData[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(textbookData[0].lessons[0]);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercises'>('theory');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Progression State
  const [unlockedLessons, setUnlockedLessons] = useState<Set<string>>(new Set([textbookData[0].lessons[0].id]));
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({}); 
  const [submittedExercises, setSubmittedExercises] = useState<Record<string, boolean>>({});

  // Practice Mode State
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceSet, setPracticeSet] = useState<Exercise[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, number | null>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<Record<string, boolean>>({});

  // --- LOGIC ---

  const allLessons = useMemo(() => {
    return textbookData.flatMap(chap => chap.lessons);
  }, []);

  const getLessonIndex = (id: string) => allLessons.findIndex(l => l.id === id);

  const currentLessonScore = useMemo(() => {
    if (activeLesson.exercises.length === 0) return 100;
    let correctCount = 0;
    activeLesson.exercises.forEach(ex => {
      if (submittedExercises[ex.id] && userAnswers[ex.id] === ex.correctOptionIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / activeLesson.exercises.length) * 100);
  }, [activeLesson, userAnswers, submittedExercises]);

  const handleOptionSelect = (exId: string, optionIndex: number) => {
    if (submittedExercises[exId]) return;
    setUserAnswers(prev => ({ ...prev, [exId]: optionIndex }));
  };

  const handleSubmitAnswer = (exId: string) => {
    if (userAnswers[exId] === undefined || userAnswers[exId] === null) return;
    setSubmittedExercises(prev => ({ ...prev, [exId]: true }));
  };

  // Practice Mode Logic
  const startPractice = () => {
    // Flatten all exercises from all lessons
    const allExercises = textbookData.flatMap(chap => 
        chap.lessons.flatMap(lesson => lesson.exercises)
    );

    if (allExercises.length === 0) return;

    // Shuffle and pick 5 random exercises
    const shuffled = [...allExercises].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    setPracticeSet(selected);
    setPracticeAnswers({});
    setPracticeSubmitted({});
    setIsPracticeMode(true);
    // Ensure we are on the exercises tab
    setActiveTab('exercises');
  };

  const handlePracticeOptionSelect = (exId: string, optionIndex: number) => {
    if (practiceSubmitted[exId]) return;
    setPracticeAnswers(prev => ({ ...prev, [exId]: optionIndex }));
  };

  const handlePracticeSubmitAnswer = (exId: string) => {
    if (practiceAnswers[exId] === undefined || practiceAnswers[exId] === null) return;
    setPracticeSubmitted(prev => ({ ...prev, [exId]: true }));
  };

  useEffect(() => {
    if (currentLessonScore >= PASSING_THRESHOLD) {
      const currentIndex = getLessonIndex(activeLesson.id);
      const nextLesson = allLessons[currentIndex + 1];
      if (nextLesson && !unlockedLessons.has(nextLesson.id)) {
        setUnlockedLessons(prev => new Set(prev).add(nextLesson.id));
      }
    }
  }, [currentLessonScore, activeLesson.id, allLessons, getLessonIndex, unlockedLessons]);

  const isLessonUnlocked = (lessonId: string) => unlockedLessons.has(lessonId);

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      {/* Sidebar Navigation - Modern Dark Gradient */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 shadow-2xl flex flex-col border-r border-slate-700/50`}
      >
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-4 bg-slate-950/30 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-3 rounded-xl shadow-lg shadow-teal-500/20">
             <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">Toán 12</h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Cánh Diều</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin scrollbar-thumb-slate-700">
          {textbookData.map((chapter) => (
            <div key={chapter.id} className="mb-6">
              <div 
                className={`px-4 py-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group ${activeChapter.id === chapter.id ? 'bg-white/10 shadow-inner' : ''}`}
                onClick={() => {
                    setActiveChapter(chapter);
                    if (chapter.lessons.length > 0 && isLessonUnlocked(chapter.lessons[0].id)) {
                      setActiveLesson(chapter.lessons[0]);
                      setIsPracticeMode(false); // Exit practice mode when changing chapters
                    }
                }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${activeChapter.id === chapter.id ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {chapter.id.toUpperCase().replace('CHAP', 'CH ')}
                    </span>
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                        {chapter.title.split(':')[0].replace('Chương ', '')}
                    </span>
                </div>
                <ChevronRight size={16} className={`text-slate-500 transition-transform duration-300 ${activeChapter.id === chapter.id ? 'rotate-90 text-teal-400' : ''}`} />
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeChapter.id === chapter.id ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-1 ml-2 pl-2 border-l border-slate-700">
                  {chapter.lessons.map(lesson => {
                    const unlocked = isLessonUnlocked(lesson.id);
                    const isActive = activeLesson.id === lesson.id && !isPracticeMode;
                    
                    return (
                      <button
                        key={lesson.id}
                        disabled={!unlocked}
                        onClick={() => {
                            setActiveLesson(lesson);
                            setIsPracticeMode(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all flex items-center gap-3
                          ${isActive ? 'bg-gradient-to-r from-teal-600/80 to-teal-600/20 text-teal-100 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                          ${!unlocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                        `}
                      >
                        {unlocked ? (
                             isActive ? <PlayCircle size={14} className="text-teal-300 animate-pulse" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                        ) : (
                            <Lock size={12} />
                        )}
                        <span className="truncate flex-1">{lesson.title.split('.')[1] || lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        {/* Modern Glassy Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 justify-between shadow-sm z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
                <h2 className="text-lg font-bold text-slate-800 truncate max-w-md md:max-w-2xl flex items-center gap-2">
                  {isPracticeMode ? 'Ôn tập tổng hợp' : activeLesson.title}
                  {!isPracticeMode && currentLessonScore >= PASSING_THRESHOLD && (
                     <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Hoàn thành
                     </span>
                  )}
                  {isPracticeMode && (
                     <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wide flex items-center gap-1">
                        <Shuffle size={10} /> Ngẫu nhiên
                     </span>
                  )}
                </h2>
                <span className="text-xs text-slate-500 font-medium tracking-wide hidden md:block uppercase">
                    {isPracticeMode ? 'Tất cả các chương' : activeChapter.title}
                </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Styled Progress Bar (Hide in practice mode or show session progress?) */}
             {!isPracticeMode && (
                 <div className="hidden sm:flex flex-col items-end w-40">
                    <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                        <span>Tiến độ</span>
                        <span className={currentLessonScore >= PASSING_THRESHOLD ? 'text-emerald-500' : 'text-teal-500'}>{currentLessonScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                            currentLessonScore >= PASSING_THRESHOLD 
                            ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                            : 'bg-gradient-to-r from-teal-400 to-cyan-500'
                        }`} 
                        style={{ width: `${currentLessonScore}%` }}
                      ></div>
                    </div>
                 </div>
             )}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Tab Navigation - Pill Style */}
            <div className="flex justify-center mb-6">
                <div className="bg-white/70 backdrop-blur p-1.5 rounded-2xl shadow-sm border border-slate-200/60 inline-flex">
                <button
                    onClick={() => {
                        setActiveTab('theory');
                        setIsPracticeMode(false);
                    }}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === 'theory' 
                        ? 'bg-white text-teal-700 shadow-md transform scale-105 ring-1 ring-slate-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                >
                    <Book size={18} />
                    Lý thuyết
                </button>
                <button
                    onClick={() => setActiveTab('exercises')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeTab === 'exercises' 
                        ? 'bg-white text-teal-700 shadow-md transform scale-105 ring-1 ring-slate-100' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                >
                    <Activity size={18} />
                    Luyện tập
                    {!isPracticeMode && activeLesson.exercises.length > 0 && (
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${currentLessonScore >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {Math.round(currentLessonScore)}%
                    </span>
                    )}
                </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="min-h-[600px] animate-fadeIn">
              
              {activeTab === 'theory' && (
                <div className="space-y-8">
                  {/* Theory Card - Modern Panel */}
                  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <i className="fa-solid fa-shapes text-6xl text-white"></i>
                        </div>
                       <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                          <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <i className="fa-solid fa-lightbulb text-yellow-300"></i>
                          </span>
                          Kiến thức trọng tâm
                       </h3>
                    </div>
                    {/* Added text-justify and leading-relaxed here */}
                    <div className="p-8 prose prose-slate prose-headings:text-teal-800 prose-strong:text-teal-700 max-w-none text-justify leading-relaxed">
                      <MathRenderer content={activeLesson.content.theory} />
                    </div>
                  </div>

                  {/* Example & Solution Grid */}
                  <div className="grid lg:grid-cols-2 gap-8">
                     {/* Example */}
                     <div className="bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                           <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <i className="fa-solid fa-calculator text-lg"></i>
                           </div>
                           <h4 className="font-bold text-slate-700 text-lg">Ví dụ minh hoạ</h4>
                        </div>
                        {/* Added text-justify here */}
                        <div className="p-6 flex-1 text-slate-700 leading-relaxed text-justify">
                           <MathRenderer content={activeLesson.content.example} />
                        </div>
                     </div>

                     {/* Solution */}
                     <div className="bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/30 flex items-center gap-3">
                           <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
                           </div>
                           <h4 className="font-bold text-emerald-800 text-lg">Lời giải chi tiết</h4>
                        </div>
                        {/* Added text-justify here */}
                        <div className="p-6 flex-1 bg-emerald-50/10 text-slate-700 leading-relaxed text-justify">
                           <MathRenderer content={activeLesson.content.solution} />
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'exercises' && (
                <div className="space-y-6 pb-20">
                  
                  {!isPracticeMode ? (
                    <>
                        {/* Practice Mode Promo Card */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <Shuffle size={20} className="text-indigo-200" />
                                    Chế độ Ôn tập Tổng hợp
                                </h3>
                                <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">
                                    Thử thách bản thân với 5 câu hỏi ngẫu nhiên từ tất cả các chương. 
                                    Không giới hạn mở khoá, giúp bạn củng cố kiến thức toàn diện.
                                </p>
                            </div>
                            <button 
                                onClick={startPractice}
                                className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-sm whitespace-nowrap transform hover:scale-105 active:scale-95"
                            >
                                Bắt đầu ngay
                            </button>
                        </div>

                        {/* Status Banner */}
                        <div className={`rounded-2xl p-5 border flex items-center gap-4 transition-colors ${
                            currentLessonScore >= PASSING_THRESHOLD 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-white border-slate-200 text-slate-600 shadow-sm'
                        }`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${
                                currentLessonScore >= PASSING_THRESHOLD ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {currentLessonScore >= PASSING_THRESHOLD ? <Unlock /> : <Lock />}
                            </div>
                            <div>
                            <p className="font-bold text-lg mb-0.5">Yêu cầu mở khoá bài tiếp theo</p>
                            <p className="text-sm opacity-80">
                                Bạn cần đạt tối thiểu <strong className="font-extrabold">{PASSING_THRESHOLD}%</strong>. 
                                Điểm hiện tại: <span className={`font-bold ${currentLessonScore >= 80 ? 'text-emerald-600' : 'text-teal-600'}`}>{currentLessonScore}%</span>
                            </p>
                            </div>
                        </div>

                        {/* Exercises List */}
                        {activeLesson.exercises.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="text-slate-200 mb-4 text-6xl">
                                    <i className="fa-solid fa-clipboard-question"></i>
                                </div>
                                <p className="text-slate-400 font-medium">Chưa có bài tập trắc nghiệm cho phần này.</p>
                            </div>
                        ) : (
                            activeLesson.exercises.map((ex, index) => {
                                const isSubmitted = submittedExercises[ex.id];
                                const selected = userAnswers[ex.id];
                                const isCorrect = selected === ex.correctOptionIndex;
                                
                                return (
                                <div key={ex.id} className="bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/40 overflow-hidden transition-all hover:shadow-xl hover:translate-y-[-2px]">
                                {/* Question Header */}
                                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md shadow-slate-800/20">
                                            Câu {index + 1}
                                        </span>
                                        {isSubmitted && (
                                            isCorrect 
                                            ? <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"><CheckCircle size={14}/> Chính xác</span>
                                            : <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"><X size={14}/> Sai rồi</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    {/* Question Text */}
                                    <div className="mb-8 text-slate-800 font-medium text-lg leading-relaxed text-justify">
                                        <MathRenderer content={ex.question} />
                                    </div>

                                    {/* Options Grid */}
                                    <div className="grid gap-3 mb-8">
                                        {ex.options.map((opt, i) => {
                                            let optionClass = "border-slate-200 hover:bg-slate-50 hover:border-teal-400";
                                            let icon = <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm transition-colors group-hover:bg-white">{String.fromCharCode(65 + i)}</div>;
                                            
                                            if (selected === i) {
                                                optionClass = "border-teal-500 bg-teal-50/50 ring-2 ring-teal-500 shadow-md";
                                                icon = <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center text-sm shadow-sm"><i className="fa-solid fa-check"></i></div>
                                            }

                                            if (isSubmitted) {
                                                if (i === ex.correctOptionIndex) {
                                                    optionClass = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 shadow-md";
                                                    icon = <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm"><i className="fa-solid fa-check"></i></div>
                                                } else if (selected === i && selected !== ex.correctOptionIndex) {
                                                    optionClass = "border-rose-500 bg-rose-50 ring-2 ring-rose-500 opacity-60";
                                                    icon = <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center text-sm shadow-sm"><i className="fa-solid fa-xmark"></i></div>
                                                } else {
                                                    optionClass = "opacity-40 border-slate-100 grayscale";
                                                }
                                            }

                                            return (
                                                <div 
                                                    key={i} 
                                                    onClick={() => handleOptionSelect(ex.id, i)}
                                                    className={`group relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${optionClass}`}
                                                >
                                                    <div className="mr-4 flex-shrink-0">
                                                        {icon}
                                                    </div>
                                                    <div className="text-slate-700 flex-1 font-medium">
                                                        <MathRenderer content={opt} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Actions / Explanation */}
                                    {!isSubmitted ? (
                                        <button 
                                            onClick={() => handleSubmitAnswer(ex.id)}
                                            disabled={userAnswers[ex.id] === undefined}
                                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
                                        >
                                            Kiểm tra đáp án
                                        </button>
                                    ) : (
                                        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 animate-fadeIn">
                                            <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
                                                <i className="fa-solid fa-lightbulb text-yellow-500 text-lg"></i>
                                                Giải thích chi tiết:
                                            </div>
                                            <div className="text-slate-700 leading-relaxed text-justify">
                                                <MathRenderer content={ex.explanation} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                </div>
                                )
                            })
                        )}
                        
                        {/* Next Lesson Button */}
                        {currentLessonScore >= PASSING_THRESHOLD && (
                            <div className="flex justify-center mt-12 pb-12">
                                <button 
                                    onClick={() => {
                                        const currentIndex = getLessonIndex(activeLesson.id);
                                        const next = allLessons[currentIndex + 1];
                                        if(next) setActiveLesson(next);
                                    }}
                                    className="group flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:bg-slate-800 transform hover:-translate-y-1 transition-all"
                                >
                                    Bài học tiếp theo
                                    <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                        <ChevronRight size={18} />
                                    </div>
                                </button>
                            </div>
                        )}
                    </>
                  ) : (
                    // PRACTICE MODE INTERFACE
                    <div className="animate-fadeIn pb-12">
                        {/* Practice Header Control */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button 
                                    onClick={() => setIsPracticeMode(false)}
                                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
                                    title="Quay lại bài học"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h2 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                                        Ôn tập tổng hợp
                                        <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">Random</span>
                                    </h2>
                                    <p className="text-slate-500 text-xs">Đang hiển thị {practiceSet.length} câu hỏi ngẫu nhiên</p>
                                </div>
                            </div>
                            <button 
                                onClick={startPractice}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                <RotateCcw size={16} />
                                Tạo đề mới
                            </button>
                        </div>

                        {/* Practice Questions Loop */}
                        <div className="space-y-6">
                            {practiceSet.map((ex, index) => {
                                const isSubmitted = practiceSubmitted[ex.id];
                                const selected = practiceAnswers[ex.id];
                                const isCorrect = selected === ex.correctOptionIndex;

                                return (
                                    <div key={ex.id} className="bg-white border border-indigo-50 rounded-3xl shadow-lg shadow-indigo-100/50 overflow-hidden transition-all hover:shadow-xl hover:translate-y-[-2px]">
                                        <div className="px-8 py-5 border-b border-indigo-50 bg-indigo-50/30 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md shadow-indigo-200">
                                                    Câu hỏi {index + 1}
                                                </span>
                                                {isSubmitted && (
                                                    isCorrect 
                                                    ? <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"><CheckCircle size={14}/> Chính xác</span>
                                                    : <span className="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"><X size={14}/> Sai rồi</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="mb-8 text-slate-800 font-medium text-lg leading-relaxed text-justify">
                                                <MathRenderer content={ex.question} />
                                            </div>

                                            <div className="grid gap-3 mb-8">
                                                {ex.options.map((opt, i) => {
                                                    let optionClass = "border-slate-200 hover:bg-indigo-50 hover:border-indigo-300";
                                                    let icon = <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm transition-colors group-hover:bg-white">{String.fromCharCode(65 + i)}</div>;
                                                    
                                                    if (selected === i) {
                                                        optionClass = "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 shadow-md";
                                                        icon = <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-sm shadow-sm"><i className="fa-solid fa-check"></i></div>
                                                    }

                                                    if (isSubmitted) {
                                                        if (i === ex.correctOptionIndex) {
                                                            optionClass = "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 shadow-md";
                                                            icon = <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm"><i className="fa-solid fa-check"></i></div>
                                                        } else if (selected === i && selected !== ex.correctOptionIndex) {
                                                            optionClass = "border-rose-500 bg-rose-50 ring-2 ring-rose-500 opacity-60";
                                                            icon = <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center text-sm shadow-sm"><i className="fa-solid fa-xmark"></i></div>
                                                        } else {
                                                            optionClass = "opacity-40 border-slate-100 grayscale";
                                                        }
                                                    }

                                                    return (
                                                        <div 
                                                            key={i} 
                                                            onClick={() => handlePracticeOptionSelect(ex.id, i)}
                                                            className={`group relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${optionClass}`}
                                                        >
                                                            <div className="mr-4 flex-shrink-0">
                                                                {icon}
                                                            </div>
                                                            <div className="text-slate-700 flex-1 font-medium">
                                                                <MathRenderer content={opt} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {!isSubmitted ? (
                                                <button 
                                                    onClick={() => handlePracticeSubmitAnswer(ex.id)}
                                                    disabled={practiceAnswers[ex.id] === undefined}
                                                    className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
                                                >
                                                    Chốt đáp án
                                                </button>
                                            ) : (
                                                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 animate-fadeIn">
                                                    <div className="flex items-center gap-2 mb-3 text-indigo-800 font-bold">
                                                        <i className="fa-solid fa-lightbulb text-yellow-500 text-lg"></i>
                                                        Giải thích chi tiết:
                                                    </div>
                                                    <div className="text-slate-700 leading-relaxed text-justify">
                                                        <MathRenderer content={ex.explanation} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot Integration */}
      <Chatbot />
    </div>
  );
};

export default App;