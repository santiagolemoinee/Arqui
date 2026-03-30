import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Wallet, Home, Key, Settings,
    Activity, TrendingUp, Globe, Users, ArrowRight,
    LayoutDashboard, Package, FolderOpen, BarChart3, ChevronRight, DollarSign, X,
} from 'lucide-react';

const NAV_T = {
    es: {
        modules: 'Módulos', serve: 'A quiénes servimos', resources: 'Recursos',
        pricing: 'Pricing', login: 'Iniciar Sesión', cta: 'Empezar Ahora',
    },
    en: {
        modules: 'Modules', serve: 'Who we serve', resources: 'Resources',
        pricing: 'Pricing', login: 'Log In', cta: 'Get Started',
    },
};

export default function SharedNavbar({ lang = 'es', setLang }) {
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [modulesOpen, setModulesOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [serveOpen, setServeOpen] = useState(false);
    const serveTimeoutRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    const resourcesTimeoutRef = useRef(null);
    const lastScrollY = useRef(0);
    const t = NAV_T[lang] || NAV_T.es;

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 50);
            if (currentY > lastScrollY.current && currentY > 80) {
                setNavHidden(true);
            } else {
                setNavHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const openModal = () => setContactOpen(true);
        window.addEventListener('open-contact-modal', openModal);
        return () => window.removeEventListener('open-contact-modal', openModal);
    }, []);

    const handleModulesEnter = useCallback(() => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setResourcesOpen(false);
        setModulesOpen(true);
    }, []);

    const handleModulesLeave = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => setModulesOpen(false), 150);
    }, []);

    const handleResourcesEnter = useCallback(() => {
        if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
        setModulesOpen(false);
        setResourcesOpen(true);
    }, []);

    const handleResourcesLeave = useCallback(() => {
        resourcesTimeoutRef.current = setTimeout(() => setResourcesOpen(false), 150);
    }, []);

    const modules = [
        {
            id: 'build',
            name: 'Arqy Build',
            tagline: lang === 'es' ? 'Control Total de Obra' : 'Total Construction Control',
            icon: Building2,
            color: '#0051FF',
            bgColor: '#EEF3FF',
            features: [],
            solutions: [
                { labelEs: 'Sales',               labelEn: 'Sales',          link: '/sales',               icon: TrendingUp },
                { labelEs: 'Gestión de Proyectos', labelEn: 'Project Mgmt',   link: '/project-management',  icon: LayoutDashboard },
                { labelEs: 'Compras',             labelEn: 'Procurement',     link: '/procurement',         icon: Package },
                { labelEs: 'Equipo',              labelEn: 'Team',            link: '/team-management',     icon: Users },
                { labelEs: 'Finanzas',             labelEn: 'Finance',         link: '/finance',             icon: DollarSign },
                { labelEs: 'Documentos',          labelEn: 'Documents',       link: '/document-management', icon: FolderOpen },
                { labelEs: 'Analytics',           labelEn: 'Analytics',       link: '/analytics',           icon: BarChart3 },
            ],
        },
        {
            id: 'state',
            name: 'Arqy State',
            tagline: lang === 'es' ? 'Marketplace con Trazabilidad' : 'Marketplace with Traceability',
            icon: Key,
            color: '#7B61FF',
            bgColor: '#F3F0FF',
            features: lang === 'es'
                ? ['Inventario dinámico', 'Evidencia certificada', 'Contratos digitales']
                : ['Dynamic inventory', 'Certified evidence', 'Digital contracts'],
        },
        {
            id: 'home',
            name: 'Arqy Home',
            tagline: lang === 'es' ? 'Tu Edificio, Tu Red Social' : 'Your Building, Your Network',
            icon: Home,
            color: '#10B981',
            bgColor: '#ECFDF5',
            features: lang === 'es'
                ? ['Votaciones de consorcio', 'Reserva de amenities', 'Comunidad conectada']
                : ['HOA voting', 'Amenity booking', 'Connected community'],
        },
        {
            id: 'management',
            name: 'Arqy Management',
            tagline: lang === 'es' ? 'Gestión Inteligente del Edificio' : 'Smart Building Management',
            icon: Settings,
            color: '#F59E0B',
            bgColor: '#FFFBEB',
            features: lang === 'es'
                ? ['Monitoreo IoT', 'Marketplace de proveedores', 'Mantenimiento preventivo']
                : ['IoT monitoring', 'Provider marketplace', 'Preventive maintenance'],
        },
        {
            id: 'capital',
            name: 'Arqy Capital',
            tagline: lang === 'es' ? 'Infraestructura de Inversión' : 'Investment Infrastructure',
            icon: Wallet,
            color: '#0D9488',
            bgColor: '#F0FDFA',
            features: lang === 'es'
                ? ['Token ARQY', 'Micro-inversión', 'Liquidez digital']
                : ['ARQY Token', 'Micro-investment', 'Digital liquidity'],
        },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileAccordion, setMobileAccordion] = useState(null); // 'modules' | 'serve' | 'resources' | null
    const [mobileModuleExpanded, setMobileModuleExpanded] = useState(null); // module id or null
    const comingSoonLabel = lang === 'es' ? 'Próximamente' : 'Coming soon';

    const toggleMobileAccordion = (section) => {
        setMobileAccordion(prev => prev === section ? null : section);
        if (section !== 'modules') setMobileModuleExpanded(null);
    };

    const toggleMobileModule = (modId) => {
        setMobileModuleExpanded(prev => prev === modId ? null : modId);
    };

    const resourceItems = [
        { label: lang === 'es' ? 'Sobre Nosotros' : 'About Us', icon: Users, href: '/about' },
        { label: lang === 'es' ? 'Casos de Éxito' : 'Success Cases', icon: TrendingUp, comingSoon: true },
        { label: lang === 'es' ? 'Actualizaciones' : 'Updates', icon: Activity, comingSoon: true },
        { label: lang === 'es' ? 'Contáctanos' : 'Contact Us', icon: Globe, href: '/contact' },
        { label: 'Blog', icon: Globe, comingSoon: true },
    ];

    return (
        <>
        <div className="fixed left-1/2 -translate-x-1/2 z-[100] max-w-[1400px] w-full top-4">
            <motion.div
                animate={{ y: navHidden ? '-120%' : '0%' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                <nav className={`h-[56px] lg:h-[76px] mx-3 lg:mx-4 rounded-full border border-gray-200 shadow-premium transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-lg'}`}>
                    <div className="h-full px-4 lg:px-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/">
                                <img
                                    src="/images/Arqy_logo.png"
                                    alt="Arqy Logo"
                                    className="h-7 lg:h-10 w-auto transition-transform hover:scale-105"
                                />
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center gap-14 text-[16px] font-bold text-text-secondary">
                            <button
                                onMouseEnter={handleModulesEnter}
                                onMouseLeave={handleModulesLeave}
                                className={`relative group flex items-center gap-1.5 cursor-pointer transition-colors ${modulesOpen ? 'text-lebane' : 'hover:text-lebane'}`}
                            >
                                {t.modules}
                                <motion.svg
                                    className="w-3.5 h-3.5 mt-0.5"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    animate={{ rotate: modulesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </motion.svg>
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-lebane transition-all duration-300 ${modulesOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </button>
                            <div className="relative"
                                onMouseEnter={() => { if (serveTimeoutRef.current) clearTimeout(serveTimeoutRef.current); setModulesOpen(false); setResourcesOpen(false); setServeOpen(true); }}
                                onMouseLeave={() => { serveTimeoutRef.current = setTimeout(() => setServeOpen(false), 200); }}
                            >
                                <button className="hover:text-lebane transition-colors relative group flex items-center gap-1.5 cursor-pointer bg-transparent border-none">
                                    {t.serve}
                                    <svg className="w-3.5 h-3.5 mt-0.5" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-lebane transition-all duration-300 ${serveOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </button>
                                <AnimatePresence>
                                    {serveOpen && (
                                        <motion.div
                                            className="absolute top-full left-0 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden px-8 py-6 whitespace-nowrap"
                                            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-[#F9FAFB] border border-gray-200 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-[15px] font-bold text-gray-700">{lang === 'es' ? 'A quiénes servimos' : 'Who we serve'}</p>
                                                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#20316d] text-white">
                                                    {lang === 'es' ? 'Próximamente' : 'Coming soon'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                onMouseEnter={handleResourcesEnter}
                                onMouseLeave={handleResourcesLeave}
                                className={`relative group flex items-center gap-1.5 cursor-pointer transition-colors ${resourcesOpen ? 'text-lebane' : 'hover:text-lebane'}`}
                            >
                                {t.resources}
                                <motion.svg
                                    className="w-3.5 h-3.5 mt-0.5"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    animate={{ rotate: resourcesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </motion.svg>
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-lebane transition-all duration-300 ${resourcesOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </button>
                            <Link to="/pricing" className="hover:text-lebane transition-colors relative group">
                                {t.pricing}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lebane transition-all group-hover:w-full" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Language Toggle */}
                            {setLang && (
                                <div className="hidden sm:flex items-center rounded-full border border-gray-200 overflow-hidden text-[14px] font-bold">
                                    <button
                                        onClick={() => setLang('es')}
                                        className={`px-4 py-2.5 transition-all duration-200 ${lang === 'es' ? 'bg-[#20316d] text-white' : 'text-text-primary hover:bg-gray-50'}`}
                                    >
                                        ES
                                    </button>
                                    <div className="w-px h-5 bg-gray-200" />
                                    <button
                                        onClick={() => setLang('en')}
                                        className={`px-4 py-2.5 transition-all duration-200 ${lang === 'en' ? 'bg-[#20316d] text-white' : 'text-text-primary hover:bg-gray-50'}`}
                                    >
                                        EN
                                    </button>
                                </div>
                            )}
                            <button onClick={() => setContactOpen(true)} className="text-white font-bold px-4 py-2 lg:px-9 lg:py-4 rounded-full text-[12px] lg:text-[16px] transition-all hover:brightness-110 active:scale-95 whitespace-nowrap" style={{ backgroundColor: '#20316d', boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}>
                                {t.cta}
                            </button>
                            {/* Hamburger button - mobile/tablet only */}
                            <button
                                onClick={() => { setMobileMenuOpen(!mobileMenuOpen); if (mobileMenuOpen) { setMobileAccordion(null); setMobileModuleExpanded(null); } }}
                                className="lg:hidden flex flex-col items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                    className="block w-5 h-[2px] bg-[#20316d] mb-1"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="block w-5 h-[2px] bg-[#20316d] mb-1"
                                />
                                <motion.span
                                    animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                    className="block w-5 h-[2px] bg-[#20316d]"
                                />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown - Accordion Style */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="lg:hidden absolute left-4 right-4 bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-[75vh] overflow-y-auto"
                            style={{ top: '88px', boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-4 flex flex-col">
                                {/* Módulos accordion */}
                                <button
                                    onClick={() => toggleMobileAccordion('modules')}
                                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-[14px] font-bold text-gray-900">{t.modules}</span>
                                    <motion.svg
                                        className="w-4 h-4 text-gray-400"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        animate={{ rotate: mobileAccordion === 'modules' ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </motion.svg>
                                </button>
                                <AnimatePresence>
                                    {mobileAccordion === 'modules' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-2 flex flex-col gap-0.5 pb-1">
                                                {modules.map((mod) => (
                                                    <div key={mod.id}>
                                                        <button
                                                            onClick={() => {
                                                                if (mod.id === 'build') toggleMobileModule(mod.id);
                                                                else { /* no-op for coming soon */ }
                                                            }}
                                                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                                        >
                                                            {mod.id === 'build' ? (
                                                                <Link
                                                                    to="/build"
                                                                    onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                                                                    className="flex items-center gap-2.5 flex-1"
                                                                >
                                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: mod.bgColor }}>
                                                                        <mod.icon className="w-3.5 h-3.5" style={{ color: mod.color }} />
                                                                    </div>
                                                                    <div className="flex-1 text-left">
                                                                        <p className="text-[13px] font-semibold text-gray-900">{mod.name}</p>
                                                                    </div>
                                                                </Link>
                                                            ) : (
                                                                <>
                                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: mod.bgColor }}>
                                                                        <mod.icon className="w-3.5 h-3.5" style={{ color: mod.color }} />
                                                                    </div>
                                                                    <div className="flex-1 text-left">
                                                                        <p className="text-[13px] font-semibold text-gray-900">{mod.name}</p>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {mod.id === 'build' ? (
                                                                <motion.svg
                                                                    className="w-3.5 h-3.5 text-gray-400"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                    animate={{ rotate: mobileModuleExpanded === mod.id ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </motion.svg>
                                                            ) : (
                                                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#20316d] text-white">{comingSoonLabel}</span>
                                                            )}
                                                        </button>
                                                        {/* Sub-items for Build */}
                                                        <AnimatePresence>
                                                            {mod.id === 'build' && mobileModuleExpanded === 'build' && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="pl-10 pr-3 flex flex-col gap-0.5 pb-1">
                                                                        {mod.solutions.map(({ labelEs, labelEn, link, icon: Icon }, fi) => (
                                                                            <Link
                                                                                key={fi}
                                                                                to={link}
                                                                                onClick={() => setMobileMenuOpen(false)}
                                                                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] text-gray-500 hover:text-[#0051FF] hover:bg-[#EEF3FF] transition-all"
                                                                            >
                                                                                <Icon size={12} className="flex-shrink-0" />
                                                                                <span className="font-medium">{lang === 'es' ? labelEs : labelEn}</span>
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="h-px bg-gray-100 mx-3" />

                                {/* A quiénes servimos accordion */}
                                <button
                                    onClick={() => toggleMobileAccordion('serve')}
                                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-[14px] font-bold text-gray-900">{t.serve}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#20316d] text-white">{comingSoonLabel}</span>
                                    </div>
                                </button>

                                <div className="h-px bg-gray-100 mx-3" />

                                {/* Recursos accordion */}
                                <button
                                    onClick={() => toggleMobileAccordion('resources')}
                                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-[14px] font-bold text-gray-900">{t.resources}</span>
                                    <motion.svg
                                        className="w-4 h-4 text-gray-400"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        animate={{ rotate: mobileAccordion === 'resources' ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </motion.svg>
                                </button>
                                <AnimatePresence>
                                    {mobileAccordion === 'resources' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-4 flex flex-col gap-0.5 pb-1">
                                                {resourceItems.map(({ label, icon: Icon, comingSoon, href }) => (
                                                    href ? (
                                                        <Link
                                                            key={label}
                                                            to={href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-[13px] font-medium text-gray-700">{label}</span>
                                                        </Link>
                                                    ) : (
                                                        <div key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-xl">
                                                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-[13px] font-medium text-gray-500">{label}</span>
                                                            {comingSoon && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#20316d] text-white">{comingSoonLabel}</span>}
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="h-px bg-gray-100 mx-3" />

                                {/* Pricing - direct link */}
                                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-[14px] font-bold text-gray-900">
                                    {t.pricing}
                                </Link>

                                {/* Language toggle for mobile */}
                                {setLang && (
                                    <div className="sm:hidden flex items-center justify-center mt-2 pb-1">
                                        <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-[13px] font-bold">
                                            <button
                                                onClick={() => setLang('es')}
                                                className={`px-3.5 py-2 transition-all duration-200 ${lang === 'es' ? 'bg-[#20316d] text-white' : 'text-text-primary hover:bg-gray-50'}`}
                                            >
                                                ES
                                            </button>
                                            <div className="w-px h-4 bg-gray-200" />
                                            <button
                                                onClick={() => setLang('en')}
                                                className={`px-3.5 py-2 transition-all duration-200 ${lang === 'en' ? 'bg-[#20316d] text-white' : 'text-text-primary hover:bg-gray-50'}`}
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modules Mega Menu */}
                <AnimatePresence>
                    {modulesOpen && (
                        <motion.div
                            className="absolute left-4 right-4 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                            style={{ top: '88px', boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            onMouseEnter={handleModulesEnter}
                            onMouseLeave={handleModulesLeave}
                        >
                            <div className="grid grid-cols-5 divide-x divide-gray-100">
                                {modules.map((mod) => (
                                    <div key={mod.id} className="p-6 flex flex-col">
                                        {mod.id === 'build' ? (
                                            <Link
                                                to="/build"
                                                className="font-bold text-[17px] text-gray-900 mb-1 hover:text-lebane transition-all leading-tight inline-block hover:scale-[1.04] origin-left"
                                            >
                                                {mod.name}
                                            </Link>
                                        ) : (
                                            <a
                                                href="#"
                                                onClick={e => e.preventDefault()}
                                                className="font-bold text-[17px] text-gray-900 mb-1 hover:text-lebane transition-all leading-tight inline-block hover:scale-[1.04] origin-left"
                                            >
                                                {mod.name}
                                            </a>
                                        )}

                                        <p className="text-[13px] font-semibold mb-3 leading-tight" style={{ color: mod.color }}>
                                            {mod.tagline}
                                        </p>

                                        <div className="h-px bg-gray-100 mb-3" />

                                        <div className="space-y-0.5">
                                            {mod.id === 'build' ? (
                                                mod.solutions.map(({ labelEs, labelEn, link, icon: Icon }, fi) => (
                                                    <motion.div
                                                        key={fi}
                                                        initial={{ opacity: 0, x: -6 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.18, delay: fi * 0.045 }}
                                                    >
                                                        <Link
                                                            to={link}
                                                            onClick={() => setModulesOpen(false)}
                                                            className="group flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12.5px] text-gray-500 hover:text-[#0051FF] hover:bg-[#EEF3FF] transition-all duration-200"
                                                        >
                                                            <Icon size={12} className="flex-shrink-0 text-gray-400 group-hover:text-[#0051FF] transition-colors duration-200" />
                                                            <span className="font-medium">{lang === 'es' ? labelEs : labelEn}</span>
                                                            <ChevronRight size={10} className="ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                                        </Link>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#20316d] text-white whitespace-nowrap">
                                                    {comingSoonLabel}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-3 flex items-center justify-between">
                                <span className="text-[12px] text-gray-400">
                                    {lang === 'es' ? '5 módulos para cubrir el ciclo de vida completo del real estate' : '5 modules covering the complete real estate lifecycle'}
                                </span>
                                <Link
                                    to="/build"
                                    className="flex items-center gap-1.5 text-[12px] font-semibold text-lebane hover:gap-2.5 transition-all"
                                >
                                    {lang === 'es' ? 'Ver todos los módulos' : 'View all modules'}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Resources Dropdown */}
                <AnimatePresence>
                    {resourcesOpen && (
                        <motion.div
                            className="absolute left-4 right-4 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                            style={{ top: '88px', boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            onMouseEnter={handleResourcesEnter}
                            onMouseLeave={handleResourcesLeave}
                        >
                            <div className="grid grid-cols-[1fr_2fr] divide-x divide-gray-100">
                                <div className="p-6 flex flex-col gap-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                        {lang === 'es' ? 'Compañía' : 'Company'}
                                    </p>
                                    {[
                                        { label: lang === 'es' ? 'Sobre Nosotros' : 'About Us', desc: lang === 'es' ? 'Conocé al equipo y nuestra misión' : 'Meet the team and our mission', icon: Users, color: '#0051FF', bg: '#EEF3FF', href: '/about' },
                                        { label: lang === 'es' ? 'Casos de Éxito' : 'Success Cases', desc: lang === 'es' ? 'Cómo nuestros clientes crecen con Arqy' : 'How our clients grow with Arqy', icon: TrendingUp, color: '#10B981', bg: '#ECFDF5', comingSoon: true },
                                        { label: lang === 'es' ? 'Actualizaciones de la Plataforma' : 'Platform Updates', desc: lang === 'es' ? 'Novedades y mejoras del ecosistema' : 'Latest ecosystem news and improvements', icon: Activity, color: '#7B61FF', bg: '#F3F0FF', comingSoon: true },
                                        { label: lang === 'es' ? 'Contáctanos' : 'Contact Us', desc: lang === 'es' ? 'Hablá con nuestro equipo' : 'Talk to our team', icon: Globe, color: '#20316d', bg: '#EEF0F8', href: '/contact' },
                                    ].map(({ label, desc, icon: Icon, color, bg, comingSoon, href }) => (
                                        href ? (
                                        <Link
                                            key={label}
                                            to={href}
                                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group/item"
                                        >
                                            <div className="w-8 self-stretch rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                                                <Icon className="w-4 h-4" style={{ color }} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[14px] font-semibold text-gray-900 group-hover/item:text-lebane transition-all group-hover/item:scale-[1.03] inline-block origin-left">
                                                        {label}
                                                    </p>
                                                    {comingSoon && (
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#20316d] text-white whitespace-nowrap">
                                                            {lang === 'es' ? 'Próximamente' : 'Coming soon'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[12px] text-gray-500 leading-snug mt-0.5">{desc}</p>
                                            </div>
                                        </Link>
                                        ) : (
                                        <a
                                            key={label}
                                            href="#"
                                            onClick={e => e.preventDefault()}
                                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group/item"
                                        >
                                            <div className="w-8 self-stretch rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                                                <Icon className="w-4 h-4" style={{ color }} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[14px] font-semibold text-gray-900 group-hover/item:text-lebane transition-all group-hover/item:scale-[1.03] inline-block origin-left">
                                                        {label}
                                                    </p>
                                                    {comingSoon && (
                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#20316d] text-white whitespace-nowrap">
                                                            {lang === 'es' ? 'Próximamente' : 'Coming soon'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[12px] text-gray-500 leading-snug mt-0.5">{desc}</p>
                                            </div>
                                        </a>
                                        )
                                    ))}
                                </div>

                                <div className="p-6 flex flex-col">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">Blog</p>
                                    <div className="flex-1 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col items-center justify-center gap-3 py-10 px-8">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                            <Globe className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[15px] font-bold text-gray-700 mb-1">
                                                {lang === 'es' ? 'Artículos y guías del ecosistema' : 'Ecosystem articles & guides'}
                                            </p>
                                            <p className="text-[13px] text-gray-400">
                                                {lang === 'es' ? 'Tendencias, casos de uso y novedades del real estate digital.' : 'Trends, use cases and real estate news.'}
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#20316d] text-white">
                                            {lang === 'es' ? 'Próximamente' : 'Coming soon'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
        <ContactModal contactOpen={contactOpen} setContactOpen={setContactOpen} lang={lang} />
        </>
    );
}

function ContactModal({ contactOpen, setContactOpen, lang }) {
    const [submitted, setSubmitted] = useState(false);

    const handleClose = () => {
        setContactOpen(false);
        setTimeout(() => setSubmitted(false), 300);
    };

    return (
        <AnimatePresence>
            {contactOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

                    <AnimatePresence mode="wait">
                        {!submitted ? (
                            <motion.div
                                key="form"
                                className="relative bg-white rounded-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto p-8 md:p-10"
                                style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <button onClick={handleClose} className="absolute top-5 right-5 text-[#6B7280] hover:text-[#111827] transition-colors">
                                    <X size={24} />
                                </button>

                                <h2 className="text-[28px] font-extrabold text-[#111827] mb-1">
                                    {lang === 'es' ? 'Comenzá a escalar tu negocio' : 'Start scaling your business'}
                                </h2>
                                <p className="text-[15px] font-semibold text-[#111827] mb-6">
                                    {lang === 'es' ? 'Completá tus datos:' : 'Fill in your details:'}
                                </p>

                                <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Nombre' : 'First Name'}</label>
                                            <input type="text" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Apellidos' : 'Last Name'}</label>
                                            <input type="text" className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Número de teléfono*' : 'Phone Number*'}</label>
                                            <input type="tel" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Correo*' : 'Email*'}</label>
                                            <input type="email" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Nombre de la empresa*' : 'Company Name*'}</label>
                                            <input type="text" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Tipo de Empresa' : 'Company Type'}</label>
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                {(lang === 'es'
                                                    ? ['Desarrolladora', 'Constructora', 'Estudio de Arquitectura', 'Inmobiliaria', 'Gerenciadora de Obra', 'Otro']
                                                    : ['Developer', 'Construction Co.', 'Architecture Firm', 'Real Estate Agency', 'Project Manager', 'Other']
                                                ).map(type => (
                                                    <label key={type} className="flex items-center gap-2 text-[13px] text-[#374151] cursor-pointer">
                                                        <input type="checkbox" className="rounded border-[#D1D5DB] text-[#20316d] focus:ring-[#20316d]/20" />
                                                        {type}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[14px] text-[#374151] mb-1.5">{lang === 'es' ? 'Cómo podemos ayudarte?' : 'How can we help?'}</label>
                                        <textarea rows={3} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors resize-y" />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full text-white font-bold py-4 rounded-full text-[16px] transition-all hover:brightness-110 active:scale-[0.98]"
                                        style={{ backgroundColor: '#20316d', boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                                    >
                                        {lang === 'es' ? 'Enviar' : 'Submit'}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                className="relative bg-white rounded-2xl w-full max-w-[420px] p-10 text-center"
                                style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-8 h-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-[24px] font-extrabold text-[#111827] mb-3">
                                    {lang === 'es' ? 'Formulario enviado con éxito' : 'Form submitted successfully'}
                                </h3>
                                <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8">
                                    {lang === 'es'
                                        ? 'Nuestro equipo de ventas se estará comunicando con vos en las próximas 48 horas hábiles.'
                                        : 'Our sales team will be in touch with you within the next 48 business hours.'}
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="text-white font-bold px-8 py-3.5 rounded-full text-[15px] transition-all hover:brightness-110 active:scale-[0.98]"
                                    style={{ backgroundColor: '#20316d', boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                                >
                                    {lang === 'es' ? 'Entendido' : 'Got it'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
