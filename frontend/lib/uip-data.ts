export type University = 'UMD' | 'Michigan'

export const UNIVERSITIES: University[] = ['UMD', 'Michigan']

// ---- DINING DATA ----
export const diningHalls = {
  UMD: [
    {
      id: 'south',
      name: 'South Campus Dining Hall',
      status: 'open' as const,
      closesAt: '9:00 PM',
      currentMeal: 'Lunch until 2:30 PM',
      highlights: ['Grilled Chicken', 'Pasta Bar', 'Salad Bar'],
      updatedAgo: '4 min ago',
      stations: [],
    },
    {
      id: 'yahentamitsi',
      name: 'Yahentamitsi',
      status: 'open' as const,
      closesAt: '8:00 PM',
      currentMeal: 'Lunch until 2:00 PM',
      highlights: ['Pizza Slice', 'Soup of the Day', 'Fresh Fruit'],
      updatedAgo: '1 min ago',
      stations: [],
    },
    {
      id: 'north-court',
      name: 'North Campus Dining Hall Court',
      status: 'open' as const,
      closesAt: '7:00 PM',
      currentMeal: 'Dinner starts 5:30 PM',
      highlights: ['Pizza Slice', 'Soup of the Day', 'Fresh Fruit'],
      updatedAgo: '1 min ago',
      stations: [],
    },
    {
      id: 'diner',
      name: 'The Diner',
      status: 'open' as const,
      closesAt: '10:00 PM',
      currentMeal: 'Lunch until 3:00 PM',
      highlights: [],
      updatedAgo: '2 min ago',
      stations: [
        {
          name: 'Grill Station',
          items: [
            { name: 'Cheeseburger', tags: ['G', 'D'] },
            { name: 'Veggie Burger', tags: ['V', 'G'] },
            { name: 'French Fries', tags: ['V'] },
          ],
        },
        {
          name: 'Deli Station',
          items: [
            { name: 'Turkey Club', tags: ['G', 'D'] },
            { name: 'Hummus Wrap', tags: ['V', 'G'] },
            { name: 'Chicken Salad', tags: ['G', 'E'] },
          ],
        },
        {
          name: 'International Station',
          items: [
            { name: 'Teriyaki Chicken', tags: ['S', 'G'] },
            { name: 'Vegetable Stir-Fry', tags: ['V', 'S'] },
            { name: 'Steamed Rice', tags: ['V'] },
          ],
        },
      ],
    },
    {
      id: '251-north',
      name: '251 North',
      status: 'closed' as const,
      closesAt: '',
      opensAt: '7:00 AM',
      currentMeal: 'Dinner starts 5:00 PM',
      highlights: ['Roasted Salmon', 'Mashed Potatoes', 'Green Beans'],
      updatedAgo: '10 min ago',
      stations: [],
    },
    {
      id: 'north-campus',
      name: 'North Campus Dining Hall',
      status: 'closed' as const,
      closesAt: '',
      opensAt: '7:30 AM',
      currentMeal: 'Dinner starts 5:30 PM',
      highlights: ['Taco Bar', 'Rice & Beans', 'Churros'],
      updatedAgo: '8 min ago',
      stations: [],
    },
    {
      id: 'stamp',
      name: 'Stamp Student Union Food Court',
      status: 'open' as const,
      closesAt: '11:00 PM',
      currentMeal: 'All Day Dining',
      highlights: ['Subway', 'Chick-fil-A', 'Panda Express'],
      updatedAgo: '3 min ago',
      stations: [],
    },
  ],
  Michigan: [
    {
      id: 'mich-east',
      name: 'East Quad Dining',
      status: 'open' as const,
      closesAt: '9:00 PM',
      currentMeal: 'Lunch until 2:00 PM',
      highlights: ['Pasta Station', 'Salad Bar', 'Grill'],
      updatedAgo: '3 min ago',
      stations: [],
    },
    {
      id: 'mich-north',
      name: 'Bursley Dining Hall',
      status: 'open' as const,
      closesAt: '8:30 PM',
      currentMeal: 'Lunch until 3:00 PM',
      highlights: ['Pizza', 'Stir Fry', 'Deli'],
      updatedAgo: '5 min ago',
      stations: [],
    },
    {
      id: 'mich-south',
      name: 'South Quad Dining',
      status: 'closed' as const,
      closesAt: '',
      opensAt: '7:00 AM',
      currentMeal: 'Dinner starts 5:00 PM',
      highlights: ['Burgers', 'Vegan Options', 'Dessert Bar'],
      updatedAgo: '12 min ago',
      stations: [],
    },
  ],
}

