import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLang } from '../LangContext.jsx';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';

const PRIMARY = '#20316d';

const T = {
    es: {
        hero: {
            chip: 'Contáctanos',
            title: 'Habla con un experto en tecnología para la construcción',
            desc: '¿Preguntas? ¿Comentarios? Queremos escucharlo todo. Ponte en contacto hoy y un miembro de nuestro equipo se contactará rápidamente con vos.',
        },
        form: {
            heading: 'Comunicate con nosotros',
            department: 'Seleccionar Departamento*',
            departmentPlaceholder: 'Seleccionar Departamento...',
            departments: ['Ventas', 'Soporte', 'Partnerships', 'Prensa'],
            firstName: 'Nombre*',
            lastName: 'Apellido*',
            email: 'Correo Electrónico*',
            phone: 'Número de teléfono*',
            company: 'Empresa*',
            companyType: 'Tipo de Compañía*',
            companyTypePlaceholder: 'Seleccionar...',
            companyTypes: ['Desarrolladora', 'Constructora', 'Estudio de Arquitectura', 'Inmobiliaria', 'Gerenciadora de Obra', 'Otro'],
            comments: 'Comentarios / Preguntas',
            privacy: 'Arqy utiliza la información que nos proporciona para contactarlo con información relevante del producto, las últimas noticias y materiales promocionales. Su información se procesará de acuerdo con nuestro aviso de privacidad y puede darse de baja en cualquier momento.',
            submit: 'Enviar',
            legal: 'Al hacer clic en este botón, aceptas nuestro',
            privacyLink: 'Aviso de privacidad',
            and: 'y nuestros',
            termsLink: 'Términos de servicio',
        },
        help: {
            title: '¿Cómo podemos ayudar?',
            desc: 'Estamos aquí para ayudar en todo, desde preguntas hasta comentarios y manifestaciones de interés en una nueva herramienta.',
            contact: 'Ponte en contacto con nuestro equipo de atención al cliente de primera clase.',
        },
        success: {
            title: 'Formulario enviado con éxito',
            desc: 'Nuestro equipo se estará comunicando con vos en las próximas 48 horas hábiles.',
            button: 'Entendido',
        },
    },
    en: {
        hero: {
            chip: 'Contact Us',
            title: 'Talk to a construction technology expert',
            desc: 'Questions? Comments? We want to hear it all. Get in touch today and a member of our team will get back to you quickly.',
        },
        form: {
            heading: 'Get in touch',
            department: 'Select Department*',
            departmentPlaceholder: 'Select Department...',
            departments: ['Sales', 'Support', 'Partnerships', 'Press'],
            firstName: 'First Name*',
            lastName: 'Last Name*',
            email: 'Email*',
            phone: 'Phone Number*',
            company: 'Company*',
            companyType: 'Company Type*',
            companyTypePlaceholder: 'Select...',
            companyTypes: ['Developer', 'Construction Co.', 'Architecture Firm', 'Real Estate Agency', 'Project Manager', 'Other'],
            comments: 'Comments / Questions',
            privacy: 'Arqy uses the information you provide to contact you with relevant product information, latest news and promotional materials. Your information will be processed in accordance with our privacy notice and you can unsubscribe at any time.',
            submit: 'Submit',
            legal: 'By clicking this button, you accept our',
            privacyLink: 'Privacy Notice',
            and: 'and our',
            termsLink: 'Terms of Service',
        },
        help: {
            title: 'How can we help?',
            desc: 'We\'re here to help with everything, from questions to feedback and expressions of interest in a new tool.',
            contact: 'Get in touch with our world-class customer support team.',
        },
        success: {
            title: 'Form submitted successfully',
            desc: 'Our team will be in touch with you within the next 48 business hours.',
            button: 'Got it',
        },
    },
};

