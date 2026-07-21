import { useLanguage } from "@/contexts/language";

export default function Artist() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto bg-card border border-white/10 rounded-3xl p-10 shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-6">{t.navArtist}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{t.errorArtist}</p>
      </div>
    </div>
  );
}
