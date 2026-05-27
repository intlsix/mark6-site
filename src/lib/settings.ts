export interface SiteSettings {
  companyName: string;
  jurisdiction: string;
  regNumber: string;
  intlAutoEnabled: boolean;
}

export const defaultSettings: SiteSettings = {
  companyName: "HK Intl Mark Six Ltd",
  jurisdiction: "Isle of Man",
  regNumber: "IMO-128456",
  intlAutoEnabled: true,
};
