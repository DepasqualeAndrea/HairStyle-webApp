import { supabase } from './supabase';

/**
 * Loyalty System Configuration
 */
export const LOYALTY_CONFIG = {
  // Points earning
  POINTS_PER_EURO: 1, // 1 punto per ogni euro speso

  // Tier thresholds (points needed to reach each tier)
  TIER_THRESHOLDS: {
    BRONZE: 0,
    SILVER: 100,
    GOLD: 300,
    PLATINUM: 600,
  },

  // Tier benefits - Discount percentages
  TIER_DISCOUNTS: {
    BRONZE: 0, // No discount
    SILVER: 0.02, // 2% discount
    GOLD: 0.05, // 5% discount
    PLATINUM: 0.10, // 10% discount
  },

  // Points redemption rate
  POINTS_TO_CENTS: 1, // 1 punto = 1 cent di sconto (100 punti = €1.00)
};

export type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

/**
 * Calculate points earned from a purchase
 * @param amountCents Amount in cents
 * @returns Points earned
 */
export function calculatePointsEarned(amountCents: number): number {
  const euros = amountCents / 100;
  return Math.floor(euros * LOYALTY_CONFIG.POINTS_PER_EURO);
}

/**
 * Determine user's tier based on total points
 * @param points Total loyalty points
 * @returns User's current tier
 */
export function getUserTier(points: number): Tier {
  if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.PLATINUM) return 'PLATINUM';
  if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.GOLD) return 'GOLD';
  if (points >= LOYALTY_CONFIG.TIER_THRESHOLDS.SILVER) return 'SILVER';
  return 'BRONZE';
}

/**
 * Get the next tier and points needed to reach it
 * @param currentPoints Current loyalty points
 * @returns Next tier info or null if already at max tier
 */
export function getNextTierInfo(currentPoints: number): {
  nextTier: Tier;
  pointsNeeded: number;
  progressPercent: number;
} | null {
  const currentTier = getUserTier(currentPoints);

  const tierOrder: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  const currentIndex = tierOrder.indexOf(currentTier);

  // Already at max tier
  if (currentIndex === tierOrder.length - 1) {
    return null;
  }

  const nextTier = tierOrder[currentIndex + 1];
  const nextThreshold = LOYALTY_CONFIG.TIER_THRESHOLDS[nextTier];
  const currentThreshold = LOYALTY_CONFIG.TIER_THRESHOLDS[currentTier];

  const pointsNeeded = nextThreshold - currentPoints;
  const progressPercent = Math.min(
    100,
    ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );

  return {
    nextTier,
    pointsNeeded,
    progressPercent: Math.round(progressPercent),
  };
}

/**
 * Get discount percentage for a tier
 * @param tier User's tier
 * @returns Discount as decimal (e.g., 0.05 for 5%)
 */
export function getTierDiscount(tier: Tier): number {
  return LOYALTY_CONFIG.TIER_DISCOUNTS[tier];
}

/**
 * Apply tier discount to a price
 * @param priceCents Price in cents
 * @param tier User's tier
 * @returns Discounted price in cents
 */
export function applyTierDiscount(priceCents: number, tier: Tier): number {
  const discount = getTierDiscount(tier);
  return Math.round(priceCents * (1 - discount));
}

/**
 * Calculate discount amount from points redemption
 * @param pointsToRedeem Points user wants to redeem
 * @returns Discount in cents
 */
export function calculatePointsDiscount(pointsToRedeem: number): number {
  return pointsToRedeem * LOYALTY_CONFIG.POINTS_TO_CENTS;
}

/**
 * Redeem loyalty points for discount
 * @param userId User ID
 * @param pointsToRedeem Points to redeem
 * @returns Discount amount in cents
 */
export async function redeemPoints(
  userId: string,
  pointsToRedeem: number
): Promise<number> {
  // Verify user has enough points
  const { data: profile } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', userId)
    .single();

  if (!profile) {
    throw new Error('User profile not found');
  }

  if (profile.loyalty_points < pointsToRedeem) {
    throw new Error(
      `Insufficient points. You have ${profile.loyalty_points} points, but tried to redeem ${pointsToRedeem}.`
    );
  }

  // Calculate discount
  const discountCents = calculatePointsDiscount(pointsToRedeem);

  // Add redemption to history (negative points)
  await supabase.from('loyalty_history').insert({
    user_id: userId,
    points_change: -pointsToRedeem,
    reason: `Redeemed ${pointsToRedeem} points for discount`,
  });

  // Update profile points
  await supabase
    .from('profiles')
    .update({ loyalty_points: profile.loyalty_points - pointsToRedeem })
    .eq('id', userId);

  return discountCents;
}

/**
 * Get tier badge emoji and color
 * @param tier User's tier
 * @returns Emoji and color hex for UI display
 */
export function getTierBadge(tier: Tier): { emoji: string; color: string; name: string } {
  const badges = {
    BRONZE: { emoji: '🥉', color: '#CD7F32', name: 'Bronze' },
    SILVER: { emoji: '🥈', color: '#C0C0C0', name: 'Silver' },
    GOLD: { emoji: '🥇', color: '#FFD700', name: 'Gold' },
    PLATINUM: { emoji: '💎', color: '#E5E4E2', name: 'Platinum' },
  };

  return badges[tier];
}

/**
 * Format points display
 * @param points Points amount
 * @returns Formatted string
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('it-IT');
}

/**
 * Get tier benefits description
 * @param tier Tier level
 * @returns Array of benefit descriptions
 */
export function getTierBenefits(tier: Tier): string[] {
  const benefits = {
    BRONZE: [
      'Earn 1 point per euro spent',
      'Redeem points for discounts',
      'Birthday surprise',
    ],
    SILVER: [
      '2% discount on all services',
      'Priority booking',
      'Earn 1 point per euro spent',
      'Exclusive offers',
    ],
    GOLD: [
      '5% discount on all services',
      'Priority booking',
      'Earn 1 point per euro spent',
      'Free product samples',
      'Early access to new services',
    ],
    PLATINUM: [
      '10% discount on all services',
      'VIP priority booking',
      'Earn 1.5 points per euro spent',
      'Free premium treatments',
      'Personal stylist consultation',
      'Exclusive events access',
    ],
  };

  return benefits[tier];
}