// ---- ATHLETICS DATA ----
export const athleticsData = {
  UMD: {
    live: {
      sport: 'Football',
      status: 'LIVE',
      quarter: '3rd Quarter',
      homeTeam: 'Maryland Terrapins',
      homeScore: 21,
      awayTeam: 'Penn State Nittany Lions',
      awayScore: 14,
      network: 'ESPN',
      lastPlay: 'TD — 24-yard run',
      updatedAgo: '6 min ago',
      date: 'Wednesday, March 4, 2026, 10:40 AM EST',
    },
    upcoming: [
      { sport: 'Basketball', opponent: 'Ohio State Buckeyes', date: 'Mar 4', time: '7:00 PM', location: 'Home', network: 'ESPN', isToday: true, logoColor: '#BB0000' },
      { sport: 'Lacrosse', opponent: 'Johns Hopkins Blue Jays', date: 'Mar 7', time: '1:00 PM', location: 'Away', network: 'ESPNU', isToday: false, logoColor: '#002D72' },
      { sport: 'Baseball', opponent: 'Virginia Cavaliers', date: 'Mar 8', time: '2:00 PM', location: 'Home', network: 'BTN', isToday: false, logoColor: '#232D4B' },
      { sport: 'Basketball', opponent: 'Northwestern Wildcats', date: 'Mar 1', time: 'Final', location: 'Away', network: 'BTN', isToday: false, result: 'W', finalScore: '75-68', logoColor: '#4E2683' },
    ],
  },
  Michigan: {
    live: null,
    upcoming: [
      { sport: 'Football', opponent: 'Ohio State Buckeyes', date: 'Mar 5', time: '3:30 PM', location: 'Home', network: 'ABC', isToday: false, logoColor: '#BB0000' },
      { sport: 'Basketball', opponent: 'Michigan State Spartans', date: 'Mar 7', time: '7:00 PM', location: 'Away', network: 'ESPN', isToday: false, logoColor: '#18453B' },
      { sport: 'Hockey', opponent: 'Notre Dame Fighting Irish', date: 'Mar 9', time: '6:00 PM', location: 'Home', network: 'BTN', isToday: false, logoColor: '#0C2340' },
    ],
  },
}

