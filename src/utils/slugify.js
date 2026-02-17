/**
 * Convert text to URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified text
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove special chars
    .replace(/--+/g, '-');       // Remove multiple -
};

/**
 * Convert slug back to readable text (basic deslugification)
 * @param {string} slug - Slug to convert
 * @returns {string} - Readable text
 */
export const deslugify = (slug) => {
  return slug
    .toString()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Find category by slug in a nested category tree
 * @param {Array} categories - Array of category objects
 * @param {string} slug - Slug to search for
 * @returns {Object|null} - Found category or null
 */
export const findCategoryBySlug = (categories, slug) => {
  if (!Array.isArray(categories) || !slug) return null;

  for (const category of categories) {
    const categorySlug = slugify(category.name);
    if (categorySlug === slug) {
      return category;
    }

    // Search in subcategories
    if (category.subCategories && category.subCategories.length > 0) {
      const found = findCategoryBySlug(category.subCategories, slug);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Find category by ID in a nested category tree
 * @param {Array} categories - Array of category objects
 * @param {string|number} id - ID to search for
 * @returns {Object|null} - Found category or null
 */
export const findCategoryById = (categories, id) => {
  if (!Array.isArray(categories) || !id) return null;

  for (const category of categories) {
    if (category.id.toString() === id.toString()) {
      return category;
    }

    // Search in subcategories
    if (category.subCategories && category.subCategories.length > 0) {
      const found = findCategoryById(category.subCategories, id);
      if (found) return found;
    }
  }

  return null;
};
