# Spec: Skills Data

This file is the authoritative reference for all game data. When modifying skill names, descriptions, rank effects, or tier positions, this file takes precedence. Source: witcher.fandom.com (Patch 4.0).

---

## JS data structure

Skills are defined in `const SKILLS` (flat lookup by id) and `const TREES` (grid structure).

```js
// SKILLS entry shape
'skill_id': {
  // Structural properties (non-translatable)
  icon: '🔥',          // emoji used as icon
  color: 'red',        // 'red' | 'blue' | 'green' | 'brown'
  max: 3,              // max rank (always 3 for investable skills, 1 for general)

  // Translatable text — wrapped in a `text` object for i18n readiness
  text: {
    name: 'Display Name',
    desc: 'Short description shown when rank = 0',
    ranks: [           // one entry per rank (length must equal max)
      'Rank 1 effect text',
      'Rank 2 effect text',
      'Rank 3 effect text',
    ]
  }
}

// TREES entry shape (per tree)
{
  color: 'red',
  cols: ['COL1 NAME', ...],   // 5 column headers
  rootNote: '...',            // combat only — Battle Trance passive description
  tiers: [                    // 4 entries, one per tier row
    { req: 0,  label: 'TIER I' },
    { req: 6,  label: 'TIER II' },
    { req: 12, label: 'TIER III' },
    { req: 18, label: 'TIER IV' },
  ],
  grid: [                     // [colIndex][tierIndex] = skill id string
    ['t1_skill', 't2_skill', 't3_skill', 't4_skill'],  // col 0
    ['t1_skill', 't2_skill', 't3_skill', 't4_skill'],  // col 1
    // ... 5 columns total
  ]
}
```

---

## Combat tree

**Columns:** Fast Attack | Strong Attack | Defense | Marksmanship | Battle Trance

**Root passive (always active, not investable):**
> Battle Trance: Sword blows generate Adrenaline Points. Each AP increases melee weapon damage by 10%.

### Grid — combat (col × tier)

| Tier | Fast Attack | Strong Attack | Defense | Marksmanship | Battle Trance |
|------|-------------|---------------|---------|--------------|---------------|
| T1 (0 pts) | muscle_memory | strength_training | arrow_deflection | lightning_reflexes | resolve |
| T2 (6 pts) | precise_blows | crushing_blows | fleet_footed | cold_blood | undying |
| T3 (12 pts) | whirl | rend | counterattack | anatomical_knowledge | razor_focus |
| T4 (18 pts) | crippling_strikes | sunder_armor | deadly_precision | crippling_shot | flood_of_anger |

### Combat skill definitions

**muscle_memory** — Muscle Memory — Fast attack dmg +5/10/15%; AP gain +1/2/3%
**precise_blows** — Precise Blows — Fast crit +2/4/6%, crit dmg +15/30/45%; AP +1/2/3%
**whirl** — Whirl — Alternate spinning fast attack hitting all nearby. Stamina/AP cost. Dmg +5/10/15%; AP +1/2/3%
**crippling_strikes** — Crippling Strikes — Fast attacks inflict Bleed (25 vit/s, 5s). AP +1/2/3%
**strength_training** — Strength Training — Strong atk dmg +5/10/15%; AP +1/2/3%
**crushing_blows** — Crushing Blows — Strong crit +2/4/6%, crit dmg +15/30/45%; AP +1/2/3%
**rend** — Rend — Charged strong attack, ignores defense, +10% crit, AP boosts total dmg 100%. Range +1m at R2. Charge speed +25% at R3
**sunder_armor** — Sunder Armor — Strong attacks permanently reduce enemy damage resistance by 5/10/15% per hit; AP +1/2/3%
**arrow_deflection** — Arrow Deflection — Parrying deflects arrows. R2: deflected arrows stagger shooter. R3: deflected arrows damage shooter
**fleet_footed** — Fleet Footed — Damage taken while dodging −20/60/100%; AP +1/2/3%
**counterattack** — Counterattack — After successful counter, next attack deals +30/60/90% damage; AP +1/2/3%
**deadly_precision** — Deadly Precision — Each AP adds +1/2/3% instant kill chance; AP +1/2/3%
**lightning_reflexes** — Lightning Reflexes — Time slowed +15/30/45% extra when aiming crossbow; AP +1/2/3%
**cold_blood** — Cold Blood — Each crossbow hit generates +0.04/0.06/0.08 AP; AP gen +1/2/3%
**anatomical_knowledge** — Anatomical Knowledge — Crossbow crit chance +5/10/15%; AP +1/2/3%
**crippling_shot** — Crippling Shot — Crossbow crits disable monster special abilities for 5/7/10s; AP +1/2/3%
**resolve** — Resolve — AP loss on taking damage −20/60/100%; AP gen +1/2/3%
**undying** — Undying — Vitality hits 0 → AP consumed to restore vitality (×1/2/3 per AP); AP gen +1/2/3%
**razor_focus** — Razor Focus — +1 AP on combat start; sword AP gen +5/10/15%; total AP gen +1/2/3%
**flood_of_anger** — Flood of Anger — Casting a sign spends 3 AP to upgrade sign to max level and boost intensity +25/50/75%; AP gen +1/2/3%