export default function ContactPage() {
    const { lang, setLang } = useLang();
    const [submitted, setSubmitted] = useState(false);
    const t = T[lang] || T.es;

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">
            <SharedNavbar lang={lang} setLang={setLang} />

            {/* Hero */}
            <section className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/Contact_Hero.webp"
                        alt="Contact"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(15,20,45,0.82) 50%, rgba(15,20,45,0.3) 100%)' }} />
                <div className="relative z-20 w-full pt-[76px]">
                    <div className="max-w-[1400px] mx-auto px-[16px] md:px-[28px]">
                        <div className="max-w-[680px]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-6"
                            >
                                <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                                <span className="text-white text-[13px] font-semibold tracking-wide">{t.hero.chip}</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.12 }}
                                className="text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[62px] font-extrabold leading-[1.12] mb-5"
                            >
                                {t.hero.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.26 }}
                                className="text-white/80 text-[17px] leading-relaxed max-w-[460px]"
                            >
                                {t.hero.desc}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        {/* Left - Text */}
                        <div className="lg:w-[40%]">
                            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#111827] leading-tight mb-6">
                                {t.help.title}
                            </h2>
                            <p className="text-[16px] text-[#6B7280] leading-relaxed mb-6">
                                {t.help.desc}
                            </p>
                            <p className="text-[16px] text-[#111827] font-semibold leading-relaxed">
                                {t.help.contact}
                            </p>
                        </div>

                        {/* Right - Form */}
                        <div className="lg:w-[60%]">
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-[#F9FAFB] rounded-2xl p-8 md:p-10 border border-[#E5E7EB]"
                                    >
                                        <h3 className="text-[24px] font-extrabold text-[#111827] mb-6">{t.form.heading}</h3>

                                        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                                            {/* Department */}
                                            <div>
                                                <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.department}</label>
                                                <select required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors bg-white text-[#6B7280]">
                                                    <option value="">{t.form.departmentPlaceholder}</option>
                                                    {t.form.departments.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>

                                            {/* Name */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.firstName}</label>
                                                    <input type="text" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.lastName}</label>
                                                    <input type="text" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                                </div>
                                            </div>

                                            {/* Email & Phone */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.email}</label>
                                                    <input type="email" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.phone}</label>
                                                    <input type="tel" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                                </div>
                                            </div>

                                            {/* Company & Type */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.company}</label>
                                                    <input type="text" required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.companyType}</label>
                                                    <select required className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors bg-white text-[#6B7280]">
                                                        <option value="">{t.form.companyTypePlaceholder}</option>
                                                        {t.form.companyTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Comments */}
                                            <div>
                                                <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">{t.form.comments}</label>
                                                <textarea rows={4} className="w-full border border-[#D1D5DB] rounded-lg px-4 py-3 text-[15px] outline-none focus:border-[#20316d] focus:ring-1 focus:ring-[#20316d]/20 transition-colors resize-y bg-white" />
                                            </div>

                                            {/* Privacy text */}
                                            <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
                                                {t.form.privacy}
                                            </p>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                className="w-full text-white font-bold py-4 rounded-full text-[16px] transition-all hover:brightness-110 active:scale-[0.98]"
                                                style={{ backgroundColor: PRIMARY, boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                                            >
                                                {t.form.submit}
                                            </button>

                                            {/* Legal */}
                                            <p className="text-[11px] text-[#9CA3AF] text-center">
                                                {t.form.legal}{' '}
                                                <a href="#" className="underline hover:text-[#6B7280]">{t.form.privacyLink}</a>{' '}
                                                {t.form.and}{' '}
                                                <a href="#" className="underline hover:text-[#6B7280]">{t.form.termsLink}</a>.
                                            </p>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-[#F9FAFB] rounded-2xl p-10 md:p-14 border border-[#E5E7EB] text-center"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5">
                                            <CheckCircle2 size={32} className="text-[#22C55E]" />
                                        </div>
                                        <h3 className="text-[24px] font-extrabold text-[#111827] mb-3">{t.success.title}</h3>
                                        <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8">{t.success.desc}</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="text-white font-bold px-8 py-3.5 rounded-full text-[15px] transition-all hover:brightness-110 active:scale-[0.98]"
                                            style={{ backgroundColor: PRIMARY, boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                                        >
                                            {t.success.button}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            <SharedFooter lang={lang} />
        </div>
    );
}
