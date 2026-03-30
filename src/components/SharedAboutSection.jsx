import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Shared "Quiénes somos" section used across all pages.
 *
 * Props:
 *   team     – array of { name, experience, img, role, quote, study }
 *   labels   – { chip, title, desc, yearsLabel, studyLabel }
 */
export default function SharedAboutSection({ team, labels }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const member = team[activeIndex];

    return (
        <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#20316d]/[0.10] border border-[#20316d]/[0.20] rounded-full mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#20316d]" />
                        <span className="text-[12px] font-bold text-[#20316d] uppercase tracking-[1.2px]">{labels.chip}</span>
                    </div>
                    <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] mb-4">{labels.title}</h2>
                    <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">{labels.desc}</p>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden">
                    {/* Name tabs */}
                    <div className="flex gap-4 mb-8">
                        {team.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`px-4 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${i === activeIndex ? 'bg-[#20316d] text-white' : 'bg-gray-100 text-[#6B7280]'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>

                    {/* Top row: photo left (42%) + quote right (58%) */}
                    <div className="flex gap-4 mb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="w-[42%] flex-shrink-0 aspect-[3/4] rounded-xl overflow-hidden bg-[#E5E7EB]"
                            >
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#aebfff]/20 rounded-xl p-5 flex-1 flex items-center"
                            >
                                <p className="text-[16px] sm:text-[18px] font-semibold text-[#111827] leading-relaxed">
                                    {member.quote}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom row: person info side by side */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center gap-6"
                        >
                            <div>
                                <h4 className="text-[18px] font-bold text-[#20316d]">{member.name}</h4>
                                <p className="text-[13px] text-[#6B7280]">{member.role}</p>
                            </div>
                            <div className="w-px h-10 bg-[#E5E7EB]" />
                            <div>
                                <span className="text-[32px] font-extrabold text-[#111827] leading-none">{member.experience}</span>
                                <p className="text-[12px] text-[#6B7280] mt-0.5">{labels.yearsLabel}</p>
                            </div>
                            <div className="w-px h-10 bg-[#E5E7EB]" />
                            <div>
                                <span className="text-[16px] font-bold text-[#111827]">{member.study}</span>
                                <p className="text-[12px] text-[#6B7280] mt-0.5">{labels.studyLabel}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-row gap-16 items-start">
                    {/* Left: Names List */}
                    <div className="lg:w-[280px] flex-shrink-0">
                        <div className="space-y-0">
                            {team.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`py-5 border-b border-[#E5E7EB] cursor-pointer transition-all duration-300 ${i === activeIndex ? '' : 'opacity-50 hover:opacity-75'}`}
                                >
                                    <h4 className={`text-[20px] font-bold transition-colors duration-300 ${i === activeIndex ? 'text-[#20316d]' : 'text-[#111827]'}`}>
                                        {s.name}
                                    </h4>
                                    <p className="text-[14px] text-[#6B7280] mt-1">{s.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center: Photo */}
                    <div className="flex-shrink-0 w-[380px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#E5E7EB]"
                            >
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                        const placeholder = document.createElement('span');
                                        placeholder.textContent = member.name.split(' ').map(n => n[0]).join('');
                                        placeholder.className = 'text-6xl font-black text-gray-400';
                                        e.target.parentElement.appendChild(placeholder);
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Quote + Stats */}
                    <div className="flex-1 flex flex-col justify-between min-h-[480px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#aebfff]/20 rounded-2xl p-10 flex-1 flex items-center"
                            >
                                <p className="text-[18px] md:text-[24px] font-semibold text-[#111827] leading-relaxed">
                                    {member.quote}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="flex gap-12 mt-6"
                            >
                                <div>
                                    <span className="text-[48px] font-extrabold text-[#111827] leading-none">{member.experience}</span>
                                    <p className="text-[14px] text-[#6B7280] mt-1">{labels.yearsLabel}</p>
                                </div>
                                <div className="w-px bg-[#E5E7EB]" />
                                <div>
                                    <span className="text-[20px] font-bold text-[#111827] leading-tight block mt-2">{member.study}</span>
                                    <p className="text-[14px] text-[#6B7280] mt-1">{labels.studyLabel}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
