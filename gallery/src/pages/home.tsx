import { useListPaintings, type Painting } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language";

export default function Home() {
  const { data: paintings, isLoading, error } = useListPaintings();
  const paintingsList = paintings ?? ([] as Painting[]);
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">

      {/* Hero */}
      <section className="w-full py-32 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.08)_0%,transparent_70%)] pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 drop-shadow-lg tracking-wide font-sans" dir="ltr">
          Before the Wings
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
          {t.heroQuote}
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 md:px-8 pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-primary">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p>{t.loadingGallery}</p>
          </div>
        ) : error ? (
          <div className="text-center py-32 text-destructive">
            <p>{t.errorPaintings}</p>
          </div>
        ) : !paintings || paintings.length === 0 ? (
          <div className="text-center py-32 text-muted-foreground border border-white/5 rounded-lg bg-white/5">
            <p className="text-xl">{t.emptyGallery}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
            {paintingsList
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((painting, index) => (
                <div
                  key={painting.id}
                  className="flex flex-col items-center group animate-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Frame */}
                  <div className="painting-frame w-full max-w-md aspect-[4/5] flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10 pointer-events-none" />
                    <img
                      src={painting.imageUrl}
                      alt={painting.title}
                      className="painting-canvas w-full h-full object-cover relative z-0"
                      loading="lazy"
                    />
                    {/* Spotlight on hover */}
                    <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-primary/20 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Plaque */}
                  <div className="bg-card border border-primary/20 px-8 py-4 text-center shadow-lg w-[80%] max-w-sm relative">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-primary/40 rounded-full blur-[2px]" />
                    <h3 className="text-xl font-bold text-foreground mb-2">{painting.title}</h3>
                    {painting.medium && painting.year && (
                      <p className="text-sm text-primary/80 mb-2 font-medium">
                        {painting.medium}، {painting.year}
                      </p>
                    )}
                    {painting.dimensions && (
                      <p className="text-xs text-muted-foreground mb-3">{painting.dimensions}</p>
                    )}
                    {painting.description && (
                      <p className="text-sm text-muted-foreground/80 leading-relaxed border-t border-primary/10 pt-3 mt-2">
                        {painting.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}