// Temenos v2 fallback data + system metadata.
// Used when external APIs fail or for offline / demo mode.
// Each system has: meta (color, label, blurb, externalSite) + sample dimensional breakdowns.
window.TEMENOS_SYSTEMS = (function () {
  // ---- Sun-sign lookup by month/day (used as fallback) ----
  function sunSignFromDate(date) {
    if (!date) return 'Aries';
    const d = new Date(date);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const t = (mm, dd) => m === mm && day >= dd;
    const u = (mm, dd) => m === mm && day <= dd;
    if (t(3, 21) || u(4, 19)) return 'Aries';
    if (t(4, 20) || u(5, 20)) return 'Taurus';
    if (t(5, 21) || u(6, 20)) return 'Gemini';
    if (t(6, 21) || u(7, 22)) return 'Cancer';
    if (t(7, 23) || u(8, 22)) return 'Leo';
    if (t(8, 23) || u(9, 22)) return 'Virgo';
    if (t(9, 23) || u(10, 22)) return 'Libra';
    if (t(10, 23) || u(11, 21)) return 'Scorpio';
    if (t(11, 22) || u(12, 21)) return 'Sagittarius';
    if (t(12, 22) || (m === 1 && day <= 19)) return 'Capricorn';
    if ((m === 1 && day >= 20) || u(2, 18)) return 'Aquarius';
    return 'Pisces';
  }

  // ---- Vedic offset (~24°) is roughly one sign back for many dates. Rough heuristic. ----
  function vedicSignFromDate(date) {
    const western = sunSignFromDate(date);
    const order = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    const i = order.indexOf(western);
    return order[(i + 11) % 12];
  }

  const ZODIAC = {
    Aries:       { element: 'Fire',  modality: 'Cardinal', ruler: 'Mars',    qualities: ['Initiating','Bold','Direct'] },
    Taurus:      { element: 'Earth', modality: 'Fixed',    ruler: 'Venus',   qualities: ['Grounded','Sensual','Steady'] },
    Gemini:      { element: 'Air',   modality: 'Mutable',  ruler: 'Mercury', qualities: ['Curious','Quick','Versatile'] },
    Cancer:      { element: 'Water', modality: 'Cardinal', ruler: 'Moon',    qualities: ['Nurturing','Tidal','Protective'] },
    Leo:         { element: 'Fire',  modality: 'Fixed',    ruler: 'Sun',     qualities: ['Radiant','Generous','Creative'] },
    Virgo:       { element: 'Earth', modality: 'Mutable',  ruler: 'Mercury', qualities: ['Discerning','Precise','Devoted'] },
    Libra:       { element: 'Air',   modality: 'Cardinal', ruler: 'Venus',   qualities: ['Harmonious','Relational','Fair'] },
    Scorpio:     { element: 'Water', modality: 'Fixed',    ruler: 'Pluto',   qualities: ['Penetrating','Transformative','Intense'] },
    Sagittarius: { element: 'Fire',  modality: 'Mutable',  ruler: 'Jupiter', qualities: ['Expansive','Truth-seeking','Free'] },
    Capricorn:   { element: 'Earth', modality: 'Cardinal', ruler: 'Saturn',  qualities: ['Disciplined','Strategic','Patient'] },
    Aquarius:    { element: 'Air',   modality: 'Fixed',    ruler: 'Uranus',  qualities: ['Visionary','Independent','Systemic'] },
    Pisces:      { element: 'Water', modality: 'Mutable',  ruler: 'Neptune', qualities: ['Mystical','Empathic','Dissolving'] },
  };

  const HD_TYPES = ['Generator','Manifesting Generator','Projector','Manifestor','Reflector'];
  function hdTypeFromDate(date) {
    if (!date) return HD_TYPES[0];
    const d = new Date(date);
    return HD_TYPES[d.getDate() % HD_TYPES.length];
  }

  function geneKeyFromDate(date) {
    if (!date) return 1;
    const d = new Date(date);
    return ((d.getMonth() * 31 + d.getDate()) % 64) + 1;
  }

  const ENNEAGRAM = {
    '1': { name: 'The Reformer',   fixation: 'Resentment',    virtue: 'Serenity',   passion: 'Anger',     holyIdea: 'Holy Perfection' },
    '2': { name: 'The Helper',     fixation: 'Flattery',      virtue: 'Humility',   passion: 'Pride',     holyIdea: 'Holy Will, Holy Freedom' },
    '3': { name: 'The Achiever',   fixation: 'Vanity',        virtue: 'Truthfulness', passion: 'Deceit',  holyIdea: 'Holy Hope, Holy Law' },
    '4': { name: 'The Individualist', fixation: 'Melancholy', virtue: 'Equanimity', passion: 'Envy',      holyIdea: 'Holy Origin' },
    '5': { name: 'The Investigator',  fixation: 'Stinginess', virtue: 'Non-attachment', passion: 'Avarice', holyIdea: 'Holy Omniscience' },
    '6': { name: 'The Loyalist',   fixation: 'Cowardice',     virtue: 'Courage',    passion: 'Fear',      holyIdea: 'Holy Strength, Holy Faith' },
    '7': { name: 'The Enthusiast', fixation: 'Planning',      virtue: 'Sobriety',   passion: 'Gluttony',  holyIdea: 'Holy Work, Holy Plan' },
    '8': { name: 'The Challenger', fixation: 'Vengeance',     virtue: 'Innocence',  passion: 'Lust',      holyIdea: 'Holy Truth' },
    '9': { name: 'The Peacemaker', fixation: 'Indolence',     virtue: 'Action',     passion: 'Sloth',     holyIdea: 'Holy Love' },
  };

  const MBTI = {
    'INTJ': { nick: 'The Architect',     functions: ['Ni','Te','Fi','Se'] },
    'INTP': { nick: 'The Logician',      functions: ['Ti','Ne','Si','Fe'] },
    'ENTJ': { nick: 'The Commander',     functions: ['Te','Ni','Se','Fi'] },
    'ENTP': { nick: 'The Debater',       functions: ['Ne','Ti','Fe','Si'] },
    'INFJ': { nick: 'The Advocate',      functions: ['Ni','Fe','Ti','Se'] },
    'INFP': { nick: 'The Mediator',      functions: ['Fi','Ne','Si','Te'] },
    'ENFJ': { nick: 'The Protagonist',   functions: ['Fe','Ni','Se','Ti'] },
    'ENFP': { nick: 'The Campaigner',    functions: ['Ne','Fi','Te','Si'] },
    'ISTJ': { nick: 'The Logistician',   functions: ['Si','Te','Fi','Ne'] },
    'ISFJ': { nick: 'The Defender',      functions: ['Si','Fe','Ti','Ne'] },
    'ESTJ': { nick: 'The Executive',     functions: ['Te','Si','Ne','Fi'] },
    'ESFJ': { nick: 'The Consul',        functions: ['Fe','Si','Ne','Ti'] },
    'ISTP': { nick: 'The Virtuoso',      functions: ['Ti','Se','Ni','Fe'] },
    'ISFP': { nick: 'The Adventurer',    functions: ['Fi','Se','Ni','Te'] },
    'ESTP': { nick: 'The Entrepreneur',  functions: ['Se','Ti','Fe','Ni'] },
    'ESFP': { nick: 'The Entertainer',   functions: ['Se','Fi','Te','Ni'] },
  };

  const SPIRIT_ANIMALS = {
    'Hawk':       { qualities: ['Vision','Focus','Messenger'] },
    'Wolf':       { qualities: ['Loyalty','Instinct','Wild Wisdom'] },
    'Owl':        { qualities: ['Insight','Mystery','Night Sight'] },
    'Bear':       { qualities: ['Strength','Solitude','Healing'] },
    'Deer':       { qualities: ['Gentleness','Sensitivity','Grace'] },
    'Eagle':      { qualities: ['Perspective','Sovereignty','Spirit'] },
    'Fox':        { qualities: ['Cleverness','Adaptability','Camouflage'] },
    'Raven':      { qualities: ['Magic','Trickster','Threshold'] },
    'Snake':      { qualities: ['Renewal','Transmutation','Kundalini'] },
    'Butterfly':  { qualities: ['Transformation','Lightness','Cycles'] },
    'Horse':      { qualities: ['Freedom','Power','Movement'] },
    'Whale':      { qualities: ['Deep Wisdom','Song','Ancient Memory'] },
  };

  // ---- Numerology life-path number from birthdate ----
  function lifePath(date) {
    if (!date) return 1;
    const digits = date.replace(/-/g, '').split('').map(Number).filter(n => !isNaN(n));
    const reduce = n => {
      while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
        n = String(n).split('').reduce((a, b) => a + Number(b), 0);
      }
      return n;
    };
    return reduce(digits.reduce((a, b) => a + b, 0));
  }

  const NUMEROLOGY = {
    1: { name: 'The Leader',     qualities: ['Initiation','Pioneer','Independence'] },
    2: { name: 'The Diplomat',   qualities: ['Partnership','Harmony','Sensitivity'] },
    3: { name: 'The Communicator', qualities: ['Expression','Joy','Creativity'] },
    4: { name: 'The Builder',    qualities: ['Stability','Structure','Diligence'] },
    5: { name: 'The Adventurer', qualities: ['Freedom','Change','Curiosity'] },
    6: { name: 'The Caretaker',  qualities: ['Service','Beauty','Responsibility'] },
    7: { name: 'The Seeker',     qualities: ['Mysticism','Analysis','Inner Truth'] },
    8: { name: 'The Power',      qualities: ['Authority','Mastery','Material World'] },
    9: { name: 'The Humanitarian', qualities: ['Compassion','Completion','Wisdom'] },
    11: { name: 'The Illuminator', qualities: ['Intuition','Inspiration','Vision'] },
    22: { name: 'The Master Builder', qualities: ['Manifestation','Scale','Legacy'] },
    33: { name: 'The Master Teacher', qualities: ['Service','Healing','Christ Consciousness'] },
  };

  const BLOOD_TYPES = {
    'A':  { qualities: ['Cooperative','Sensitive','Analytical'], diet: 'Plant-forward' },
    'B':  { qualities: ['Balanced','Flexible','Creative'],       diet: 'Varied' },
    'AB': { qualities: ['Adaptable','Diplomatic','Rare'],         diet: 'Mixed Mediterranean' },
    'O':  { qualities: ['Strong','Pioneering','Resilient'],      diet: 'High-protein' },
  };

  return {
    // System catalogue (mandala metadata) — petal order matters.
    catalog: [
      { key: 'western_astrology', label: 'Western Astrology', tier: 'core', color: '#ffd166', external: null,
        blurb: 'Sun, moon, rising — the inner sky at your moment of birth.' },
      { key: 'vedic_astrology',   label: 'Vedic Astrology',   tier: 'core', color: '#ef476f', external: null,
        blurb: 'Sidereal chart, lunar mansions, deeper karmic patterns.' },
      { key: 'human_design',      label: 'Human Design',      tier: 'core', color: '#06d6a0', external: null,
        blurb: 'Type, strategy, authority — your energetic blueprint.' },
      { key: 'gene_keys',         label: 'Gene Keys',         tier: 'core', color: '#118ab2', external: null,
        blurb: 'Your hologenetic profile — shadows, gifts, and siddhis.' },
      { key: 'enneagram',         label: 'Enneagram',         tier: 'pro',  color: '#9b72cf', external: 'https://www.enneagraminstitute.com/rheti',
        blurb: 'Nine personality fixations and the path to integration.' },
      { key: 'mbti',              label: 'MBTI',              tier: 'pro',  color: '#4ecdc4', external: 'https://www.16personalities.com/free-personality-test',
        blurb: 'Cognitive function stack — how you perceive and decide.' },
      { key: 'spirit_animal',     label: 'Spirit Animal',     tier: 'pro',  color: '#e8705a', external: 'https://www.spirit-animals.com/',
        blurb: 'The kindred creature that walks alongside your spirit.' },
      { key: 'numerology',        label: 'Numerology',        tier: 'pro',  color: '#c9a96e', external: 'https://numerologist.com/life-path-number-calculator/',
        blurb: 'Life path number — the vibrational signature of your name and date.' },
      { key: 'blood_type',        label: 'Blood Type',        tier: 'pro',  color: '#ff6b6b', external: null,
        blurb: 'Type A, B, AB, or O — your body’s inherited dialect.' },
    ],

    // Compute fallback dimensional data given birth info + user value.
    compute(systemKey, birth, userValue) {
      switch (systemKey) {
        case 'western_astrology': {
          const sun = userValue || sunSignFromDate(birth.birth_date);
          const z = ZODIAC[sun] || ZODIAC.Aries;
          return {
            primary: sun,
            dimensions: [
              { label: 'Sun Sign', value: sun, qualities: z.qualities },
              { label: 'Element',  value: z.element },
              { label: 'Modality', value: z.modality },
              { label: 'Ruling Planet', value: z.ruler },
            ],
          };
        }
        case 'vedic_astrology': {
          const sun = userValue || vedicSignFromDate(birth.birth_date);
          const z = ZODIAC[sun] || ZODIAC.Aries;
          return {
            primary: sun,
            dimensions: [
              { label: 'Sidereal Sun', value: sun, qualities: z.qualities },
              { label: 'Element', value: z.element },
              { label: 'Modality', value: z.modality },
              { label: 'Ruling Planet', value: z.ruler },
            ],
          };
        }
        case 'human_design': {
          const t = userValue || hdTypeFromDate(birth.birth_date);
          const strat = {
            'Generator': 'Wait to Respond',
            'Manifesting Generator': 'Wait, then Inform',
            'Projector': 'Wait for Invitation',
            'Manifestor': 'Inform before Acting',
            'Reflector': 'Wait a Lunar Cycle',
          }[t];
          return {
            primary: t,
            dimensions: [
              { label: 'Type', value: t },
              { label: 'Strategy', value: strat },
              { label: 'Signature', value: t === 'Projector' ? 'Success' : t === 'Manifestor' ? 'Peace' : t === 'Reflector' ? 'Surprise' : 'Satisfaction' },
              { label: 'Not-Self Theme', value: t === 'Projector' ? 'Bitterness' : t === 'Manifestor' ? 'Anger' : t === 'Reflector' ? 'Disappointment' : 'Frustration' },
            ],
          };
        }
        case 'gene_keys': {
          const key = userValue ? Number(userValue) : geneKeyFromDate(birth.birth_date);
          return {
            primary: 'Gene Key ' + key,
            dimensions: [
              { label: 'Life’s Work',    value: 'Gene Key ' + key },
              { label: 'Evolution',      value: 'Gene Key ' + (((key + 31) % 64) + 1) },
              { label: 'Radiance',       value: 'Gene Key ' + (((key + 47) % 64) + 1) },
              { label: 'Purpose',        value: 'Gene Key ' + (((key + 15) % 64) + 1) },
            ],
          };
        }
        case 'enneagram': {
          const num = String(userValue || '4');
          const e = ENNEAGRAM[num] || ENNEAGRAM['4'];
          return {
            primary: 'Type ' + num + ': ' + e.name,
            dimensions: [
              { label: 'Type', value: 'Type ' + num },
              { label: 'Name', value: e.name },
              { label: 'Fixation', value: e.fixation },
              { label: 'Passion (Vice)', value: e.passion },
              { label: 'Virtue', value: e.virtue },
              { label: 'Holy Idea', value: e.holyIdea },
            ],
          };
        }
        case 'mbti': {
          const code = (userValue || 'INFJ').toUpperCase();
          const m = MBTI[code] || MBTI.INFJ;
          return {
            primary: code,
            dimensions: [
              { label: 'Type', value: code },
              { label: 'Nickname', value: m.nick },
              { label: 'Dominant', value: m.functions[0] },
              { label: 'Auxiliary', value: m.functions[1] },
              { label: 'Tertiary', value: m.functions[2] },
              { label: 'Inferior', value: m.functions[3] },
            ],
          };
        }
        case 'spirit_animal': {
          const name = userValue || 'Hawk';
          const s = SPIRIT_ANIMALS[name] || SPIRIT_ANIMALS.Hawk;
          return {
            primary: name,
            dimensions: [
              { label: 'Animal', value: name },
              { label: 'Qualities', value: s.qualities.join(', '), qualities: s.qualities },
            ],
          };
        }
        case 'numerology': {
          const n = userValue ? Number(userValue) : lifePath(birth.birth_date || '2000-01-01');
          const data = NUMEROLOGY[n] || NUMEROLOGY[1];
          return {
            primary: 'Life Path ' + n,
            dimensions: [
              { label: 'Life Path Number', value: String(n) },
              { label: 'Archetype', value: data.name },
              { label: 'Qualities', value: data.qualities.join(', '), qualities: data.qualities },
            ],
          };
        }
        case 'blood_type': {
          const t = (userValue || 'O').toUpperCase();
          const b = BLOOD_TYPES[t] || BLOOD_TYPES.O;
          return {
            primary: 'Type ' + t,
            dimensions: [
              { label: 'Blood Type', value: 'Type ' + t },
              { label: 'Qualities', value: b.qualities.join(', '), qualities: b.qualities },
              { label: 'Suggested Diet', value: b.diet },
            ],
          };
        }
        default:
          return { primary: 'Unknown', dimensions: [] };
      }
    },
  };
})();
