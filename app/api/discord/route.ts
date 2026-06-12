import { NextRequest, NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookUrl } = body;
    
    // RECOUVREMENT INTELLIGENT : On accepte "products" OU "product" mis dans un tableau
    let productsList = [];
    if (body.products && Array.isArray(body.products)) {
      productsList = body.products;
    } else if (body.product) {
      productsList = [body.product];
    }

    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: "URL Webhook manquante" }, { status: 400 });
    }

    if (productsList.length === 0) {
      return NextResponse.json({ success: true, message: "Aucun produit à envoyer" });
    }

    // Le reste du code (le découpage en chunks, la boucle for, etc.) reste strictement le même
    // Remplace juste la variable "products" par "productsList" dans ton découpage en chunks :
    const chunks = [];
    for (let i = 0; i < productsList.length; i += 10) {
      chunks.push(productsList.slice(i, i + 10));
    }


    for (const chunk of chunks) {
      // On construit les embeds pour ce paquet
      const embeds = chunk.map((product: any) => ({
        title: `👕 ${product.title}`,
        url: product.link,
        color: 1671190, // Vert Émeraude
        fields: [
          { name: "💰 Prix", value: `**${product.price.toFixed(2)} €**`, inline: true },
          { name: "📏 Taille", value: product.size, inline: true },
          { name: "🏷️ Marque", value: product.brand, inline: true },
          { name: "✨ État", value: product.status, inline: true },
          { name: "🎯 Flux", value: product.spaceName || "Filtre Sniper", inline: true }
        ],
        image: { url: product.imageUrl },
        footer: { text: `Détecté à ${product.detectedAt} • Multi-Sniper` }
      }));

      const discordPayload = {
        username: "Vinted Multi-Sniper",
        avatar_url: "https://www.vinted.fr/assets/favicon/favicon-32x32.png",
        embeds: embeds
      };

      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload)
      });

      
      if (response.status === 429) {
        const retryAfterData = await response.json();
        const waitTime = (retryAfterData.retry_after || 1) * 1000;
        console.warn(`[Discord Rate Limit] Pause forcée de ${waitTime}ms`);
        await delay(waitTime);
        
     
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload)
        });
      }

      
      await delay(250);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur Webhook Discord :", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}