---

## Signs tree

**Columns:** Aard | Igni | Yrden | Quen | Axii

### Grid — signs (col × tier)

| Tier | Aard | Igni | Yrden | Quen | Axii |
|------|------|------|-------|------|------|
| T1 (0 pts) | far_reaching_aard | melt_armor | sustained_glyphs | exploding_shield | delusion |
| T2 (6 pts) | aard_sweep | firestream | magic_trap | active_shield | puppet |
| T3 (12 pts) | shock_wave | pyromaniac | supercharged_glyphs | quen_discharge | domination |
| T4 (18 pts) | aard_intensity | igni_intensity | yrden_intensity | quen_intensity | axii_intensity |

### Signs skill definitions

**far_reaching_aard** — Far-Reaching Aard — Aard range +1/2/3m; stam regen +0.5/1/1.5/s
**aard_sweep** — Aard Sweep — Alternate mode: 360° blast. Knockdown chance +5/10/15%; stam regen +0.5/1/1.5/s
**shock_wave** — Shock Wave — Aard deals 40/80/120 damage to knocked-down/staggered enemies; stam regen +0.5/1/1.5/s
**aard_intensity** — Aard Intensity — Aard intensity +5/10/15%; stam regen +0.5/1/1.5/s
**melt_armor** — Melt Armor — Igni permanently reduces enemy armor per hit (max 15/45/75%); stam regen +0.5/1/1.5/s
**firestream** — Firestream — Alternate mode: continuous fire stream. Burn chance +5/10/15%; stam regen +0.5/1/1.5/s
**pyromaniac** — Pyromaniac — Igni burn chance +20/40/60%; stam regen +0.5/1/1.5/s
**igni_intensity** — Igni Intensity — Igni intensity +5/10/15%; stam regen +0.5/1/1.5/s
**sustained_glyphs** — Sustained Glyphs — Yrden duration +5/10s; 2/3 simultaneous alt traps. Max rank 2
**magic_trap** — Magic Trap — Alternate mode: stationary trap damages enemies and destroys projectiles. Radius 10/12/14yd; dmg +0/25/50%
**supercharged_glyphs** — Supercharged Glyphs — Enemies in Yrden lose −10/20/30 vitality/s; stam regen +0.5/1/1.5/s
**yrden_intensity** — Yrden Intensity — Yrden intensity +5/10/15%; stam regen +0.5/1/1.5/s
**exploding_shield** — Exploding Shield — Quen breaks with explosion + knockback. R2: +50% explosion dmg. R3: +100% + stun chance
**active_shield** — Active Shield — Alternate Quen: sustained shield converts absorbed dmg to 30/60/100% vitality; stam drain while active (R3: no drain when idle)
**quen_discharge** — Quen Discharge — 5/10/15% of absorbed damage reflected to attacker
**quen_intensity** — Quen Intensity — Quen intensity +5/10/15%; stam regen +0.5/1/1.5/s
**delusion** — Delusion — Axii in combat enhanced + unlocks Axii dialogue persuasion options (T1/T2/T3 dialogue tiers); stam regen +0.5/1/1.5/s
**puppet** — Puppet — Alternate Axii: target becomes ally for 15/20/30s dealing +20/40/60% dmg; stam regen +0.5/1/1.5/s
**domination** — Domination — Axii affects 2 targets simultaneously. Effect penalty −50/25/0%; stam regen +0.5/1/1.5/s
**axii_intensity** — Axii Intensity — Axii intensity +5/10/15%; stam regen +0.5/1/1.5/s

