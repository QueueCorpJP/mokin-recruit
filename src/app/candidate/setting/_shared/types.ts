export type ReceiveSetting = 'receive' | 'not-receive';

export interface NotificationSettings {
  scout_notification: ReceiveSetting;
  message_notification: ReceiveSetting;
  recommendation_notification: ReceiveSetting;
}

export interface ScoutSettings {
  scout_status: ReceiveSetting;
}

export interface BlockedCompanySettings {
  company_names: string[];
}
