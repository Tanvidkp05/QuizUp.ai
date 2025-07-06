import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section with Background Pattern */}
      <section className="relative pb-10 px-6 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 z-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#e39dae] mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-[#6a85c4] mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Hero Text */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#132780] leading-tight mb-6">
                Learn Faster, <br />
                <span className="text-[#e5496f]">Together</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Transform studying into a <span className="font-semibold text-[#132780]">fun, competitive game</span>. 
                Upload your notes, generate quizzes, and battle your friends in real-time!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-[#e5496f] to-[#d43a60] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  Get Started →
                </Link>
                <Link
                  to="/game-modes"
                  className="px-8 py-4 border-2 border-[#132780] text-[#132780] font-medium rounded-xl hover:bg-[#132780]/10 transition-all"
                >
                  Explore Game Modes
                </Link>
              </div>
              
              {/* Stats Bar */}
              <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-[#132780]">10K+</div>
                    <div className="text-gray-500">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#132780]">500+</div>
                    <div className="text-gray-500">Subjects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#132780]">1M+</div>
                    <div className="text-gray-500">Questions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Featured Image */}
            <div className="relative">
              <img 
                src="/Collaboration.svg" 
                alt="Students collaborating" 
                className="w-full h-auto max-w-2xl mx-auto"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#132780] text-white px-6 py-3 rounded-full shadow-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#e5496f] mr-2 animate-pulse"></div>
                  <span className="font-medium">Live Battles: 124</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white relative">
        {/* Wave divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg 
  viewBox="0 0 1200 120" 
  preserveAspectRatio="none" 
  className="w-full h-16 md:h-24"
>
  {/* Base wave layer */}
  <path 
    d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
    className="fill-[#132780]"
    opacity="0.8"
  ></path>
  
  {/* Colorful wave accents */}
  <path 
    d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
    className="fill-[#e5496f]"
    opacity="0.5"
  ></path>
  
  {/* Creative floating shapes */}
  <circle cx="300" cy="30" r="15" className="fill-[#8cb3e9]" opacity="0.7"/>
  <circle cx="600" cy="20" r="12" className="fill-[#e39dae]" opacity="0.8"/>
  <circle cx="900" cy="40" r="18" className="fill-[#6a85c4]" opacity="0.6"/>
  
  {/* Abstract decorative elements */}
  <path 
    d="M200,60 Q250,30 300,60 T400,60 T500,40 T600,70 T700,30 T800,50 T900,40 T1000,60 T1100,30"
    stroke="#ffffff"
    strokeWidth="2"
    fill="none"
    strokeDasharray="5,5"
    opacity="0.3"
  />
  
  {/* Top clean edge */}
  <path 
    d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
    className="fill-white"
  ></path>
</svg>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#132780] mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your notes into competitive games in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Notes',
                color: '#e5496f',
                desc: 'Upload your study materials or choose from existing topics.',
                icon: '📁'
              },
              {
                step: '2',
                title: 'Generate Questions',
                color: '#6a85c4',
                desc: 'Our AI generates quizzes to test and boost your knowledge.',
                icon: '🤖'
              },
              {
                step: '3',
                title: 'Play & Compete',
                color: '#8cb3e9',
                desc: 'Challenge yourself or your friends in exciting game modes.',
                icon: '🎮'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto" 
                  style={{ backgroundColor: `${item.color}20` }}>
                  {item.icon}
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-[#132780] text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[#132780] mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#132780] mb-4">Exciting Game Modes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you want to learn today
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Deathmatch */}
            <div className="bg-gradient-to-br from-[#f9f9ff] to-white rounded-2xl p-8 shadow-xl border border-gray-100 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#e39dae]/20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#e39dae]/20 flex items-center justify-center text-2xl">
                    🔥
                  </div>
                  <h3 className="text-2xl font-bold text-[#132780]">Deathmatch</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Compete against friends and survive with your 5 lives. Each wrong answer costs one!
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 bg-[#e39dae]/10 text-[#e5496f] rounded-full text-sm font-medium">Medium Difficulty</span>
                  <span className="px-4 py-2 bg-[#6a85c4]/10 text-[#132780] rounded-full text-sm font-medium">2-4 Players</span>
                  <span className="px-4 py-2 bg-[#8cb3e9]/10 text-[#132780] rounded-full text-sm font-medium">Fast-paced</span>
                </div>
                <Link 
                  to="/deathmatch" 
                  className="inline-block px-6 py-3 bg-[#e5496f] text-white rounded-lg font-medium hover:bg-[#d43a60] transition"
                >
                  Try Deathmatch
                </Link>
              </div>
            </div>

            {/* Boss Fight */}
            <div className="bg-gradient-to-br from-[#f9f9ff] to-white rounded-2xl p-8 shadow-xl border border-gray-100 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#6a85c4]/20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#6a85c4]/20 flex items-center justify-center text-2xl">
                    👑
                  </div>
                  <h3 className="text-2xl font-bold text-[#132780]">Boss Fight</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Team up to defeat the boss. Each correct answer weakens the boss — but wrong ones cost health!
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 bg-[#e39dae]/10 text-[#e5496f] rounded-full text-sm font-medium">Hard Difficulty</span>
                  <span className="px-4 py-2 bg-[#6a85c4]/10 text-[#132780] rounded-full text-sm font-medium">3-5 Players</span>
                  <span className="px-4 py-2 bg-[#8cb3e9]/10 text-[#132780] rounded-full text-sm font-medium">Team Strategy</span>
                </div>
                <Link 
                  to="/boss-fight" 
                  className="inline-block px-6 py-3 bg-[#132780] text-white rounded-lg font-medium hover:bg-[#0f1843] transition"
                >
                  Try Boss Fight
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-[#f9f9ff]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#132780] mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who improved their grades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I went from C's to A's thanks to QuizUp! The competitive aspect made studying addictive.",
                name: "Sarah K.",
                role: "Biology Student",
                avatar: "👩‍🎓"
              },
              {
                quote: "Finally a study tool that doesn't feel like work. My friends and I learn while having fun!",
                name: "Michael T.",
                role: "Engineering Student",
                avatar: "👨‍💻"
              },
              {
                quote: "The AI-generated questions are spot on. It's like having a personal tutor 24/7.",
                name: "Priya M.",
                role: "Medical Student",
                avatar: "👩‍⚕️"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold text-[#132780]">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#132780] to-[#6a85c4] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Studying?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning smarter, not harder.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-[#132780] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;