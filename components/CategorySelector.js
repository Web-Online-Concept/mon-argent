import useCategoryStore from '../lib/store/categoryStore';

export default function CategorySelector({ value, onChange, type }) {
  const { categories } = useCategoryStore();
  
  // Filtrer les catégories par type
  const filteredCategories = categories.filter(cat => cat.type === type);

  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Catégorie
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg"
        required
      >
        <option value="">Sélectionner une catégorie</option>
        {filteredCategories.map(category => (
          <option key={category.id} value={category.id}>
            {category.icon} {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}