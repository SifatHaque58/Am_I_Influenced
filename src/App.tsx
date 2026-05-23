import { useStore } from './store/useStore';
import { LandingPage } from './components/LandingPage';
import { Questionnaire } from './components/Questionnaire';
import { ResultsDashboard } from './components/ResultsDashboard';

function App() {
  const { activeQuestions, isFinished } = useStore();

  const isQuizActive = activeQuestions.length > 0 && !isFinished;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-accent-blue rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-accent-rose rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-4xl py-10">
        {!isQuizActive && !isFinished && <LandingPage />}
        {isQuizActive && <Questionnaire />}
        {isFinished && <ResultsDashboard />}
      </div>
    </div>
  );
}

export default App;
