import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const searchText = searchParams.get("search_text") || "";
    const minPrice = searchParams.get("min_price") || "";
    const maxPrice = searchParams.get("max_price") || "";
    const catalogId = searchParams.get("catalog_id") || "";
    const sizeId = searchParams.get("size_id") || "";
    const statusIdsRaw = searchParams.get("status_ids") || "";

    const baseAuthRes = await fetch("https://www.vinted.fr/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9"
      }
    });
    
    const setCookie = baseAuthRes.headers.get("set-cookie");
    let token = "TOKEN_DE_SECOURS";
    if (setCookie) {
      const match = setCookie.match(/access_token_web=([^;]+)/);
      if (match) token = match[1];
    }

    let targetUrl = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&order=newest_first`;
    
    if (searchText) {
      targetUrl += `&search_text=${encodeURIComponent(searchText)}`;
    }
    

    if (minPrice) {
      targetUrl += `&price_from=${minPrice}`;
    }
    if (maxPrice) {
      targetUrl += `&price_to=${maxPrice}`;
    }
    if (catalogId) {
      targetUrl += `&catalog_ids=${catalogId}`;
    }
    if (sizeId) {
      targetUrl += `&size_ids=${sizeId}`;
    }
    
    if (statusIdsRaw) {
      const statusArray = statusIdsRaw.split(",");
      statusArray.forEach(id => {
        targetUrl += `&status_ids[]=${id}`;
      });
    }

    const sessionSeed = Math.random().toString(36).substring(2, 12);
    targetUrl += `&global_search_session_id=${sessionSeed}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Cookie": `access_token_web=${token}`,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Accept": "application/json"
      }
    });

    if (!response.ok) throw new Error(`Status HTTP Vinted : ${response.status}`);
    const data = await response.json();

    return NextResponse.json({
      success: true,
      items: data.items || []
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}