---

## Alchemy tree

**Columns:** Brewing | Oil Preparation | Bomb Creation | Mutation | Trial of the Grasses

### Grid — alchemy (col × tier)

| Tier | Brewing | Oil Preparation | Bomb Creation | Mutation | Trial of the Grasses |
|------|---------|-----------------|---------------|----------|----------------------|
| T1 (0 pts) | heightened_tolerance | poisoned_blades | steady_aim | acquired_tolerance | frenzy |
| T2 (6 pts) | refreshment | protective_coating | pyrotechnics | tissue_transmutation | endure_pain |
| T3 (12 pts) | delayed_recovery | fixative | efficiency | synergy | fast_metabolism |
| T4 (18 pts) | side_effects | hunter_instinct | cluster_bombs | adaptation | killing_spree |

### Alchemy skill definitions

**heightened_tolerance** — Heightened Tolerance — Overdose threshold +1/2/3%; potion duration +5/10/15%
**refreshment** — Refreshment — Drinking a potion heals 5/10/15% max Vitality; potion duration +5/10/15%
**delayed_recovery** — Delayed Recovery — Potions stay active until toxicity drops below 90/70/55% max; potion duration +5/10/15%
**side_effects** — Side Effects — 20/40/60% chance drinking a potion also activates another random potion for free; duration +5/10/15%
**poisoned_blades** — Poisoned Blades — Oil on blade gives 3/6/9% poison chance per hit; duration +5/10/15%
**protective_coating** — Protective Coating — Applying oil grants +5/10/15% resistance to that monster type; duration +5/10/15%
**fixative** — Fixative — Oil charges ×1.33/1.67; R3: oils do not degrade until resting; duration +5/10/15%
**hunter_instinct** — Hunter Instinct — When AP is max, crit dmg vs oil-target monster type +20/40/60%; duration +5/10/15%
**steady_aim** — Steady Aim — Time slowed 15/30/45% while aiming bombs; duration +5/10/15%
**pyrotechnics** — Pyrotechnics — Non-damaging bombs deal +30/60/90 bonus damage; duration +5/10/15%
**efficiency** — Efficiency — Max bombs per slot +1/2/3; duration +5/10/15%
**cluster_bombs** — Cluster Bombs — Bombs split into 2/3/4 fragments on detonation; duration +5/10/15%
**acquired_tolerance** — Acquired Tolerance — Each known alchemy formula +1 max Toxicity (T1: Lvl1 only; T2: Lvl1+2; T3: all levels); duration +5/10/15%
**tissue_transmutation** — Tissue Transmutation — Active decoction grants +200/400/600 max Vitality for its duration; potion duration +5/10/15%
**synergy** — Synergy — Mutagen slot bonus +10/20/30%; potion duration +5/10/15%
**adaptation** — Adaptation — Decoction duration +10/20/30%; potion duration +5/10/15%
**frenzy** — Frenzy — If toxicity >0, time slows when enemy is about to counterattack. R2+: effect stronger; duration +5/10/15%
**endure_pain** — Endure Pain — When toxicity exceeds safe threshold, max Vitality +10/20/30%; duration +5/10/15%
**fast_metabolism** — Fast Metabolism — Toxicity drops 1/2/3pt/s faster; duration +5/10/15%
**killing_spree** — Killing Spree — If toxicity >0, each kill gives +10/20/30% crit chance for the fight; duration +5/10/15%

---

## General skills

20 skills, all rank 1, no tier gate, color 'brown'. Displayed as a 4-column grid.

