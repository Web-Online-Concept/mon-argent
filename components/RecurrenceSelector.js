import useRecurrenceStore from '../lib/store/recurrenceStore';

export default function RecurrenceSelector({ value, onChange, type }) {
  const { recurrences } = useRecurrenceStore();
  
  // Filtrer les récurrences par type
  const filteredRecurrences = recurrences.filter(r => r.type === type);

  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Récurrence (optionnel)
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg"
      >
        <option value="">Aucune récurrence</option>
        {filteredRecurrences.map(recurrence => (
          <option key={recurrence.id} value={recurrence.id}>
            {recurrence.name} - {recurrence.frequency === 'monthly' ? 'Mensuel' : 
             recurrence.frequency === 'weekly' ? 'Hebdomadaire' : 
             recurrence.frequency === 'daily' ? 'Quotidien' : 'Annuel'}
          </option>
        ))}
      </select>
    </div>
  );
}