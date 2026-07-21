import { ReactNode } from "react";
import { useLanguage, Language } from "@/contexts/language";

const FLAG: Record<Language, string> = { ar: "AR", en: "EN", it: "IT" };
const LANGS: Language[] = ["ar", "en", "it"];

export function Layout({ children }: { children: ReactNode }) {
  const location = typeof window !== "undefined" ? window.location.pathname : "/";
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.navGallery },
    { href: "/artist", label: t.navArtist },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          <a href="/" className="text-2xl font-bold tracking-wider text-primary font-sans" dir="ltr">
            Before the Wings
          </a>

          <nav className="flex items-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm md:text-base font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* رابط الأدمن — خفي */}
            <a
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.startsWith("/admin") ? "text-primary" : "text-muted-foreground/30"
              }`}
            >
              {t.navAdmin}
            </a>

            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-black/20">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-widest transition-all duration-200 ${
                    lang === l
                      ? "bg-primary text-black"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {FLAG[l]}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p dir="ltr">Before the Wings &copy; {new Date().getFullYear()}. {t.footerRights}</p>
        </div>
      </footer>
    </div>
  );
}