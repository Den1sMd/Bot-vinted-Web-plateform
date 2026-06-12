"use client";

import { useState, useEffect } from "react";
import { VINTED_CATEGORIES, VINTED_SIZES, VINTED_STATUS, CATEGORY_GROUPS } from "@/src/constants/vintedMapping";
import { FilterConfig } from "@/app/page";

interface FilterFormProps {
  initialConfig: FilterConfig;
  onFilterChange: (filters: {
    name: string;
    keyword: string;
    minPrice: string;
    maxPrice: string;
    catalogId: string;
    sizeId: string;
    statusIds: string[];
    discordWebhook: string;
  }) => void;
}

export default function FilterForm({ initialConfig, onFilterChange }: FilterFormProps) {
  const [name, setName] = useState(initialConfig.name);
  const [keyword, setKeyword] = useState(initialConfig.keyword);
  const [minPrice, setMinPrice] = useState(initialConfig.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialConfig.maxPrice);
  const [catalogId, setCatalogId] = useState(initialConfig.catalogId);
  const [sizeId, setSizeId] = useState(initialConfig.sizeId);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(initialConfig.statusIds);
  const [discordWebhook, setDiscordWebhook] = useState(initialConfig.discordWebhook); // Ajouté

  const [availableSizes, setAvailableSizes] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!catalogId) {
      setAvailableSizes([...VINTED_SIZES.clothes_adult, ...VINTED_SIZES.shoes_men]);
      return;
    }

    switch (catalogId) {
      case "83":
      case "91":
        setAvailableSizes(VINTED_SIZES.shoes_men);
        break; 
      case "15":
      case "1242":
        setAvailableSizes(VINTED_SIZES.shoes_women);
        break;
      case "81":
        setAvailableSizes(VINTED_SIZES.jeans_men);
        break;
      case "1193":
      case "1195":
      case "1200":
      case "1233":
        setAvailableSizes(VINTED_SIZES.kids_clothes);
        break;
      default:
        setAvailableSizes(VINTED_SIZES.clothes_adult);
        break;
    }
  }, [catalogId]);

  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(prev => 
      prev.includes(statusId) ? prev.filter(id => id !== statusId) : [...prev, statusId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      name: name || "Espace sans nom",
      keyword,
      minPrice,
      maxPrice,
      catalogId,
      sizeId,
      statusIds: selectedStatus,
      discordWebhook // Ajouté
    });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg space-y-5 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="border-b border-gray-700 pb-2">
        <h3 className="text-base font-semibold text-white">Éditeur de Filtres</h3>
        <p className="text-gray-400 text-xs mt-0.5">Personnalise l'espace de détection ciblé</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Identification Espace</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: T-shirts Vintage XL..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mot-clé de Recherche</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Ex: Stussy, Carhartt Detroit..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Catégorie Spécifique</label>
          <select
            value={catalogId}
            onChange={(e) => setCatalogId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          >
            {CATEGORY_GROUPS.map(group => (
              <optgroup key={group} label={group} className="bg-gray-900 text-red-400 font-semibold">
                {VINTED_CATEGORIES.filter(cat => cat.group === group).map(cat => (
                  <option key={cat.id} value={cat.id} className="text-white font-normal">
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Taille / Dimensionnement</label>
          <select
            value={sizeId}
            onChange={(e) => setSizeId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
          >
            <option value="">Toutes les tailles</option>
            {availableSizes.map(size => (
              <option key={size.id} value={size.id}>{size.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tranche de Prix (€)</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">État de conservation minimal</label>
          <div className="grid grid-cols-1 gap-1.5 bg-gray-900 p-3 rounded-lg border border-gray-700">
            {VINTED_STATUS.map(status => (
              <label key={status.id} className="flex items-center space-x-2.5 text-xs text-gray-300 cursor-pointer hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status.id)}
                  onChange={() => handleStatusChange(status.id)}
                  className="rounded bg-gray-800 border-gray-700 text-red-500 focus:ring-0 w-4 h-4 transition-all"
                />
                <span>{status.name}</span>
              </label>
            ))}
          </div>
        </div>

        
        <div className="border-t border-gray-700/60 pt-3">
          <label className="block text-xs font-bold text-indigo-400 uppercase mb-1 flex items-center gap-1.5">
            <span>🔗</span> Webhook Discord (Optionnel)
          </label>
          <input
            type="url"
            value={discordWebhook}
            onChange={(e) => setDiscordWebhook(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            className="w-full bg-gray-900 border border-gray-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none placeholder-gray-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 cursor-pointer hover:bg-white hover:text-black text-white font-bold py-2.5 rounded-lg text-sm shadow-md transition-all active:scale-98"
        >
          Appliquer & Sauvegarder
        </button>
      </form>
    </div>
  );
}