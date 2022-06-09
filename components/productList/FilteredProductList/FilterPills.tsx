import { Chip } from "@saleor/ui-kit";

export interface FilterPill {
  label: string;
  choiceSlug: string;
  attributeSlug: string;
}

export interface FilterPillsProps {
  pills: FilterPill[];
  onRemoveAttribute: (attributeSlug: string, choiceSlug: string) => void;
  onClearFilters: () => void;
}

export function FilterPills({ pills, onRemoveAttribute, onClearFilters }: FilterPillsProps) {
  return (
    <div className="flex pt-4">
      <div className="flex-grow flex gap-2">
        {typeof window !== "undefined" &&
          pills.map(({ label, attributeSlug, choiceSlug }) => (
            <Chip
              key={`${attributeSlug}-${choiceSlug}`}
              label={label}
              onClick={() => {
                onRemoveAttribute(attributeSlug, choiceSlug);
              }}
            />
          ))}
      </div>
      <div>
        <button onClick={onClearFilters} className="text-main-2 text-base" type="button">
          Clear all
        </button>
      </div>
    </div>
  );
}

export default FilterPills;
