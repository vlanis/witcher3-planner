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

**muscle_memory** — Muscle Memory — Fast attack dmg +10/20/30%; AP gain +1/2/3%
**precise_blows** — Precise Blows — Fast crit +4/8/12%, crit dmg +25/50/75%; AP +1/2/3%
**whirl** — Whirl — Alternate spinning fast attack hitting all nearby. Stamina/AP cost. R2: cost −33%. R3: cost −50%; AP +1/2/3%
**crippling_strikes** — Crippling Strikes — Fast attacks inflict Bleed (50/100/150 vit/s, 5s). AP +1/2/3%
**strength_training** — Strength Training — Strong atk dmg +10/20/30%; AP +1/2/3%
**crushing_blows** — Crushing Blows — Strong crit +4/8/12%, crit dmg +25/50/75%; AP +1/2/3%
**rend** — Rend — Charged strong attack, ignores defense. Crit chance +20/40/60%. AP boosts total dmg 33%; AP +1/2/3%
**sunder_armor** — Sunder Armor — Strong attacks permanently reduce enemy damage resistance by 10/20/30% per hit; AP +1/2/3%
**arrow_deflection** — Arrow Deflection — Max rank 2. R1: parrying deflects arrows. R2: perfectly timed parries reflect arrows back at shooter
**fleet_footed** — Fleet Footed — Max rank 1. Damage taken while dodging −100%; AP +1%
**counterattack** — Counterattack — After successful counter, next attack +30/60/90% dmg. R2 adds knockdown chance. R3 makes it a crit + knockdown; AP +1/2/3%
**deadly_precision** — Deadly Precision — Max rank 2. Each AP adds +1/2% instant kill chance; AP +1/2%
**lightning_reflexes** — Lightning Reflexes — Max rank 1. Time slowed +50% while aiming crossbow; AP +1%
**cold_blood** — Cold Blood — Each crossbow hit generates +0.1/0.2/0.3 AP; AP gen +1/2/3%
**anatomical_knowledge** — Anatomical Knowledge — Crossbow crit chance +20/40/60%; AP +1/2/3%
**crippling_shot** — Crippling Shot — Crossbow crits disable monster special abilities for 10/20/30s; AP +1/2/3%
**resolve** — Resolve — AP loss on taking damage −33/67/100%; AP gen +1/2/3%
**undying** — Undying — Vitality hits 0 → AP consumed to restore vitality. R2: +33% bonus. R3: +67% bonus; AP gen +1/2/3%
**razor_focus** — Razor Focus — +1 AP on combat start; sword AP gen +10/20/30%; total AP gen +1/2/3%
**flood_of_anger** — Flood of Anger — Casting a sign spends 3 AP to upgrade sign to max level and boost intensity +100/200/300%; AP gen +1/2/3%

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
**aard_sweep** — Aard Sweep — Alternate mode: 360° blast. Knockdown chance is −21% at R1, −17% at R2, full at R3; stam regen +0.5/1/1.5/s
**shock_wave** — Shock Wave — Aard deals 100/200/300 damage (scales with enemy level at R3); stam regen +0.5/1/1.5/s
**aard_intensity** — Aard Intensity — Aard intensity +5/10/15%; stam regen +0.5/1/1.5/s
**melt_armor** — Melt Armor — Igni permanently reduces enemy armor per hit (max 15/30/45%); stam regen +0.5/1/1.5/s
**firestream** — Firestream — Alternate mode: continuous fire stream. R2: stamina cost −25%. R3: −50%; stam regen +0.5/1/1.5/s
**pyromaniac** — Pyromaniac — Igni burn chance +20/40/60%; stam regen +0.5/1/1.5/s
**igni_intensity** — Igni Intensity — Igni intensity +5/10/15%; stam regen +0.5/1/1.5/s
**sustained_glyphs** — Sustained Glyphs — Yrden duration +5/10s; 2/3 simultaneous alt traps. Max rank 2
**magic_trap** — Magic Trap — Alternate mode: stationary trap damages enemies and destroys projectiles. Radius 10/12/14yd; dmg +0/25/50%
**supercharged_glyphs** — Supercharged Glyphs — Enemies in Yrden lose −10/20/30 vitality/s; stam regen +0.5/1/1.5/s
**yrden_intensity** — Yrden Intensity — Yrden intensity +5/10/15%; stam regen +0.5/1/1.5/s
**exploding_shield** — Exploding Shield — Quen breaks: push back. R2: + deals damage. R3: + knockdown chance
**active_shield** — Active Shield — Alternate Quen: sustained shield; absorbed dmg restores vitality. R2: stamina drain −50%. R3: no stamina drain while maintaining
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

