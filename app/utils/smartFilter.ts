export interface Category {
  id: string | number;
  name: string;
  keywords?: string[];
  [key: string]: any;
}

interface SearchResult {
  category: Category;
  score: number;
}

/**
 * Searches the enhanced category list for matches based on three criteria.
 * @param {string} query - The user's search query.
 * @param {Array<Object>} categories - The array of category objects.
 * @returns {Array<Object>} The matching categories, sorted by relevance.
 */
export function smartCategorySearch(query: string, categories: Category[]): Category[] {
  if (!query) return [];

  const lowerQuery = query.trim().toLowerCase();
  const resultsMap = new Map<string | number, SearchResult>(); // Use a Map to store unique categories and their score

  // 1. Exact Match on Category Name (Highest Score)
  categories.forEach((category) => {
    if (category.name.toLowerCase() === lowerQuery) {
      // Perfect match, assign max score
      resultsMap.set(category.id, { category: category, score: 3 });
    }
  });

  // 2. Starts With Match on Category Name (Medium Score)
  categories.forEach((category) => {
    if (
      category.name.toLowerCase().startsWith(lowerQuery) &&
      !resultsMap.has(category.id)
    ) {
      resultsMap.set(category.id, { category: category, score: 2 });
    }
  });

  // 3. Keyword / Synonym Match (Standard Score)
  categories.forEach((category) => {
    if (category.keywords && !resultsMap.has(category.id)) {
      const isKeywordMatch = category.keywords.some((keyword: string) =>
        keyword.toLowerCase().includes(lowerQuery)
      );

      if (isKeywordMatch) {
        resultsMap.set(category.id, { category: category, score: 1 });
      }
    }
  });

  // 4. Substring Match on Category Name (Lowest Score)
  categories.forEach((category) => {
    if (
      category.name.toLowerCase().includes(lowerQuery) &&
      !resultsMap.has(category.id)
    ) {
      resultsMap.set(category.id, { category: category, score: 0 });
    }
  });

  // Convert map values to array, sort by score (descending), and return only the category objects
  const sortedResults = Array.from(resultsMap.values())
    .sort((a, b) => b.score - a.score)
    .map((item) => item.category);

  return sortedResults;
}
