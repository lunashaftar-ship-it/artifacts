import { Link } from "wouter";
import { useLanguage } from "@/contexts/language";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-32 text-center px-4">
      <p className="text-8xl font-bold text-primary/20 mb-6">404</p>
      <h1 className="text-2xl font-bold text-foreground mb-8">{t.notFound}</h1>
      <Link href="/" className="px-6 py-3 rounded-md bg-primary text-black font-semibold hover:bg-primary/90 transition-colors">
        {t.backHome}
      </Link>
    </div>
  );
}