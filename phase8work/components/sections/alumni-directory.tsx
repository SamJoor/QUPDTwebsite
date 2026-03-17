'use client';

import { useMemo, useState } from 'react';
import { AlumniProfile, DirectoryFilters } from '@/types';
import { ProfileCard } from '@/components/cards/profile-card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { filterAlumniProfiles, getDirectoryOptions } from '@/lib/data/directory';

const defaultFilters: DirectoryFilters = {
  search: '',
  gradYear: '',
  industry: '',
  location: '',
  major: '',
  mentorOnly: false
};

export function AlumniDirectory({ profiles }: { profiles: AlumniProfile[] }) {
  const [filters, setFilters] = useState<DirectoryFilters>(defaultFilters);
  const options = useMemo(() => getDirectoryOptions(profiles), [profiles]);
  const filtered = useMemo(() => filterAlumniProfiles(profiles, filters), [profiles, filters]);

  return (
    <div className="space-y-8">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Input
            placeholder="Search name, company, industry…"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="xl:col-span-2"
          />
          <Select value={filters.gradYear} onChange={(event) => setFilters((current) => ({ ...current, gradYear: event.target.value }))}>
            <option value="">All class years</option>
            {options.gradYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </Select>
          <Select value={filters.industry} onChange={(event) => setFilters((current) => ({ ...current, industry: event.target.value }))}>
            <option value="">All industries</option>
            {options.industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
          </Select>
          <Select value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}>
            <option value="">All locations</option>
            {options.locations.map((location) => <option key={location} value={location}>{location}</option>)}
          </Select>
          <Select value={filters.major} onChange={(event) => setFilters((current) => ({ ...current, major: event.target.value }))}>
            <option value="">All majors</option>
            {options.majors.map((major) => <option key={major} value={major}>{major}</option>)}
          </Select>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-3 text-sm text-fraternity-charcoal">
            <Checkbox checked={filters.mentorOnly} onChange={(event) => setFilters((current) => ({ ...current, mentorOnly: event.target.checked }))} />
            Show mentors only
          </label>
          <div className="flex items-center gap-3">
            <p className="text-sm text-fraternity-slate">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
            <Button type="button" variant="ghost" onClick={() => setFilters(defaultFilters)}>Reset filters</Button>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((profile) => (
            <ProfileCard key={`${profile.name}-${profile.gradYear}`} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="surface p-10 text-center">
          <h3 className="text-2xl">No alumni matched these filters</h3>
          <p className="mt-3 mx-auto max-w-xl">This empty state is already handled so the directory feels finished even before live data is connected.</p>
        </div>
      )}
    </div>
  );
}
