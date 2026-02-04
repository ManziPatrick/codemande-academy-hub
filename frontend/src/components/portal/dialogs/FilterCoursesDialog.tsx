import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "@/lib/graphql/queries";

export interface CourseFilters {
  categories: string[];
  level: string;
  duration: string;
  rating: number;
  priceRange: string;
}

interface FilterCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CourseFilters;
  onApplyFilters: (filters: CourseFilters) => void;
}

const DEFAULT_CATEGORIES = [
  "Development",
  "Data",
  "IoT",
  "Security",
  "Design",
  "Cloud",
  "AI",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const durations = ["Any Duration", "Under 1 month", "1-3 months", "3-6 months", "6+ months"];
const priceRanges = ["Any Price", "Free", "Under 50,000 RWF", "50,000-100,000 RWF", "100,000+ RWF"];

export function FilterCoursesDialog({ 
  open, 
  onOpenChange, 
  filters, 
  onApplyFilters 
}: FilterCoursesDialogProps) {
  const { data: catData } = useQuery(GET_CATEGORIES);
  const categoriesList = (catData as any)?.categories?.length ? (catData as any).categories : DEFAULT_CATEGORIES;

  const [localFilters, setLocalFilters] = useState<CourseFilters>(filters);

  const handleCategoryToggle = (category: string) => {
    const updated = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    setLocalFilters({ ...localFilters, categories: updated });
  };

  const handleReset = () => {
    setLocalFilters({
      categories: [],
      level: "All Levels",
      duration: "Any Duration",
      rating: 0,
      priceRange: "Any Price",
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    toast.success("Filters applied!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent" />
            Filter Courses
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6 custom-scrollbar">
          <div className="space-y-6 py-4">
            {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {categoriesList.map((category: string) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={localFilters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Level</Label>
            <Select
              value={localFilters.level}
              onValueChange={(value) => setLocalFilters({ ...localFilters, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Duration</Label>
            <Select
              value={localFilters.duration}
              onValueChange={(value) => setLocalFilters({ ...localFilters, duration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Minimum Rating: {localFilters.rating > 0 ? `${localFilters.rating}+` : "Any"}
            </Label>
            <Slider
              value={[localFilters.rating]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, rating: value })}
              max={5}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Price Range</Label>
            <Select
              value={localFilters.priceRange}
              onValueChange={(value) => setLocalFilters({ ...localFilters, priceRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((price) => (
                  <SelectItem key={price} value={price}>
                    {price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
