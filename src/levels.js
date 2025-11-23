export const levels = [
  // Level 1: Grassland (Standard)
  {
    id: 1,
    name: 'Level 1: Grassland',
    width: 2400,
    height: 600,
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 100 },
    platforms: [
      // Screen 1
      { x: 600, y: 450, w: 200, h: 20 },
      { x: 200, y: 350, w: 200, h: 20 },
      // Screen 2
      { x: 1000, y: 300, w: 200, h: 20 },
      { x: 1400, y: 400, w: 200, h: 20 },
      { x: 1200, y: 150, w: 150, h: 20 },
      // Screen 3
      { x: 1800, y: 350, w: 200, h: 20 },
      { x: 2100, y: 250, w: 200, h: 20 },
      { x: 1700, y: 500, w: 100, h: 20 }
    ],
    stars: [
      { x: 600, y: 400 },
      { x: 200, y: 300 },
      { x: 1000, y: 250 },
      { x: 1200, y: 100 },
      { x: 1400, y: 350 },
      { x: 1800, y: 300 },
      { x: 2100, y: 200 }
    ],
    enemies: [
      { x: 400, y: 100 },
      { x: 1100, y: 100 },
      { x: 1500, y: 100 },
      { x: 1900, y: 100 }
    ]
  },
  // Level 2: Sky (Verticality)
  {
    id: 2,
    name: 'Level 2: Sky High',
    width: 2400,
    height: 600,
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 50 }, // Very high up
    platforms: [
      // Ascending steps
      { x: 300, y: 400, w: 150, h: 20 },
      { x: 500, y: 300, w: 150, h: 20 },
      { x: 700, y: 200, w: 150, h: 20 },
      // High traverse
      { x: 1000, y: 200, w: 200, h: 20 },
      { x: 1300, y: 300, w: 100, h: 20 }, // Gap
      { x: 1600, y: 200, w: 200, h: 20 },
      // Final climb
      { x: 1900, y: 300, w: 150, h: 20 },
      { x: 2100, y: 150, w: 150, h: 20 }
    ],
    stars: [
      { x: 300, y: 350 },
      { x: 700, y: 150 },
      { x: 1300, y: 250 },
      { x: 2100, y: 100 }
    ],
    enemies: [
      { x: 500, y: 250 },
      { x: 1000, y: 150 },
      { x: 1600, y: 150 }
    ]
  },
  // Level 3: Cave (Hard)
  {
    id: 3,
    name: 'Level 3: Danger Zone',
    width: 2400,
    height: 600,
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 450 },
    platforms: [
      // Tricky jumps
      { x: 300, y: 450, w: 100, h: 20 },
      { x: 500, y: 450, w: 100, h: 20 },
      { x: 700, y: 450, w: 100, h: 20 },
      // Upper path option
      { x: 900, y: 300, w: 200, h: 20 },
      { x: 1200, y: 300, w: 200, h: 20 },
      // Lower path with enemies
      { x: 1000, y: 500, w: 300, h: 20 },
      { x: 1500, y: 500, w: 300, h: 20 },
      // Final stretch
      { x: 1900, y: 450, w: 100, h: 20 },
      { x: 2100, y: 450, w: 100, h: 20 }
    ],
    stars: [
      { x: 500, y: 400 },
      { x: 900, y: 250 },
      { x: 1500, y: 450 },
      { x: 2100, y: 400 }
    ],
    enemies: [
      { x: 300, y: 400 },
      { x: 700, y: 400 },
      { x: 1000, y: 450 },
      { x: 1200, y: 250 },
      { x: 1500, y: 450 },
      { x: 1900, y: 400 }
    ]
  },
  // Level 4: Canyon (Pits & Flying Enemies)
  {
    id: 4,
    name: 'Level 4: Canyon Jump',
    width: 2400,
    height: 600,
    hasGround: false, // No continuous ground
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 350 },
    platforms: [
      // Starting area
      { x: 200, y: 500, w: 400, h: 40 },
      // Islands
      { x: 600, y: 400, w: 100, h: 20 },
      { x: 800, y: 300, w: 100, h: 20 },
      { x: 1100, y: 400, w: 200, h: 20 },
      { x: 1500, y: 300, w: 200, h: 20 },
      { x: 1900, y: 400, w: 150, h: 20 },
      // Goal area
      { x: 2300, y: 400, w: 200, h: 40 }
    ],
    stars: [
      { x: 600, y: 350 },
      { x: 800, y: 250 },
      { x: 1300, y: 200 }, // High star
      { x: 1900, y: 350 }
    ],
    enemies: [
      { x: 700, y: 100, type: 'flying' },
      { x: 1200, y: 100, type: 'flying' },
      { x: 1700, y: 100, type: 'flying' },
      { x: 1100, y: 350, type: 'ground' }
    ]
  },
  // Level 5: Master Challenge
  {
    id: 5,
    name: 'Level 5: Master Mode',
    width: 2400,
    height: 600,
    hasGround: false,
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 100 },
    platforms: [
      { x: 100, y: 500, w: 200, h: 40 },
      // Precise jumps
      { x: 400, y: 400, w: 80, h: 20 },
      { x: 600, y: 300, w: 80, h: 20 },
      { x: 800, y: 200, w: 80, h: 20 },
      // Long jump
      { x: 1200, y: 300, w: 200, h: 20 },
      // Enemy gauntlet
      { x: 1600, y: 300, w: 400, h: 20 },
      { x: 2100, y: 200, w: 100, h: 20 }
    ],
    stars: [
      { x: 400, y: 350 },
      { x: 800, y: 150 },
      { x: 1600, y: 250 },
      { x: 2100, y: 150 }
    ],
    enemies: [
      { x: 500, y: 100, type: 'flying' },
      { x: 900, y: 100, type: 'flying' },
      { x: 1600, y: 250, type: 'ground' },
      { x: 1700, y: 250, type: 'ground' },
      { x: 1800, y: 100, type: 'flying' }
    ]
  }
];
