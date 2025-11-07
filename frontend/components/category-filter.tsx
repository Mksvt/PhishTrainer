import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    categories: string[];
}

export function CategoryFilter({
    selectedCategory,
    onCategoryChange,
    categories,
}: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <Button
                onClick={() => onCategoryChange(null)}
                variant={selectedCategory === null ? "default" : "outline"}
                className="text-xs sm:text-sm"
            >
                Всі листи
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    variant={
                        selectedCategory === category ? "default" : "outline"
                    }
                    className="text-xs sm:text-sm capitalize"
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