// ---- EVENTS DATA ----
export const eventsData = {
  UMD: [
    { id: 1, title: 'Career Fair: Spring 2026', date: 'Mar 5', time: '11:00 AM - 3:00 PM', location: 'Stamp Student Union, Grand Ballroom', source: 'Main Cal', category: 'Career', description: 'Connect with over 150 employers from various industries. Dress professionally and bring your resume.' },
    { id: 2, title: 'Concert in the Park', date: 'Mar 6', time: '7:00 PM', location: 'McKeldin Mall', source: 'TerpLink', category: 'Social', description: 'Enjoy live music from local bands and student performers. Food trucks will be available.' },
    { id: 3, title: 'Guest Lecture: Dr. Smith on AI Ethics', date: 'Mar 7', time: '4:00 PM', location: 'Iribe Center, Auditorium', source: 'Main Cal', category: 'Academic', description: 'Explore the ethical considerations of artificial intelligence in today\'s society.' },
    { id: 4, title: 'UMD Terrapins vs. Ohio State Buckeyes (Basketball)', date: 'Mar 8', time: '2:00 PM', location: 'Xfinity Center', source: 'Athletics', category: 'Athletics', description: 'Cheer on the Terps as they take on a Big Ten rival in a highly anticipated matchup. Students can claim free tickets through their student account.' },
    { id: 5, title: 'Art Gallery Opening: Student Showcase', date: 'Mar 9', time: '6:00 PM', location: 'The Art Gallery, Parren J. Mitchell Art-Sociology Building', source: 'Main Cal', category: 'Arts', description: 'Celebrate the creativity of UMD students at this special exhibition opening.' },
    { id: 6, title: 'Hackathon Kickoff', date: 'Mar 4', time: '7:00 PM', location: 'Sandbox', source: 'TerpLink', category: 'Academic', description: 'Join 200+ students for a 24-hour hackathon. Form teams and build something amazing.' },
  ],
  Michigan: [
    { id: 1, title: 'Engineering Career Fair', date: 'Mar 5', time: '10:00 AM - 4:00 PM', location: 'Michigan Union, Ballroom', source: 'Main Cal', category: 'Career', description: 'Connect with top engineering employers from across the country.' },
    { id: 2, title: 'Ann Arbor Jazz Festival', date: 'Mar 6', time: '5:00 PM', location: 'Hill Auditorium', source: 'Main Cal', category: 'Arts', description: 'An evening of world-class jazz performances in one of Michigan\'s most iconic venues.' },
    { id: 3, title: 'AI Research Symposium', date: 'Mar 8', time: '9:00 AM', location: 'North Quad, Room 2435', source: 'Academic', category: 'Academic', description: 'Faculty and graduate students present cutting-edge research in artificial intelligence.' },
  ],
}

// ---- NIGHTLIFE DATA ----
export const nightlifeData = {
  UMD: {
    tonight: [
      { id: 1, venue: 'Looney\'s Pub', venueType: 'Bar', eventName: 'College Night: Live Music & Trivia', time: 'Mar 4, 8:00 PM - 1:00 AM', cost: 'Free before 10pm', description: 'Enjoy local bands and test your knowledge with trivia. Drink specials all night.', address: '8150 Baltimore Ave, College Park, MD', priceRange: '$$' },
      { id: 2, venue: 'The Cornerstone Grill & Loft', venueType: 'Club', eventName: 'DJ Dance Party', time: 'Mar 4, 10:00 PM - 2:00 AM', cost: '$5 cover', description: 'Dance the night away with DJ Smith spinning the latest hits. 18+ to enter.', address: '7325 Baltimore Ave, College Park, MD', priceRange: '$' },
      { id: 3, venue: 'Terrapin\'s Turf', venueType: 'Lounge', eventName: 'Karaoke Night', time: 'Mar 4, 9:00 PM - 1:00 AM', cost: 'No Cover', description: 'Sing your heart out at our weekly karaoke night! Choose from thousands of songs and enjoy a relaxed atmosphere with friends. Kitchen open late.', address: '4410 Knox Rd, College Park, MD', priceRange: '$$', hours: '4:00 PM - 2:00 AM' },
      { id: 4, venue: 'R.J. Bentley\'s', venueType: 'Bar', eventName: 'Wednesday Wing Night', time: 'Mar 4, 5:00 PM - 12:00 AM', cost: 'No Cover', description: 'Half-price wings and drink specials. Watch the game on our big screens.', address: '7323 Baltimore Ave, College Park, MD', priceRange: '$' },
    ],
    thisWeekend: [
      { id: 5, venue: 'Looney\'s Pub', venueType: 'Bar', eventName: 'Weekend Live Band Night', time: 'Mar 7, 9:00 PM - 2:00 AM', cost: '$5 cover', description: 'Live bands every Friday and Saturday night.', address: '8150 Baltimore Ave, College Park, MD', priceRange: '$$' },
      { id: 6, venue: 'The Cornerstone Grill & Loft', venueType: 'Club', eventName: 'Saturday Night Party', time: 'Mar 8, 10:00 PM - 3:00 AM', cost: '$10 cover', description: 'The biggest party in College Park. Doors open at 10 PM.', address: '7325 Baltimore Ave, College Park, MD', priceRange: '$' },
    ],
  },
  Michigan: {
    tonight: [
      { id: 1, venue: 'The Fieldhouse', venueType: 'Bar', eventName: 'Trivia Night', time: 'Mar 4, 8:00 PM - 11:00 PM', cost: 'Free', description: 'Test your knowledge with themed trivia nights. Prizes for top teams.', address: '215 S State St, Ann Arbor, MI', priceRange: '$' },
      { id: 2, venue: 'Rick\'s American Cafe', venueType: 'Club', eventName: 'Wednesday Night Out', time: 'Mar 4, 9:00 PM - 2:00 AM', cost: '$5 cover', description: 'Ann Arbor\'s most iconic college bar. Dance floor opens at 10 PM.', address: '611 Church St, Ann Arbor, MI', priceRange: '$$' },
    ],
    thisWeekend: [],
  },
}

