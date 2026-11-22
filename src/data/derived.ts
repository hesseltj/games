import { useMemo } from 'react';
import { useStore } from './store';
import type { Kid } from '../core/types';
import { dayKey } from '../core/random';
import {
  badges, creatureStage, dailyQuest, levelInfo, pendingRewards, playedDays, roundsWithBuddy, streakInfo, totalXp, type KidSnapshot,
} from '../core/progress';

/** Everything about one kid's progress, recomputed when their records change. */
export function useKidProgress(kid: Kid) {
  const rounds = useStore((s) => s.rounds);
  const ledger = useStore((s) => s.ledger);
  const inventory = useStore((s) => s.inventory);
  const rooms = useStore((s) => s.rooms);
  const skills = useStore((s) => s.skills[kid.id]);
  return useMemo(() => {
    const today = dayKey();
    const snap: KidSnapshot = {
      kid,
      rounds: rounds.filter((r) => r.kidId === kid.id),
      skills: skills ?? {},
      inventory: inventory.filter((i) => i.kidId === kid.id),
      rooms: rooms.filter((r) => r.kidId === kid.id),
    };
    const myLedger = ledger.filter((e) => e.kidId === kid.id);
    const roundsToday = snap.rounds.filter((r) => dayKey(r.createdAt) === today);
    const allBadges = badges(snap, today);
    const seen = new Set(kid.seenBadges ?? []);
    return {
      snap,
      ledger: myLedger,
      level: levelInfo(totalXp(snap.rounds)),
      streak: streakInfo(playedDays(snap.rounds), today),
      quest: dailyQuest(kid.id, today, roundsToday),
      pending: pendingRewards(snap, myLedger, today),
      badges: allBadges,
      newBadges: allBadges.filter((b) => b.earned && !seen.has(b.id)),
    };
  }, [kid, rounds, ledger, inventory, rooms, skills]);
}

/** Evolution stage of a creature in the kid's inventory. */
export function useCreatureStage(invId: string | null | undefined) {
  const rounds = useStore((s) => s.rounds);
  return useMemo(() => creatureStage(invId ? roundsWithBuddy(rounds, invId) : 0), [rounds, invId]);
}
