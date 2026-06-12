import { Product } from "@/app/page";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-zinc-600 transition-all shadow-lg group flex flex-col justify-between">
      <div>
        <div className="relative h-48 bg-gray-950 flex items-center justify-center">
          
          <img
            src={product.imageUrl}
            alt={product.title}
            className="object-cover h-full w-full group-hover:scale-102 transition-transform duration-200"
          />
          <span className="absolute top-2 left-2 bg-red-600 text-white font-bold px-2 py-0.5 rounded text-xs uppercase shadow">
            {product.brand}
          </span>
          <span className="absolute bottom-2 left-2 bg-gray-900/90 backdrop-blur-sm text-white font-extrabold px-2 py-1 rounded text-sm border border-gray-700">
            {product.price.toFixed(2)} €
          </span>
          <span className="absolute bottom-2 right-2 bg-gray-900/90 backdrop-blur-sm text-gray-300 px-2 py-1 rounded text-xs border border-gray-700">
            Taille : {product.size}
          </span>
        </div>

        <div className="p-4 space-y-2">
          <h4 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
            {product.title}
          </h4>
          
          <div className="flex gap-2">
            <span className="bg-gray-700 text-gray-300 text-[11px] px-2 py-0.5 rounded">
              {product.status}
            </span>
          </div>

        
          {product.accessibilityLabel && (
            <p className="text-gray-400 text-xs line-clamp-2 bg-gray-900/40 p-2 rounded border border-gray-800">
              {product.accessibilityLabel}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-gray-800/60 mt-2 flex justify-between items-center">
        <span className="text-gray-500 text-[10px]">Mis à jour : {product.detectedAt}</span>
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow"
        >
          Lien direct
        </a>
      </div>
    </div>
  );
}