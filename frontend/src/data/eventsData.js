export const events = [
  {
    id: 1,
    title: 'Tuesday Tempo Session',
    date: '2026-06-02',
    time: '18:30',
    city: 'Alba Iulia',
    meetingPoint: 'Cetate Obelisc',
    paceGroups: ['5:00-5:30 /km', '5:30-6:00 /km', '6:00-6:45 /km'],
    distanceKm: 8,
    capacity: 24,
    fee: 0,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517963628607-235ccdd5476d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 2,
    title: 'Saturday Long Run',
    date: '2026-06-06',
    time: '08:00',
    city: 'Alba Iulia',
    meetingPoint: 'Parcul Unirii Fountain',
    paceGroups: ['5:20-5:50 /km', '5:50-6:20 /km', '6:20-7:00 /km'],
    distanceKm: 14,
    capacity: 30,
    fee: 5,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517931524326-bdd55a541177?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 3,
    title: 'Track Intervals',
    date: '2026-05-12',
    time: '19:00',
    city: 'Alba Iulia',
    meetingPoint: 'Municipal Stadium Gate A',
    paceGroups: ['All Levels (Coach-led lanes)'],
    distanceKm: 6,
    capacity: 20,
    fee: 0,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

export const createIcsFile = (event) => {
  const start = new Date(`${event.date}T${event.time}:00`);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Carolina Running Club//Events//EN\nBEGIN:VEVENT\nUID:crc-${event.id}@carolinarunningclub\nDTSTAMP:${formatDate(new Date())}\nDTSTART:${formatDate(start)}\nDTEND:${formatDate(end)}\nSUMMARY:${event.title}\nLOCATION:${event.meetingPoint}, ${event.city}\nDESCRIPTION:Distance ${event.distanceKm}km | Pace groups: ${event.paceGroups.join(', ')}\nEND:VEVENT\nEND:VCALENDAR`;
};

export const createGoogleCalendarLink = (event) => {
  const start = new Date(`${event.date}T${event.time}:00`);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const normalize = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${normalize(start)}/${normalize(end)}`,
    details: `Distance ${event.distanceKm}km | Pace groups: ${event.paceGroups.join(', ')}`,
    location: `${event.meetingPoint}, ${event.city}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
