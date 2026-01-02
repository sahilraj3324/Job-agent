// Types aligned with Backend API responses

export interface Job {
  id: string;
  title: string; // Maps from `role` in API
  company: string; // Maps from `companyName` in API
  location: string;
  type: string; // Derived (Remote/Hybrid/Onsite based on location)
  salary: string; // May be empty from API
  postedAt: string;
  description: string;
  requirements: string[];
  logo: string; // Generated placeholder
  tags: string[]; // Maps from `skills` in API
  applyUrl: string;
  source: 'Company Website' | 'Google Jobs';
  experience: string; // Derived from minExperience/maxExperience
}

export interface FilterState {
  role: string;
  location: string;
  type: string;
}
