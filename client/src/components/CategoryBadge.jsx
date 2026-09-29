import React from 'react';
import { Plane, Hotel, Utensils, Car, Tag } from 'lucide-react';
import { getCategoryMeta } from '../utils/formatters';

const getCategoryIcon = (category, className = 'w-3.5 h-3.5') => {
  switch (category) {
    case 'Flight':
      return <Plane className={className} />;
    case 'Lodging':
      return <Hotel className={className} />;
    case 'Meals':
      return <Utensils className={className} />;
    case 'Transit':
      return <Car className={className} />;
    case 'Other':
    default:
      return <Tag className={className} />;
  }
};

const CategoryBadge = ({ category, showIcon = true, size = 'sm' }) => {
  const meta = getCategoryMeta(category);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${meta.color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {showIcon && getCategoryIcon(category, size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')}
      {meta.label}
    </span>
  );
};

export { getCategoryIcon };
export default CategoryBadge;
