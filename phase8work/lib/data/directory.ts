import { AlumniProfile, DirectoryFilters } from '@/types';

export function getDirectoryOptions(profiles: AlumniProfile[]) {
  const unique = (items: string[]) => Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));

  return {
    gradYears: unique(profiles.map((profile) => profile.gradYear)),
    industries: unique(profiles.map((profile) => profile.industry)),
    locations: unique(profiles.map((profile) => profile.location)),
    majors: unique(profiles.map((profile) => profile.major).filter(Boolean) as string[])
  };
}

export function filterAlumniProfiles(profiles: AlumniProfile[], filters: DirectoryFilters) {
  const search = filters.search.trim().toLowerCase();

  return profiles.filter((profile) => {
    const matchesSearch =
      !search ||
      [profile.name, profile.company, profile.title, profile.industry, profile.location, profile.major ?? '', profile.bio]
        .join(' ')
        .toLowerCase()
        .includes(search);

    const matchesGradYear = !filters.gradYear || profile.gradYear === filters.gradYear;
    const matchesIndustry = !filters.industry || profile.industry === filters.industry;
    const matchesLocation = !filters.location || profile.location === filters.location;
    const matchesMajor = !filters.major || profile.major === filters.major;
    const matchesMentor = !filters.mentorOnly || profile.mentor;

    return matchesSearch && matchesGradYear && matchesIndustry && matchesLocation && matchesMajor && matchesMentor;
  });
}
