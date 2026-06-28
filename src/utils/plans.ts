import { PlanName, PlanFeature } from '../types';

const PLAN_FEATURES: Record<PlanName, Record<PlanFeature, boolean | string>> = {
  basic: {
    ai_agent: false,
    ecommerce_website: false,
    custom_domain: false,
    change_order_button_name: false,
    new_order_email_notification: false,
    shop_banner: false,
    watermark_removed: false,
    qr_menu: false,
    staff_accounts: false,
  },
  standard: {
    ai_agent: 'own_api',
    ecommerce_website: true,
    custom_domain: false,
    change_order_button_name: true,
    new_order_email_notification: false,
    shop_banner: false,
    watermark_removed: true,
    qr_menu: false,
    staff_accounts: true,
  },
  pro: {
    ai_agent: 'api_provided',
    ecommerce_website: 'multi_platform',
    custom_domain: true,
    change_order_button_name: true,
    new_order_email_notification: false,
    shop_banner: true,
    watermark_removed: true,
    qr_menu: true,
    staff_accounts: true,
  },
  business: {
    ai_agent: 'api_provided',
    ecommerce_website: 'multi_platform',
    custom_domain: 'up_to_3',
    change_order_button_name: true,
    new_order_email_notification: true,
    shop_banner: true,
    watermark_removed: true,
    qr_menu: true,
    staff_accounts: true,
  },
};

export function isFeatureAllowed(planName: string | undefined, feature: PlanFeature): boolean {
  const plan = planName?.toLowerCase() as PlanName | undefined;
  if (!plan || !PLAN_FEATURES[plan]) return false;
  return !!PLAN_FEATURES[plan][feature];
}

export function requireFeature(
  planName: string | undefined,
  feature: PlanFeature,
): boolean {
  return isFeatureAllowed(planName, feature);
}