**heightened_tolerance** — Heightened Tolerance — Overdose threshold (base 50%) raised to 60/70/80%; potion duration & bomb dmg +5/10/15%
**refreshment** — Refreshment — Drinking a potion heals 10/20/30% max Vitality; potion duration & bomb dmg +5/10/15%
**delayed_recovery** — Delayed Recovery — Potions stay active until toxicity drops below 90/80/70% max; potion duration +5/10/15%
**side_effects** — Side Effects — 20/40/60% chance drinking a potion also activates another random potion for free; duration +5/10/15%
**poisoned_blades** — Poisoned Blades — Oil on blade gives 5/10/15% poison chance per hit; duration & bomb dmg +5/10/15%
**protective_coating** — Protective Coating — Applying oil grants +5/10/15% resistance to that monster type; duration & bomb dmg +5/10/15%
**fixative** — Fixative — Oil charges +33/67%; R2: 2 oils on sword; R3: oils do not wear off + 3 oils on sword; duration +5/10/15%
**hunter_instinct** — Hunter Instinct — When AP is max, crit dmg vs oil-target monster type +20/40/60%; duration +5/10/15%
**steady_aim** — Steady Aim — Max rank 1. Time slowed 50% while aiming bombs; duration & bomb dmg +5%
**pyrotechnics** — Pyrotechnics — All bombs deal +50/100/150 bonus damage; duration & bomb dmg +5/10/15%
**efficiency** — Efficiency — Max bombs per slot +1/2/3; duration +5/10/15%
**cluster_bombs** — Cluster Bombs — Bombs split into 2/3/4 fragments on detonation; duration +5/10/15%
**acquired_tolerance** — Acquired Tolerance — Each known alchemy formula +0.5 max Toxicity (T1: Lvl1 only; T2: Lvl1+2; T3: all levels); duration & bomb dmg +5/10/15%
**tissue_transmutation** — Tissue Transmutation — Active decoction grants +300/600/900 max Vitality for its duration; duration & bomb dmg +5/10/15%
**synergy** — Synergy — Mutagen slot bonus +10/20/30%; potion duration +5/10/15%
**adaptation** — Adaptation — Decoction duration +10/20/30%; potion duration +5/10/15%
**frenzy** — Frenzy — If toxicity >0, time slows when enemy is about to counterattack. R2+: effect stronger; duration & bomb dmg +5/10/15%
**endure_pain** — Endure Pain — When toxicity exceeds safe threshold, max Vitality +10/20/30%; duration & bomb dmg +5/10/15%
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
| euphoria | Euphoria | alchemy | Each point of Toxicity increases damage dealt by swords and Sign Intensity by 0.75% (to a maximum of 75%) |
| metamorphosis | Metamorphosis | combat, signs, alchemy | Applying critical effects activates a random decoction for 120s at no Toxicity cost (max 3 simultaneous) |
| piercing_cold | Piercing Cold | signs | Aard has 25% freeze chance; knocked-down + frozen = instant death; non-frozen targets take additional damage |
| mutated_skin | Mutated Skin | combat, alchemy | Each Adrenaline Point decreases damage received by 15% (to a maximum of 45%) |
| bloodbath | Bloodbath | combat | Fatal sword blows dismember or trigger finisher; each melee hit +5% Attack Power (max 250%); lost on taking damage |
| conductors_magic | Conductors of Magic | signs, combat | When drawn, magic/unique/witcher swords increase Sign damage dealt by 50% of their own damage dealt |
| magic_sensibilities | Magic Sensibilities | signs | Signs can deal critical hits (chance and damage scale with Sign Intensity); opponents killed by Sign crits explode |
| toxic_blood | Toxic Blood | alchemy | Each melee hit received deals back 1.5% of damage per Toxicity point to the attacker (max 150%) |

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