// ---- NEWS DATA ----
export const newsData = {
  UMD: [
    { id: 1, title: 'UMD Researchers Develop New Sustainable Material', excerpt: 'A team of scientists at the University of Maryland has created a novel, eco-friendly material with potential applications in construction and packaging, offering a significant reduction in carbon emissions.', author: 'Dr. Jane Doe', date: 'Mar 4, 2026', category: 'Research', image: null },
    { id: 2, title: 'Terrapins Basketball Team Advances to Big Ten Tournament Finals', excerpt: 'The Maryland Terrapins defeated the Ohio State Buckeyes in a thrilling semifinal match, securing their spot in the championship game this weekend.', author: 'John Smith', date: 'Mar 3, 2026', category: 'Athletics', image: null },
    { id: 3, title: 'University Announces New Initiative for Student Mental Health Support', excerpt: 'UMD launches a comprehensive program to expand counseling services, increase resources, and promote well-being across the campus community.', author: 'Office of the President', date: 'Mar 2, 2026', category: 'Administration', image: null },
    { id: 4, title: 'Annual Spring Career Fair Brings Over 200 Employers to Campus', excerpt: 'Students from all majors connect with recruiters from top companies, exploring internships and full-time opportunities.', author: 'Career Center Staff', date: 'Mar 1, 2026', category: 'Student Life', image: null },
    { id: 5, title: 'Campus Dining Services Introduces New Vegan Options', excerpt: 'Starting this semester, all dining halls will feature an expanded plant-based menu with options prepared fresh daily.', author: 'Dining Services', date: 'Feb 28, 2026', category: 'Student Life', image: null },
  ],
  Michigan: [
    { id: 1, title: 'Michigan Researchers Awarded $50M NIH Grant for Cancer Research', excerpt: 'A team of oncology researchers at the University of Michigan has received a landmark $50 million grant to advance cancer immunotherapy.', author: 'Dr. Sarah Johnson', date: 'Mar 4, 2026', category: 'Research', image: null },
    { id: 2, title: 'Michigan Wolverines Basketball Ranked #3 Nationally', excerpt: 'Following a dominant win over Indiana, the Wolverines move up to #3 in the AP Poll, their highest ranking in three years.', author: 'Athletic Communications', date: 'Mar 3, 2026', category: 'Athletics', image: null },
    { id: 3, title: 'U-M Announces New Sustainability Initiative', excerpt: 'The University of Michigan commits to carbon neutrality by 2040, launching a comprehensive sustainability roadmap.', author: 'Office of Sustainability', date: 'Mar 2, 2026', category: 'Administration', image: null },
  ],
}

