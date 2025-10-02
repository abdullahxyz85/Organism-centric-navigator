import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FilterPanelProps {
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
}

export function FilterPanel({ selectedConditions, onConditionsChange }: FilterPanelProps) {
  const [availableConditions, setAvailableConditions] = useState<string[]>([]);

  useEffect(() => {
    loadConditions();
  }, []);

  const loadConditions = async () => {
    const { data } = await supabase
      .from('conditions')
      .select('name')
      .order('name');

    if (data) {
      setAvailableConditions(data.map(c => c.name));
    }
  };

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter(c => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Filter by Conditions</h3>
        {selectedConditions.length > 0 && (
          <button
            onClick={() => onConditionsChange([])}
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        {availableConditions.length === 0 ? (
          <p className="text-sm text-gray-400">No conditions available</p>
        ) : (
          availableConditions.map((condition) => {
            const isSelected = selectedConditions.includes(condition);
            return (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{condition}</span>
                  {isSelected && <X className="w-4 h-4" />}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
