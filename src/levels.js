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
  // Level 4: Canyon (Pits & Flying Enemies) - RESTORED
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
  // Level 5: Master Challenge - RESTORED
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
  },
  // Level 6: Moving Sky (Moving Platforms)
  {
    id: 6,
    name: 'Level 6: Moving Sky',
    width: 2400,
    height: 600,
    hasGround: false,
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 300 },
    platforms: [
      { x: 100, y: 500, w: 200, h: 40 },
      // Horizontal Mover
      { x: 400, y: 400, w: 150, h: 20, move: { x: 200, duration: 2000 } },
      // Vertical Mover
      { x: 800, y: 400, w: 150, h: 20, move: { y: -200, duration: 2500 } },
      // Static rest
      { x: 1100, y: 200, w: 100, h: 20 },
      // Long Horizontal Mover
      { x: 1400, y: 200, w: 150, h: 20, move: { x: 300, duration: 3000 } },
      // Final approach
      { x: 2000, y: 300, w: 150, h: 20, move: { y: 100, duration: 1500 } },
      { x: 2300, y: 350, w: 200, h: 40 }
    ],
    stars: [
      { x: 500, y: 350 },
      { x: 800, y: 150 },
      { x: 1500, y: 150 },
      { x: 2000, y: 250 }
    ],
    enemies: [
      { x: 1100, y: 150, type: 'flying' },
      { x: 1700, y: 100, type: 'flying' }
    ]
  },
  // Level 7: Crumble Cave (Crumbling & Vertical Enemies)
  {
    id: 7,
    name: 'Level 7: Crumble Cave',
    width: 2400,
    height: 600,
    hasGround: true, // Ground exists but has pits
    playerStart: { x: 100, y: 450 },
    goal: { x: 2300, y: 450 },
    platforms: [
      // Crumbling bridge
      { x: 400, y: 400, w: 100, h: 20, type: 'crumble' },
      { x: 550, y: 350, w: 100, h: 20, type: 'crumble' },
      { x: 700, y: 300, w: 100, h: 20, type: 'crumble' },
      // Safe spot
      { x: 900, y: 250, w: 150, h: 20 },
      // Vertical Enemy Zone
      { x: 1300, y: 450, w: 100, h: 20 },
      { x: 1500, y: 350, w: 100, h: 20 },
      { x: 1700, y: 250, w: 100, h: 20 },
      // Final Crumble
      { x: 2000, y: 350, w: 150, h: 20, type: 'crumble' }
    ],
    stars: [
      { x: 550, y: 300 },
      { x: 1300, y: 400 },
      { x: 1700, y: 200 },
      { x: 2000, y: 300 }
    ],
    enemies: [
      { x: 1200, y: 300, type: 'vertical', range: 150 },
      { x: 1400, y: 200, type: 'vertical', range: 200 },
      { x: 1600, y: 100, type: 'vertical', range: 200 },
      { x: 600, y: 500, type: 'ground' }
    ]
  },
  // Level 8: The Gauntlet (All Mechanics)
  {
    id: 8,
    name: 'Level 8: The Gauntlet',
    width: 3000,
    height: 600,
    hasGround: false,
    playerStart: { x: 100, y: 450 },
    goal: { x: 2900, y: 300 },
    platforms: [
      { x: 100, y: 500, w: 200, h: 40 },
      // Moving + Vertical Enemy
      { x: 400, y: 400, w: 150, h: 20, move: { x: 100, duration: 1500 } },
      // Crumble sequence
      { x: 700, y: 300, w: 80, h: 20, type: 'crumble' },
      { x: 850, y: 300, w: 80, h: 20, type: 'crumble' },
      { x: 1000, y: 300, w: 80, h: 20, type: 'crumble' },
      // Vertical Mover
      { x: 1300, y: 500, w: 150, h: 20, move: { y: -300, duration: 2000 } },
      // High safe zone
      { x: 1600, y: 200, w: 200, h: 20 },
      // Long jump to moving
      { x: 2000, y: 300, w: 150, h: 20, move: { x: 200, duration: 2500 } },
      // Final Crumble Dash
      { x: 2400, y: 300, w: 80, h: 20, type: 'crumble' },
      { x: 2550, y: 300, w: 80, h: 20, type: 'crumble' },
      { x: 2700, y: 300, w: 80, h: 20, type: 'crumble' },
      { x: 2900, y: 350, w: 200, h: 40 }
    ],
    stars: [
      { x: 400, y: 350 },
      { x: 850, y: 250 },
      { x: 1300, y: 200 },
      { x: 2000, y: 250 },
      { x: 2550, y: 250 }
    ],
    enemies: [
      { x: 500, y: 200, type: 'vertical', range: 150 },
      { x: 1600, y: 150, type: 'ground' },
      { x: 2200, y: 100, type: 'flying' },
      { x: 2600, y: 100, type: 'vertical', range: 200 }
    ]
  }
];
