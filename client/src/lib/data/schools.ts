// School data loader for autocomplete
import schoolsData from '../../schools_by_education.json';

export interface SchoolSuggestion {
  id: string;
  name: string;
  category: string;
}

export interface SchoolsData {
  required: boolean;
  validationMessage: string;
  options: string[];
  categories: Record<string, string[]>;
}

export class SchoolDataLoader {
  private data: SchoolsData;

  constructor() {
    this.data = schoolsData as SchoolsData;
  }

  getEducationOptions(): string[] {
    return this.data.options;
  }

  searchSchools(query: string, selectedEducation?: string): SchoolSuggestion[] {
    if (!query || query.trim().length < 1) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const suggestions: SchoolSuggestion[] = [];

    // If education type is selected, search within that category
    if (selectedEducation && this.data.categories[selectedEducation]) {
      const schools = this.data.categories[selectedEducation];
      schools.forEach((school, index) => {
        if (school.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            id: `${selectedEducation}-${index}`,
            name: school,
            category: selectedEducation,
          });
        }
      });
    } else {
      // Search across all categories
      Object.entries(this.data.categories).forEach(([category, schools]) => {
        schools.forEach((school, index) => {
          if (school.toLowerCase().includes(searchTerm)) {
            suggestions.push({
              id: `${category}-${index}`,
              name: school,
              category: category,
            });
          }
        });
      });
    }

    // Limit results to 20 for performance
    return suggestions.slice(0, 20);
  }

  getSchoolsByEducation(education: string): string[] {
    return this.data.categories[education] || [];
  }
}

export const schoolDataLoader = new SchoolDataLoader();