| ID | Name | Effect |
|----|------|--------|
| sun_and_stars | Sun and Stars | Day: +10 Vitality/s out of combat. Night: +1 Stamina/s in combat |
| steady_shot_gen | Steady Shot | Crossbow bolt damage +25% |
| metabolism_boost | Metabolism Boost | AP consumed reduces potion Toxicity cost by 33% per point (not decoctions) |
| gorged_on_power | Gorged on Power | Place of Power bonus lasts indefinitely; only 1 active at a time |
| survival_instinct | Survival Instinct | Max Vitality +15% (was +500 flat pre-Patch 4.0) |
| rage_management | Rage Management | Signs can be cast using AP when Stamina is too low |
| trick_shot | Trick Shot | Fire 1 extra crossbow bolt before reloading |
| gourmet | Gourmet | Food regenerates Vitality for 20 real-time minutes |
| cat_school | Cat School Techniques | Each light armor piece: crit dmg +25%, fast atk dmg +5% |
| adrenaline_burst | Adrenaline Burst | Sign use generates AP; overall AP gen +5% |
| advanced_pyrotechnics | Advanced Pyrotechnics | Bomb explosion damage generates +0.1 AP |
| combats_fires | Combat's Fires | You ignore bomb and special bolt effects |
| griffin_school | Griffin School Techniques | Each medium armor piece: sign intensity +5%, stamina regen +5% |
| focus | Focus | Each AP boosts both weapon damage and sign intensity |
| battle_frenzy | Battle Frenzy | Battle Trance now gives +8% crit chance per AP (replaces weapon dmg bonus) |
| heavy_artillery | Heavy Artillery | Bomb damage ×3; bombs per slot ÷2 (no-damage bombs unaffected) |
| bear_school | Bear School Techniques | Each heavy armor piece: strong atk dmg +5%, max Vitality +5% |
| metabolic_control | Metabolic Control | Max Toxicity +30 |
| strong_back | Strong Back | Max carry weight +60 |
| attack_best_defense | Attack is the Best Defense | Defensive actions generate AP: Parry +0.1, Counterattack +0.4, Dodge +0.3, Roll +0.2 (5s cooldown) |

---

## Blood & Wine Mutations

8 mutations. Only 1 active at a time. Requires completing "Turn and Face the Strange" questline in the Blood & Wine DLC.

The `types` array on each mutation drives the conic-gradient colors on the mutation circle and determines which skill colors are accepted in bonus slots.

| ID | Name | Types | Effect |
|----|------|-------|--------|
| euphoria | Euphoria | alchemy | Each toxicity point: sword dmg and sign intensity +0.75% |
| metamorphosis | Metamorphosis | combat, signs, alchemy | Critical effects trigger random free decoctions for 120s (up to 5 simultaneously) |
| piercing_cold | Piercing Cold | signs | Aard 30% freeze chance; knocked-down + frozen = instant death |
| mutated_skin | Mutated Skin | combat, alchemy | Each AP reduces damage taken by 15% (max 45%) |
| bloodbath | Bloodbath | combat | Each kill: attack power +5% until Geralt takes damage (max 25 stacks) |
| conductors_magic | Conductors of Magic | signs, combat | Sword attacks deal bonus damage equal to a % of sign intensity |
| magic_sensibilities | Magic Sensibilities | signs | Sword crits trigger a random sign effect for free |
| toxic_blood | Toxic Blood | alchemy | Taking damage deals toxicity-scaled damage back to the attacker |

---

## Mutagen slots

4 groups × 3 skill slots = 12 active slots total. Each group has 1 mutagen socket.

**Mutagen types:**
- Greater Red Mutagen → +Attack Power (base +5%; scales with synergy and matching skills)
- Greater Blue Mutagen → +Sign Intensity (base +5%)
- Greater Green Mutagen → +Vitality (base +250)

**Synergy rule:** Each skill slot in a group whose color matches the group's mutagen color increases the mutagen bonus by 100%. With all 3 slots matching: +300% total (×4 of base). The Synergy skill (alchemy) adds a further +10/20/30% on top.

**Color matching:** Red mutagen → Combat (red) skills. Blue → Signs (blue). Green → Alchemy (green). General (brown) skills never contribute to color synergy.

---

## Slot unlock levels

Active skill slots unlock as Geralt levels up:

| Slot # | Level required |
|--------|---------------|
| 1 | 1 |
| 2 | 2 |
| 3 | 4 |
| 4 | 6 |
| 5 | 8 |
| 6 | 10 |
| 7 | 12 |
| 8 | 15 |
| 9 | 18 |
| 10 | 22 |
| 11 | 26 |
| 12 | 30 |

Mutagen slots unlock at levels: 3, 9, 16, 28 (one per group).
