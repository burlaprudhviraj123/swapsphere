/**
 * Shared Glass configuration for the custom CSS Glass Design System.
 * Defaults applied to all Glass components — use unless a component
 * explicitly needs different behaviour.
 *
 * Usage:
 *   import GLASS from '@/theme/glassTheme';
 *   <Glass {...GLASS}>...</Glass>
 */
import { RADIUS } from './radius.js';

export const GLASS = {
  cornerRadius: RADIUS.glass,
};

export default GLASS;
