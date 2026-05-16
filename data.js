// ═══════════════════════════════════════════════════════════
// WITCHER 3 BUILD PLANNER — Static Game Data
// Extracted from index.html for maintainability.
// No ES module syntax; all consts are global.
// ═══════════════════════════════════════════════════════════

// ── Named constants ──
const TIER_THRESHOLDS = [0, 6, 12, 18];
const SL = [1,2,4,6,8,10,12,15,18,22,26,30];
const ML = [3,9,16,28];
const mc = { r:'red', b:'blue', g:'green' };
const colorN = { red:'COMBAT', blue:'SIGNS', green:'ALCHEMY', brown:'GENERAL' };
const typeColors = { combat:'var(--red-b)', signs:'var(--blue-b)', alchemy:'var(--green-b)' };
const COLOR_HEX = { combat:'#e05040', signs:'#3498db', alchemy:'#27ae60' };
const COLOR_CODE = { combat:'red', signs:'blue', alchemy:'green' };

// ═══════════════════════════════════════════════════════════
// TREES
// ═══════════════════════════════════════════════════════════
const TREES = {
  combat: {
    color: 'red',
    // 5 columns; Battle Trance is a passive root (always active), its column skills are still investable
    cols: ['FAST ATTACK','STRONG ATTACK','DEFENSE','MARKSMANSHIP','BATTLE TRANCE'],
    rootNote: 'Battle Trance (root): Blows generate AP. Each AP = +10% weapon damage. Always active.',
    // tiers[tierIndex][colIndex] = skill
    tiers: [
      { req:0, label:'TIER I' },
      { req:6, label:'TIER II' },
      { req:12, label:'TIER III' },
      { req:18, label:'TIER IV' },
    ],
    // grid[col][tier] = skill id
    grid: [
      // Fast Attack
      ['muscle_memory','precise_blows','whirl','crippling_strikes'],
      // Strong Attack
      ['strength_training','crushing_blows','rend','sunder_armor'],
      // Defense
      ['arrow_deflection','fleet_footed','counterattack','deadly_precision'],
      // Marksmanship
      ['lightning_reflexes','cold_blood','anatomical_knowledge','crippling_shot'],
      // Battle Trance
      ['resolve','undying','razor_focus','flood_of_anger'],
    ],
  },
  signs: {
    color: 'blue',
    cols: ['AARD','IGNI','YRDEN','QUEN','AXII'],
    tiers: [
      { req:0, label:'TIER I' },
      { req:6, label:'TIER II' },
      { req:12, label:'TIER III' },
      { req:18, label:'TIER IV' },
    ],
    grid: [
      // Aard
      ['far_reaching_aard','aard_sweep','shock_wave','aard_intensity'],
      // Igni
      ['melt_armor','firestream','pyromaniac','igni_intensity'],
      // Yrden
      ['sustained_glyphs','magic_trap','supercharged_glyphs','yrden_intensity'],
      // Quen
      ['exploding_shield','active_shield','quen_discharge','quen_intensity'],
      // Axii
      ['delusion','puppet','domination','axii_intensity'],
    ],
  },
  alchemy: {
    color: 'green',
    cols: ['BREWING','OIL PREPARATION','BOMB CREATION','MUTATION','TRIAL OF GRASSES'],
    tiers: [
      { req:0, label:'TIER I' },
      { req:6, label:'TIER II' },
      { req:12, label:'TIER III' },
      { req:18, label:'TIER IV' },
    ],
    grid: [
      // Brewing
      ['heightened_tolerance','refreshment','delayed_recovery','side_effects'],
      // Oil Preparation
      ['poisoned_blades','protective_coating','fixative','hunter_instinct'],
      // Bomb Creation
      ['steady_aim','pyrotechnics','efficiency','cluster_bombs'],
      // Mutation
      ['acquired_tolerance','tissue_transmutation','synergy','adaptation'],
      // Trial of the Grasses
      ['frenzy','endure_pain','fast_metabolism','killing_spree'],
    ],
  },
  general: {
    color: 'brown',
    cols: ['GENERAL SKILLS — No tier requirements · All require 1 point · Max rank 1'],
    tiers: [],
    // General is a flat list, rendered differently
    skills: [
      'sun_and_stars','steady_shot_gen','metabolism_boost','gorged_on_power',
      'survival_instinct','rage_management','trick_shot','gourmet',
      'cat_school','adrenaline_burst','advanced_pyrotechnics','combats_fires',
      'griffin_school','focus','battle_frenzy','heavy_artillery',
      'bear_school','metabolic_control','strong_back','attack_best_defense',
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// SKILLS
// text: { name, desc, ranks } — i18n-ready wrapper
// ═══════════════════════════════════════════════════════════
const SKILLS = {
  // ── COMBAT ──
  muscle_memory:       {icon:'⚔',color:'red',max:3,text:{name:'Muscle Memory',desc:'Increases fast attack damage.',ranks:['Fast atk dmg +10%; AP gain +1%','Fast atk dmg +20%; AP gain +2%','Fast atk dmg +30%; AP gain +3%']}},
  precise_blows:       {icon:'🎯',color:'red',max:3,text:{name:'Precise Blows',desc:'Increases fast attack critical hit chance and damage.',ranks:['Fast crit +4%, crit dmg +25%; AP +1%','Fast crit +8%, crit dmg +50%; AP +2%','Fast crit +12%, crit dmg +75%; AP +3%']}},
  whirl:               {icon:'🌀',color:'red',max:3,text:{name:'Whirl',desc:'Alternate fast attack: spinning strike hitting all nearby foes. Costs Stamina and Adrenaline.',ranks:['Whirl enabled; AP gain +1%','Stamina/adrenaline cost −33%; AP gain +2%','Stamina/adrenaline cost −50%; AP gain +3%']}},
  crippling_strikes:   {icon:'🩸',color:'red',max:3,text:{name:'Crippling Strikes',desc:'Fast attacks apply Bleeding. Affected enemies lose Vitality per second for 5 seconds.',ranks:['Bleed 50 vit/s for 5s; AP +1%','Bleed 100 vit/s for 5s; AP +2%','Bleed 150 vit/s for 5s; AP +3%']}},

  strength_training:   {icon:'💪',color:'red',max:3,text:{name:'Strength Training',desc:'Increases strong attack damage.',ranks:['Strong atk dmg +10%; AP +1%','Strong atk dmg +20%; AP +2%','Strong atk dmg +30%; AP +3%']}},
  crushing_blows:      {icon:'🔨',color:'red',max:3,text:{name:'Crushing Blows',desc:'Increases strong attack critical hit chance and damage.',ranks:['Strong crit +4%, crit dmg +25%; AP +1%','Strong crit +8%, crit dmg +50%; AP +2%','Strong crit +12%, crit dmg +75%; AP +3%']}},
  rend:                {icon:'🗡',color:'red',max:3,text:{name:'Rend',desc:'Charged strong attack — deals bonus damage proportional to Stamina consumed, ignores defense. AP increases total damage by 33%.',ranks:['Rend enabled; crit +20%; AP +1%','Rend crit +40%; AP +2%','Rend crit +60%; AP +3%']}},
  sunder_armor:        {icon:'⚙',color:'red',max:3,text:{name:'Sunder Armor',desc:'Strong attacks permanently reduce enemy damage resistance per hit.',ranks:['Resistance −10% per hit; AP +1%','Resistance −20% per hit; AP +2%','Resistance −30% per hit; AP +3%']}},

  arrow_deflection:    {icon:'🪃',color:'red',max:2,text:{name:'Arrow Deflection',desc:'Deflect arrows while parrying. At rank 2, perfectly timed parries reflect arrows back at the shooter.',ranks:['Deflect arrows while parrying; AP +1%','Perfectly timed parry reflects arrows at shooter; AP +2%']}},
  fleet_footed:        {icon:'💨',color:'red',max:1,text:{name:'Fleet Footed',desc:'Damage received while dodging is reduced by 100%.',ranks:['Dodge dmg −100%; AP +1%']}},
  counterattack:       {icon:'🛡',color:'red',max:3,text:{name:'Counterattack',desc:'After a successful counterattack, next attack deals bonus damage.',ranks:['Counterattack: next atk +30% dmg; AP +1%','Next atk +60% dmg + knockdown chance; AP +2%','Next atk +90% dmg, crit hit + knockdown chance; AP +3%']}},
  deadly_precision:    {icon:'☠',color:'red',max:2,text:{name:'Deadly Precision',desc:'Every Adrenaline Point adds to instant-kill chance on enemies.',ranks:['Instant kill +1% per AP; AP +1%','Instant kill +2% per AP; AP +2%']}},

  lightning_reflexes:  {icon:'⚡',color:'red',max:1,text:{name:'Lightning Reflexes',desc:'Time slowed by an additional 50% while aiming the crossbow.',ranks:['Slowdown +50%; AP +1%']}},
  cold_blood:          {icon:'🎯',color:'red',max:3,text:{name:'Cold Blood',desc:'Each crossbow bolt that hits generates Adrenaline Points.',ranks:['Hit: +0.1 AP; AP +1%','Hit: +0.2 AP; AP +2%','Hit: +0.3 AP; AP +3%']}},
  anatomical_knowledge:{icon:'🔬',color:'red',max:3,text:{name:'Anatomical Knowledge',desc:'Increases crossbow critical hit chance.',ranks:['Crossbow crit +20%; AP +1%','Crossbow crit +40%; AP +2%','Crossbow crit +60%; AP +3%']}},
  crippling_shot:      {icon:'🏹',color:'red',max:3,text:{name:'Crippling Shot',desc:'Critical crossbow hits disable monster special abilities.',ranks:['Disable 10s on crit; AP +1%','Disable 20s on crit; AP +2%','Disable 30s on crit; AP +3%']}},

  resolve:             {icon:'🔥',color:'red',max:3,text:{name:'Resolve',desc:'Adrenaline Point loss upon taking damage is reduced.',ranks:['AP loss on hit −33%; AP gen +1%','AP loss on hit −67%; AP gen +2%','AP loss on hit eliminated; AP gen +3%']}},
  undying:             {icon:'💀',color:'red',max:3,text:{name:'Undying',desc:'When Vitality reaches 0, Adrenaline Points are consumed to restore Vitality.',ranks:['Vitality restored from AP; AP gen +1%','Restore amount +33% bonus; AP gen +2%','Restore amount +67% bonus; AP gen +3%']}},
  razor_focus:         {icon:'🧠',color:'red',max:3,text:{name:'Razor Focus',desc:'Instantly gain 1 AP when entering combat. AP generated by sword blows increased.',ranks:['+1 AP on combat start; sword AP gen +10%; total AP +1%','Sword AP gen +20%; total AP +2%','Sword AP gen +30%; total AP +3%']}},
  flood_of_anger:      {icon:'🌊',color:'red',max:3,text:{name:'Flood of Anger',desc:'Casting a Sign consumes 3 AP to upgrade Sign to highest level and increase Sign intensity.',ranks:['Sign upgraded; intensity +100%; AP +1%','Sign intensity +200%; AP +2%','Sign intensity +300%; AP +3%']}},

  // ── SIGNS ──
  far_reaching_aard:   {icon:'💨',color:'blue',max:3,text:{name:'Far-Reaching Aard',desc:'Increases Aard blast range.',ranks:['Range +1m; stam regen +0.5/s','Range +2m; stam regen +1/s','Range +3m; stam regen +1.5/s']}},
  aard_sweep:          {icon:'🌊',color:'blue',max:3,text:{name:'Aard Sweep',desc:'Alternate mode — Aard blasts in a 360° arc around Geralt. Knockdown chance is lower until rank 3.',ranks:['Circle blast; knockdown −21%; stam regen +0.5/s','Knockdown −17%; stam regen +1/s','Full knockdown chance; stam regen +1.5/s']}},
  shock_wave:          {icon:'💢',color:'blue',max:3,text:{name:'Shock Wave',desc:'Aard deals damage to knocked-down or staggered enemies. Damage scales with enemy level at rank 3.',ranks:['Aard deals 100 damage; stam regen +0.5/s','200 damage; stam regen +1/s','300 damage; stam regen +1.5/s']}},
  aard_intensity:      {icon:'🌬',color:'blue',max:3,text:{name:'Aard Intensity',desc:'Increases Aard Sign intensity.',ranks:['Aard intensity +5%; stam regen +0.5/s','Aard intensity +10%; stam regen +1/s','Aard intensity +15%; stam regen +1.5/s']}},

  melt_armor:          {icon:'🔥',color:'blue',max:3,text:{name:'Melt Armor',desc:'Igni damage permanently weakens enemy armor. Scales with Sign intensity.',ranks:['Armor weakened per hit (max 15%); stam regen +0.5/s','Max 30%; stam regen +1/s','Max 45%; stam regen +1.5/s']}},
  firestream:          {icon:'🌋',color:'blue',max:3,text:{name:'Firestream',desc:'Alternate Igni mode — continuous stream of fire instead of burst.',ranks:['Firestream enabled; stam regen +0.5/s','Stamina cost −25%; stam regen +1/s','Stamina cost −50%; stam regen +1.5/s']}},
  pyromaniac:          {icon:'☀',color:'blue',max:3,text:{name:'Pyromaniac',desc:'Increases the chance Igni inflicts Burning.',ranks:['Burn chance +20%; stam regen +0.5/s','Burn chance +40%; stam regen +1/s','Burn chance +60%; stam regen +1.5/s']}},
  igni_intensity:      {icon:'🌡',color:'blue',max:3,text:{name:'Igni Intensity',desc:'Increases Igni Sign intensity.',ranks:['Igni intensity +5%; stam regen +0.5/s','Igni intensity +10%; stam regen +1/s','Igni intensity +15%; stam regen +1.5/s']}},

  sustained_glyphs:    {icon:'⭕',color:'blue',max:2,text:{name:'Sustained Glyphs',desc:'Increases Yrden trap duration and the number of alternate traps placeable at once.',ranks:['Duration +5s; 2 alt traps; stam regen +0.5/s','Duration +10s; 3 alt traps; stam regen +1/s']}},
  magic_trap:          {icon:'🕸',color:'blue',max:3,text:{name:'Magic Trap',desc:'Alternate Yrden mode — stationary trap damages enemies and destroys incoming projectiles.',ranks:['Trap enabled; dmg+slow in 10yd radius; stam regen +0.5/s','Radius 12yd; dmg +25%; stam regen +1/s','Radius 14yd; dmg +50%; stam regen +1.5/s']}},
  supercharged_glyphs: {icon:'⚡',color:'blue',max:3,text:{name:'Supercharged Glyphs',desc:'Enemies under Yrden influence lose Vitality each second.',ranks:['−10 vitality/s; stam regen +0.5/s','−20 vitality/s; stam regen +1/s','−30 vitality/s; stam regen +1.5/s']}},
  yrden_intensity:     {icon:'🔮',color:'blue',max:3,text:{name:'Yrden Intensity',desc:'Increases Yrden Sign intensity.',ranks:['Yrden intensity +5%; stam regen +0.5/s','Yrden intensity +10%; stam regen +1/s','Yrden intensity +15%; stam regen +1.5/s']}},

  exploding_shield:    {icon:'💣',color:'blue',max:3,text:{name:'Exploding Shield',desc:'When the Quen shield breaks it pushes enemies back. Higher ranks add damage and knockdown.',ranks:['Shield breaks: push back; stam regen +0.5/s','Push back + deals damage; stam regen +1/s','Push back + damage + knockdown chance; stam regen +1.5/s']}},
  active_shield:       {icon:'🛡',color:'blue',max:3,text:{name:'Active Shield',desc:'Alternate Quen mode — sustained shield that absorbs damage and restores Vitality. Stamina drains while held.',ranks:['Sustained shield; absorbed dmg restores vitality; stam regen +0.5/s','Shield stamina drain −50%; stam regen +1/s','No stamina drain while maintaining; stam regen +1.5/s']}},
  quen_discharge:      {icon:'🌟',color:'blue',max:3,text:{name:'Quen Discharge',desc:'Reflects a percentage of absorbed damage back at the attacker.',ranks:['5% dmg reflected; stam regen +0.5/s','10% reflected; stam regen +1/s','15% reflected; stam regen +1.5/s']}},
  quen_intensity:      {icon:'✨',color:'blue',max:3,text:{name:'Quen Intensity',desc:'Increases Quen Sign intensity (larger shield capacity).',ranks:['Quen intensity +5%; stam regen +0.5/s','Quen intensity +10%; stam regen +1/s','Quen intensity +15%; stam regen +1.5/s']}},

  delusion:            {icon:'🧿',color:'blue',max:3,text:{name:'Delusion',desc:'Enhances Axii in combat AND unlocks Axii dialogue persuasion options (essential for XP & story).',ranks:['Target stays still while casting; dialogue option T1; stam regen +0.5/s','Casting time reduced; dialogue T2; stam regen +1/s','Dialogue T3 (max effectiveness); stam regen +1.5/s']}},
  puppet:              {icon:'🤡',color:'blue',max:3,text:{name:'Puppet',desc:'Alternate Axii mode — targeted enemy becomes a temporary ally dealing bonus damage.',ranks:['Ally for 15s; +20% dmg; stam regen +0.5/s','Ally for 20s; +40% dmg; stam regen +1/s','Ally for 30s; +60% dmg; stam regen +1.5/s']}},
  domination:          {icon:'👑',color:'blue',max:3,text:{name:'Domination',desc:'Axii can affect 2 enemies simultaneously. Effect is weaker per target.',ranks:['2 targets; effect −50%; stam regen +0.5/s','2 targets; effect −25%; stam regen +1/s','2 targets; full effect; stam regen +1.5/s']}},
  axii_intensity:      {icon:'👁',color:'blue',max:3,text:{name:'Axii Intensity',desc:'Increases Axii Sign intensity.',ranks:['Axii intensity +5%; stam regen +0.5/s','Axii intensity +10%; stam regen +1/s','Axii intensity +15%; stam regen +1.5/s']}},

  // ── ALCHEMY ──
  heightened_tolerance:{icon:'🧪',color:'green',max:3,text:{name:'Heightened Tolerance',desc:'Increases the potion overdose threshold (base 50%). Also boosts potion duration and bomb damage.',ranks:['Threshold 50%→60%; duration & bomb dmg +5%','Threshold 50%→70%; duration & bomb dmg +10%','Threshold 50%→80%; duration & bomb dmg +15%']}},
  refreshment:         {icon:'💧',color:'green',max:3,text:{name:'Refreshment',desc:'Each potion dose ingested heals a percentage of max Vitality.',ranks:['Heal 10% max Vitality; duration & bomb dmg +5%','Heal 20%; duration & bomb dmg +10%','Heal 30%; duration & bomb dmg +15%']}},
  delayed_recovery:    {icon:'⏳',color:'green',max:3,text:{name:'Delayed Recovery',desc:'Potion effects do not expire until toxicity drops below a threshold.',ranks:['Active until tox <90%; duration +5%','Active until tox <80%; duration +10%','Active until tox <70%; duration +15%']}},
  side_effects:        {icon:'🌀',color:'green',max:3,text:{name:'Side Effects',desc:'Consuming a potion has a chance to also activate another random potion\'s effects at no toxicity cost.',ranks:['20% chance; duration +5%','40% chance; duration +10%','60% chance; duration +15%']}},

  poisoned_blades:     {icon:'🐍',color:'green',max:3,text:{name:'Poisoned Blades',desc:'Oil applied to blades gives a chance to poison the target on each hit.',ranks:['5% poison chance; duration & bomb dmg +5%','10% poison chance; duration & bomb dmg +10%','15% poison chance; duration & bomb dmg +15%']}},
  protective_coating:  {icon:'🛡',color:'green',max:3,text:{name:'Protective Coating',desc:'Applying an oil grants resistance to attacks from the matching monster type.',ranks:['+5% resistance while oil applied; duration & bomb dmg +5%','+10%; duration & bomb dmg +10%','+15%; duration & bomb dmg +15%']}},
  fixative:            {icon:'🔒',color:'green',max:3,text:{name:'Fixative',desc:'Oils applied to blades have greatly increased charges; at max rank they do not wear off. Higher ranks allow multiple oils on a sword.',ranks:['Oil charges +33%; duration +5%','Oil charges +67%; 2 oils on sword; duration +10%','Oils do not wear off; 3 oils on sword; duration +15%']}},
  hunter_instinct:     {icon:'🦅',color:'green',max:3,text:{name:'Hunter Instinct',desc:'When Adrenaline is at max, critical hit damage against the oil\'s target monster type is increased.',ranks:['Crit dmg vs target +20%; duration +5%','Crit dmg +40%; duration +10%','Crit dmg +60%; duration +15%']}},

  steady_aim:          {icon:'⌚',color:'green',max:1,text:{name:'Steady Aim',desc:'Time slows by 50% while aiming bombs, making precise throws easier.',ranks:['Time slowed 50% while aiming; duration & bomb dmg +5%']}},
  pyrotechnics:        {icon:'💣',color:'green',max:3,text:{name:'Pyrotechnics',desc:'All bombs, even non-damaging ones, deal additional damage.',ranks:['All bombs +50 dmg; duration & bomb dmg +5%','+100 dmg; duration & bomb dmg +10%','+150 dmg; duration & bomb dmg +15%']}},
  efficiency:          {icon:'📦',color:'green',max:3,text:{name:'Efficiency',desc:'Increases the maximum number of bombs per slot.',ranks:['Max bombs per slot +1; duration +5%','+2; duration +10%','+3; duration +15%']}},
  cluster_bombs:       {icon:'💥',color:'green',max:3,text:{name:'Cluster Bombs',desc:'Upon detonation, bombs separate into additional explosive fragments.',ranks:['2 fragments on detonation; duration +5%','3 fragments; duration +10%','4 fragments; duration +15%']}},

  acquired_tolerance:  {icon:'⚗',color:'green',max:3,text:{name:'Acquired Tolerance',desc:'Every known alchemy formula increases maximum Toxicity by 0.5.',ranks:['Each known Lvl1 formula +0.5 tox; duration & bomb dmg +5%','Lvl1 & Lvl2 formulas +0.5; duration & bomb dmg +10%','All formulas (any level) +0.5; duration & bomb dmg +15%']}},
  tissue_transmutation:{icon:'🧬',color:'green',max:3,text:{name:'Tissue Transmutation',desc:'Consuming a mutagen decoction increases maximum Vitality for the decoction\'s duration.',ranks:['+300 max Vitality during decoction; duration & bomb dmg +5%','+600 max Vitality; duration & bomb dmg +10%','+900 max Vitality; duration & bomb dmg +15%']}},
  synergy:             {icon:'🔗',color:'green',max:3,text:{name:'Synergy',desc:'Increases the bonus granted by mutagens placed in mutagen slots. Must-have for any build using mutagens.',ranks:['Mutagen bonus +10%; duration +5%','Mutagen bonus +20%; duration +10%','Mutagen bonus +30%; duration +15%']}},
  adaptation:          {icon:'🌿',color:'green',max:3,text:{name:'Adaptation',desc:'Extends the effective duration of all mutagen decoctions.',ranks:['Decoction duration +10%; potion duration +5%','Decoction duration +20%; +10%','Decoction duration +30%; +15%']}},

  frenzy:              {icon:'😈',color:'green',max:3,text:{name:'Frenzy',desc:'If Toxicity > 0, time automatically slows when an enemy is about to counterattack.',ranks:['Slow enabled when tox >0; duration & bomb dmg +5%','Slow effect stronger; duration & bomb dmg +10%','Slow effect maximized; duration & bomb dmg +15%']}},
  endure_pain:         {icon:'💪',color:'green',max:3,text:{name:'Endure Pain',desc:'Increases maximum Vitality when Toxicity exceeds the safe threshold.',ranks:['Vitality +10% over threshold; duration & bomb dmg +5%','+20%; duration & bomb dmg +10%','+30%; duration & bomb dmg +15%']}},
  fast_metabolism:     {icon:'⚡',color:'green',max:3,text:{name:'Fast Metabolism',desc:'Toxicity drops faster over time, allowing more frequent potion use.',ranks:['Tox −1pt/s faster; duration +5%','Tox −2pt/s faster; duration +10%','Tox −3pt/s faster; duration +15%']}},
  killing_spree:       {icon:'💀',color:'green',max:3,text:{name:'Killing Spree',desc:'If Toxicity > 0, each enemy killed increases critical hit chance for the duration of that fight.',ranks:['Crit +10% per kill when tox >0; duration +5%','Crit +20% per kill; duration +10%','Crit +30% per kill; duration +15%']}},

  // ── GENERAL (all rank 1, no tier) ──
  sun_and_stars:       {icon:'☀',color:'brown',max:1,text:{name:'Sun and Stars',desc:'Day: Vitality regenerates +10/s when not in combat. Night: Stamina regenerates +1/s during combat.',ranks:['Day: +10 vitality/s out of combat. Night: +1 stamina/s in combat.']}},
  survival_instinct:   {icon:'❤',color:'brown',max:1,text:{name:'Survival Instinct',desc:'Increases maximum Vitality by 15%. (Was +500 flat prior to Patch 4.0)',ranks:['Max Vitality +15%']}},
  cat_school:          {icon:'🐱',color:'brown',max:1,text:{name:'Cat School Techniques',desc:'Each piece of light armor: +25% critical hit damage and +5% fast attack damage.',ranks:['Light armor: crit dmg +25%, fast atk dmg +5% per piece']}},
  griffin_school:      {icon:'🦅',color:'brown',max:1,text:{name:'Griffin School Techniques',desc:'Each piece of medium armor: +5% Sign intensity and +5% Stamina regeneration.',ranks:['Medium armor: sign intensity +5%, stamina regen +5% per piece']}},
  bear_school:         {icon:'🐻',color:'brown',max:1,text:{name:'Bear School Techniques',desc:'Each piece of heavy armor: +5% strong attack damage and +5% maximum Vitality.',ranks:['Heavy armor: strong atk dmg +5%, max Vitality +5% per piece']}},
  steady_shot_gen:     {icon:'🏹',color:'brown',max:1,text:{name:'Steady Shot',desc:'Crossbow bolts deal 25% more damage.',ranks:['Crossbow bolt damage +25%']}},
  rage_management:     {icon:'😠',color:'brown',max:1,text:{name:'Rage Management',desc:'Signs can be cast using Adrenaline Points when Stamina is too low.',ranks:['Signs usable via AP when Stamina depleted']}},
  adrenaline_burst:    {icon:'⚡',color:'brown',max:1,text:{name:'Adrenaline Burst',desc:'Using Signs now generates Adrenaline Points. Overall AP generation +5%.',ranks:['Sign use generates AP; overall AP gen +5%']}},
  focus:               {icon:'🎯',color:'brown',max:1,text:{name:'Focus',desc:'Adrenaline Points also increase Sign damage and intensity in addition to weapon damage.',ranks:['Each AP boosts weapon dmg and sign intensity']}},
  metabolic_control:   {icon:'🧬',color:'brown',max:1,text:{name:'Metabolic Control',desc:'Increases maximum Toxicity by 30 flat.',ranks:['Max Toxicity +30']}},
  metabolism_boost:    {icon:'⚗',color:'brown',max:1,text:{name:'Metabolism Boost',desc:'If available, Adrenaline Points are consumed to reduce Toxicity cost of drinking potions by 33% per point. Does not affect mutagen decoctions.',ranks:['Potion toxicity cost −33% per AP consumed (not decoctions)']}},
  trick_shot:          {icon:'🎪',color:'brown',max:1,text:{name:'Trick Shot',desc:'Allows firing one additional bolt before reloading the crossbow.',ranks:['Fire 1 extra bolt before reload']}},
  advanced_pyrotechnics:{icon:'🎆',color:'brown',max:1,text:{name:'Advanced Pyrotechnics',desc:'Damage dealt by bomb explosions generates Adrenaline Points.',ranks:['Bomb explosion dmg generates +0.1 AP']}},
  combats_fires:       {icon:'🤜',color:'brown',max:1,text:{name:"Combat's Fires",desc:'You ignore bomb and special bolt effects.',ranks:['Ignore all bomb and special bolt effects on Geralt']}},
  battle_frenzy:       {icon:'💢',color:'brown',max:1,text:{name:'Battle Frenzy',desc:'Instead of its previous effect, Battle Trance now increases critical hit chance by 8% per Adrenaline Point.',ranks:['Crit chance +8% per Adrenaline Point (replaces Battle Trance weapon dmg bonus)']}},
  heavy_artillery:     {icon:'💥',color:'brown',max:1,text:{name:'Heavy Artillery',desc:'Bomb damage is tripled — but the number of bombs in slots is decreased by half. Does not apply to bombs which deal no damage.',ranks:['Bomb dmg ×3; bombs per slot ÷2 (no-damage bombs unaffected)']}},
  gorged_on_power:     {icon:'🗿',color:'brown',max:1,text:{name:'Gorged on Power',desc:'The bonus from a Place of Power lasts indefinitely — but only one such bonus can be active at a given time.',ranks:['Place of Power bonus is permanent (only 1 active at a time)']}},
  attack_best_defense: {icon:'🛡',color:'brown',max:1,text:{name:'Attack is the Best Defense',desc:'Each defensive action generates Adrenaline Points: Parries +0.1, Counterattacks +0.4, Dodges +0.3, Rolls +0.2. Cannot activate more than once every 5 seconds.',ranks:['Parry +0.1 AP, Counterattack +0.4 AP, Dodge +0.3 AP, Roll +0.2 AP (5s cooldown)']}},
  gourmet:             {icon:'🍖',color:'brown',max:1,text:{name:'Gourmet',desc:'Eating food regenerates Vitality for 20 real-life minutes instead of just a few seconds. One of the most powerful early-game skills.',ranks:['Food regenerates Vitality for 20 minutes']}},
  strong_back:         {icon:'🧳',color:'brown',max:1,text:{name:'Strong Back',desc:'Increases maximum inventory weight by 60, doubling the base carry limit.',ranks:['Max carry weight +60']}},
};

// ═══════════════════════════════════════════════════════════
// MUTATIONS
// text: { name, desc } — i18n-ready wrapper
// ═══════════════════════════════════════════════════════════
const MUTATIONS = [
  {id:'euphoria',types:['alchemy'],text:{name:'Euphoria',desc:'Each point of Toxicity increases damage dealt by swords and Sign Intensity by 0.75% (to a maximum of 75%).'}},
  {id:'metamorphosis',types:['combat','signs','alchemy'],text:{name:'Metamorphosis',desc:'Applying critical effects to opponents activates a random decoction for 120s with no Toxicity cost. The maximum number of decoctions that can be activated simultaneously by the mutation is 3.'}},
  {id:'piercing_cold',types:['signs'],text:{name:'Piercing Cold',desc:'When the Aard Sign is cast, it additionally has a 25% chance of freezing opponents. Opponents knocked down and frozen simultaneously die immediately. Opponents who are not frozen are dealt additional damage.'}},
  {id:'mutated_skin',types:['combat','alchemy'],text:{name:'Mutated Skin',desc:'Each Adrenaline Point decreases damage received by 15% (to a maximum of 45%).'}},
  {id:'bloodbath',types:['combat'],text:{name:'Bloodbath',desc:'Each fatal blow dealt by a sword dismembers the enemy or activates a finisher. Each blow dealt by a weapon in melee combat increases Attack Power by 5% until combat ends (to a maximum of 250%). The bonus is lost if you take damage (not including damage from Toxicity).'}},
  {id:'conductors_magic',types:['signs','combat'],text:{name:'Conductors of Magic',desc:'When drawn, magic, unique and witcher swords increase Sign damage dealt by 50% of their own damage dealt.'}},
  {id:'magic_sensibilities',types:['signs'],text:{name:'Magic Sensibilities',desc:'Signs can deal critical hits. Their critical hit chance and damage increase with Sign Intensity. Opponents killed by critical hits from Signs explode.'}},
  {id:'toxic_blood',types:['alchemy'],text:{name:'Toxic Blood',desc:'Each time you are injured in melee combat, the attacking opponent receives damage in the amount of 1.5% of damage dealt for every point of your Toxicity level (to a maximum of 150%).'}},
];