export const mostReadNews = {
  UMD: [
    'UMD Researchers Develop New Sustainable Material',
    'Terrapins Basketball Team Advances to Big Ten Tournament Finals',
    'University Announces New Initiative for Student Mental Health Support',
    'Annual Spring Career Fair Brings Over 200 Employers to Campus',
    'Campus Dining Services Introduces New Vegan Options',
  ],
  Michigan: [
    'Michigan Researchers Awarded $50M NIH Grant for Cancer Research',
    'Michigan Wolverines Basketball Ranked #3 Nationally',
    'U-M Announces New Sustainability Initiative',
  ],
}

export const statusBarData = {
  UMD: {
    dining: { label: '3 halls open', detail: 'Jump to Dining' },
    events: { label: '8 events today', detail: 'Jump to Events' },
    live: { label: 'LIVE: Maryland 21 – Penn State 14', detail: null },
    nightlife: { label: '4 events tonight', detail: 'Jump to Nightlife' },
  },
  Michigan: {
    dining: { label: '2 halls open', detail: 'Jump to Dining' },
    events: { label: '5 events today', detail: 'Jump to Events' },
    live: null,
    nightlife: { label: '2 events tonight', detail: 'Jump to Nightlife' },
  },
}

// ---- CHAT SUGGESTIONS ----
export const chatSuggestions = [
  'Is 251 North open?',
  'Free food today?',
  'Score of the game?',
  'Events tonight?',
  "What's for dinner?",
  'UMD news today?',
]

// ---- MOCK CHAT RESPONSES ----
export const mockResponses: Record<string, string> = {
  default: "I'm here to help you navigate campus life at UMD. Ask me anything about dining, events, athletics, nightlife, or news!",
  "is 251 north open": "Yes, 251 North is currently open and serving lunch until 2:30 PM. Today's menu features grilled chicken, a pasta bar, and a fresh salad bar. Dinner service begins at 5:00 PM and runs until 8:00 PM.",
  "free food today": "There are 3 events with free food today! The Student Government meeting at 12 PM in Stamp has pizza, the CS Department open house at 3 PM in Iribe has snacks, and the Cultural Fair at 5 PM on McKeldin Mall has international cuisine.",
  "score of the game": "LIVE: Maryland Terrapins are winning 21-14 against Penn State Nittany Lions in the 3rd Quarter. Last play: TD — 24-yard run, updated 6 minutes ago.",
  "events tonight": "There are 4 events tonight: Concert in the Park at McKeldin Mall (7 PM), Hackathon Kickoff at the Sandbox (7 PM), and 2 nightlife events including DJ Dance Party at The Cornerstone and Karaoke Night at Terrapin's Turf.",
  "what's for dinner": "Dinner service starts at 5 PM at most dining halls. Featured tonight: Grilled Salmon at The Diner, Taco Bar at North Campus Dining Hall, and All-Day dining at Stamp Student Union Food Court.",
  "umd news today": "Top stories today: (1) UMD Researchers Develop New Sustainable Material — a breakthrough eco-friendly material for construction. (2) Terrapins Basketball Advances to Big Ten Finals after defeating Ohio State. (3) New Mental Health Initiative announced by the Office of the President.",
}

export function getMockResponse(query: string): { text: string; sources: string[] } {
  const lower = query.toLowerCase()
  for (const key of Object.keys(mockResponses)) {
    if (key !== 'default' && lower.includes(key)) {
      return {
        text: mockResponses[key],
        sources: getSourcesForQuery(key),
      }
    }
  }
  return { text: mockResponses.default, sources: [] }
}

function getSourcesForQuery(key: string): string[] {
  const sourceMap: Record<string, string[]> = {
    "is 251 north open": ['UMD Dining · 4 min ago', '251 North Status · 12 min ago'],
    "free food today": ['UMD Events · 2 min ago', 'TerpLink · 8 min ago'],
    "score of the game": ['UMD Athletics · LIVE', 'ESPN · 6 min ago'],
    "events tonight": ['UMD Events · 1 min ago', 'TerpLink · 5 min ago'],
    "what's for dinner": ['UMD Dining · 3 min ago'],
    "umd news today": ['UMD Newsroom · Mar 4'],
  }
  return sourceMap[key] || []
}
