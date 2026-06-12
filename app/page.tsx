"use client";

import { useState, useEffect, useRef } from "react";
import FilterForm from "@/components/FilterForm";
import ProductCard from "@/components/ProductCard";
import { FaGithub } from "react-icons/fa";

export interface FilterConfig {
  id: string;
  name: string;
  keyword: string;
  minPrice: string;
  maxPrice: string;
  catalogId: string;
  sizeId: string;
  statusIds: string[];
  discordWebhook: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  size: string;
  imageUrl: string;
  link: string;
  detectedAt: string;
  brand: string;
  status: string;
  accessibilityLabel?: string;
  spaceId: string;
  spaceName?: string;
}

export default function Dashboard() {
  const [configs, setConfigs] = useState<FilterConfig[]>([
    {
      id: "1",
      name: "Espace Nike Homme",
      keyword: "nike hommes",
      minPrice: "",
      maxPrice: "50",
      catalogId: "5",
      sizeId: "207",
      statusIds: ["6", "1", "2"],
      discordWebhook: "",
    }
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const notifiedItemsRef = useRef<Set<string>>(new Set());

  const addNewSpace = () => {
    const newId = Date.now().toString();
    const newSpace: FilterConfig = {
      id: newId,
      name: `Espace de recherche #${configs.length + 1}`,
      keyword: "",
      minPrice: "",
      maxPrice: "",
      catalogId: "",
      sizeId: "",
      statusIds: ["6", "1", "2"],
      discordWebhook: "",
    };
    setConfigs([...configs, newSpace]);
    setActiveTab(newId);
  };

  const removeSpace = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (configs.length === 1) return;
    const filtered = configs.filter(c => c.id !== idToRemove);
    setConfigs(filtered);
    if (activeTab === idToRemove) {
      setActiveTab(filtered[0].id);
    }
  };

  const updateConfig = (idToUpdate: string, updatedFields: Partial<FilterConfig>) => {
    setConfigs(configs.map(c => c.id === idToUpdate ? { ...c, ...updatedFields } : c));
  };

  useEffect(() => {
    setIsLoading(true);

    async function fetchAllSniperSpaces() {
      try {
        const promises = configs.map(async (config) => {
          if (!config.keyword && !config.catalogId) return [];

          const query = new URLSearchParams({
            search_text: config.keyword,
            min_price: config.minPrice,
            max_price: config.maxPrice,
            catalog_id: config.catalogId,
            size_id: config.sizeId,
            status_ids: config.statusIds.join(",")
          });

          const res = await fetch(`/api/session?${query.toString()}`);
          const data = await res.json();

          if (data.success && data.items) {
            const parsedProducts = data.items.map((item: any) => ({
              id: item.id.toString(),
              title: item.title,
              price: parseFloat(item.price?.amount || "0"),
              size: item.size_title || "N/A",
              imageUrl: item.photo?.url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200",
              link: item.url ? (item.url.startsWith('http') ? item.url : `https://www.vinted.fr${item.path}`) : "#",
              detectedAt: new Date().toLocaleTimeString(),
              brand: item.brand_title || "Inconnue",
              status: item.status || "Non spécifié",
              accessibilityLabel: item.item_box?.accessibility_label || "",
              spaceId: config.id,
              spaceName: config.name
            }));

          
            if (config.discordWebhook) {
              parsedProducts.forEach((product: Product) => {
                const uniqueKey = `${config.id}-${product.id}`;
                
                
                if (!notifiedItemsRef.current.has(uniqueKey)) {
                  notifiedItemsRef.current.add(uniqueKey);
                  
                 
                  fetch("/api/discord", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      webhookUrl: config.discordWebhook,
                      product: product
                    })
                  }).catch(err => console.error("Erreur d'envoi Discord:", err));
                }
              });
            }

            return parsedProducts;
          }
          return [];
        });

        const results = await Promise.all(promises);
        setProducts(results.flat());
      } catch (err) {
        console.error("Erreur Multi-Fetch :", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllSniperSpaces();
    const interval = setInterval(fetchAllSniperSpaces, 10000);
    return () => clearInterval(interval);
  }, [configs]);

  const displayedProducts = products.filter((p) => p.spaceId === activeTab);
  const currentConfig = configs.find(c => c.id === activeTab)!;

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 p-6">
      <header className="sticky top-0 z-50 py-4 bg-zinc-900 max-w-7xl mx-auto mb-6 border-b border-gray-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-700">Vinted test</h1>
        </div>

        <div className="flex flex-row justify-center items-center gap-4">
          <a href="https://github.com/Den1sMd/">
            <FaGithub className="w-8 h-8 cursor-pointer hover:mb-1 hover:rotate-5 transition-all duration-200"></FaGithub>
          </a>
        <button
          onClick={addNewSpace}
          className="cursor-pointer bg-red-700 hover:bg-white hover:text-black text-white duration-200 font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
        >
          <span>Ajouter un autre filtre +</span>
        </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-2 border-b border-gray-800 pb-2">
        {configs.map((config) => (
          <button
            key={config.id}
            onClick={() => setActiveTab(config.id)}
            className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-lg transition-all flex items-center gap-3  ${
              activeTab === config.id
                ? "bg-red-800 text-white"
                : "bg-gray-800 text-gray-400 border-transparent hover:bg-gray-700/50"
            }`}
          >
            <span>{config.name}</span>
            {configs.length > 1 && (
              <span 
                onClick={(e) => removeSpace(config.id, e)}
                className="cursor-pointer text-gray-500 hover:text-white font-bold text-xs p-0.5 rounded"
              >
                ✕
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterForm 
            key={activeTab} 
            initialConfig={currentConfig}
            onFilterChange={(updatedFields) => updateConfig(activeTab, updatedFields)} 
          />
        </div>

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">
              Résultats pour : <span className="text-red-400">{currentConfig.name}</span>
            </h2>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading && displayedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm">Chargement du nouveau flux...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-12 border border-dashed border-gray-800 rounded-xl">
                Aucun article trouvé. Modifie ou sauvegarde les filtres pour rafraîchir.
              </p>
            ) : (
              displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}