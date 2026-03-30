import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext({ lang: 'es', setLang: () => {} });

export function LangProvider({ children }) {
    const [lang, setLangState] = useState(() => {
        try { return localStorage.getItem('arqy-lang') || 'es'; }
        catch { return 'es'; }
    });

    const setLang = (l) => {
        setLangState(l);
        try { localStorage.setItem('arqy-lang', l); } catch {}
    };

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
