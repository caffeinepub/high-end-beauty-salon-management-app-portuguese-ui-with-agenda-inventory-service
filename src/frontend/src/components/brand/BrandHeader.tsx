export function BrandHeader() {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/salon-monogram.dim_512x512.png" 
              alt="Logo" 
              className="h-12 w-12 object-contain"
            />
            <img 
              src="/assets/generated/salon-wordmark.dim_1200x300.png" 
              alt="Salão de Beleza" 
              className="h-8 object-contain hidden sm:block"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Gestão Premium
          </div>
        </div>
      </div>
    </header>
  );
}
