import React from 'react'
import { Link } from 'react-router-dom';


const gameModes2 = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#132780] mb-4">Exciting Game Modes</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Choose how you want to learn today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QuizUP Challenge */}
          <div className="bg-gradient-to-br from-[#f9f9ff] to-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden relative"
          style={{ backgroundColor: '#b5c1e2' }}>
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#e39dae]/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#e39dae]/20 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <h3 className="text-2xl font-bold text-[#132780]">QuizUP Challenge</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Test your knowledge by uploading PDFs and answering our generated quizzes
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-[#e39dae]/10 text-[#e5496f] rounded-full text-sm font-medium">Medium Difficulty</span>
                <span className="px-4 py-2 bg-[#6a85c4]/10 text-[#132780] rounded-full text-sm font-medium">1 Player</span>
                <span className="px-4 py-2 bg-[#8cb3e9]/10 text-[#132780] rounded-full text-sm font-medium">Fast-paced</span>
              </div>
              <Link 
                to="/generateQuiz" 
                className="inline-block px-6 py-3 bg-[#e5496f] text-white rounded-lg font-medium hover:bg-[#d43a60] transition"
              >
                Try it
              </Link>
            </div>
          </div>

          {/* Rival-Fight */}
          <div className="bg-gradient-to-br from-[#f9f9ff] to-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#6a85c4]/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#6a85c4]/20 flex items-center justify-center text-2xl">
                  👑
                </div>
                <h3 className="text-2xl font-bold text-[#132780]">Rival-Fight</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Earn points for every correct answer and climb the leaderboard by answering faster than your rivals!
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-[#e39dae]/10 text-[#e5496f] rounded-full text-sm font-medium">Medium</span>
                <span className="px-4 py-2 bg-[#6a85c4]/10 text-[#132780] rounded-full text-sm font-medium">Multiplayer</span>
                <span className="px-4 py-2 bg-[#8cb3e9]/10 text-[#132780] rounded-full text-sm font-medium">Fast-paced</span>
              </div>
              <Link 
                to="/multiplayer" 
                className="inline-block px-6 py-3 bg-[#132780] text-white rounded-lg font-medium hover:bg-[#0f1843] transition"
              >
                Try Rival-Fight
              </Link>
            </div>
          </div>

          {/* In Progress Mode 1 */}
          <div className="bg-gradient-to-br from-[#f9f9ff] to-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden relative opacity-90">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#8cb3e9]/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#8cb3e9]/20 flex items-center justify-center text-2xl">
                  ⏳
                </div>
                <h3 className="text-2xl font-bold text-[#132780]">Time Attack</h3>
                <span className="px-3 py-1 bg-[#e39dae]/20 text-[#e5496f] rounded-full text-xs font-bold">Coming Soon</span>
              </div>
              <p className="text-gray-700 mb-6">
                Answer as many questions as you can before time runs out! Beat the clock and set new high scores.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-[#e39dae]/10 text-[#e5496f] rounded-full text-sm font-medium">Hard Difficulty</span>
                <span className="px-4 py-2 bg-[#6a85c4]/10 text-[#132780] rounded-full text-sm font-medium">Solo</span>
                <span className="px-4 py-2 bg-[#8cb3e9]/10 text-[#132780] rounded-full text-sm font-medium">Time-based</span>
              </div>
              <button 
                className="inline-block px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* In Progress Mode 2 */}
          <div className="bg-gradient-to-br from-[#f9f9ff] to-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden relative opacity-90">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#e5496f]/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#e5496f]/20 flex items-center justify-center text-2xl">
                  🏆
                </div>
                <h3 className="text-2xl font-bold text-[#132780]">Tournament</h3>
                <span className="px-3 py-1 bg-[#e39dae]/20 text-[#e5496f] rounded-full text-xs font-bold">Coming Soon</span>
              </div>
              <p className="text-gray-700 mb-6">
                Compete in weekly tournaments against players worldwide. Climb the ranks and win exclusive rewards!
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-[#e39dae]/10 text-[#e5496f] rounded-full text-sm font-medium">Variable</span>
                <span className="px-4 py-2 bg-[#6a85c4]/10 text-[#132780] rounded-full text-sm font-medium">Mass Multiplayer</span>
                <span className="px-4 py-2 bg-[#8cb3e9]/10 text-[#132780] rounded-full text-sm font-medium">Competitive</span>
              </div>
              <button 
                className="inline-block px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default gameModes2