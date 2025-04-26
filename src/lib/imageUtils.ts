// Fonction pour formater l'URL de l'image selon la documentation TCGdex
export const formatImageUrl = (
    imageUrl: string,
    quality: "high" | "low" = "high",
    extension: "webp" | "png" | "jpg" = "webp"
): string => {
    if (!imageUrl)
        return "https://via.placeholder.com/245x342?text=Image+non+disponible";

    // Si l'URL est déjà complète avec qualité et extension, la retourner telle quelle
    if (imageUrl.includes(`.${extension}`)) return imageUrl;

    // Supprimer l'extension et qualité si elles existent déjà
    const baseUrl = imageUrl.replace(/\/(high|low)\.(webp|png|jpg)$/, "");

    // Si l'URL ne commence pas par http, ajouter le domaine de base
    const fullBaseUrl = baseUrl.startsWith("http")
        ? baseUrl
        : `https://assets.tcgdex.net${baseUrl}`;

    // Retourner l'URL formatée avec qualité et extension
    return `${fullBaseUrl}/${quality}.${extension}`;
};

// Fonction pour formater l'URL du symbole/logo du set
export const formatSymbolUrl = (
    symbolUrl: string,
    extension: "webp" | "png" | "jpg" = "webp"
): string => {
    if (!symbolUrl) return "";

    // Si l'URL est déjà complète avec extension, la retourner telle quelle
    if (symbolUrl.includes(`.${extension}`)) return symbolUrl;

    // Supprimer l'extension si elle existe déjà
    const baseUrl = symbolUrl.replace(/\.(webp|png|jpg)$/, "");

    // Si l'URL ne commence pas par http, ajouter le domaine de base
    const fullBaseUrl = baseUrl.startsWith("http")
        ? baseUrl
        : `https://assets.tcgdex.net${baseUrl}`;

    // Retourner l'URL formatée avec extension
    return `${fullBaseUrl}.${extension}`;
}; 