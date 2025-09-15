export const headerLinks = [
  { name: 'Paradox of Plastic', url: '/paradox-of-plastic' },
  { name: 'Impact Stories', url: '/stories' },
  { name: 'Get Involved', url: '/get-involved' },
  { name: 'Join Zuzu', url: '/zuzu' }
];

// Common footer links across all regions
const commonFooterLinks = [
  { name: 'Paradox of Plastic', url: '/paradox-of-plastic' },
  { name: 'Impact Stories', url: '/stories' },
  { name: 'Get Involved', url: '/get-involved' },
  { name: 'Join Zuzu', url: '/zuzu' },
  { name: 'Learn more about our story', url: 'https://www.conservation.org/' },
  { name: 'EarthEcho', url: 'https://www.earthecho.org/' },
  { name: 'Follow us on Facebook', url: 'https://www.facebook.com/SCJohnson/' },
  { name: 'Follow us on Twitter', url: 'https://twitter.com/SCJohnson' },
  { name: 'Follow us on Instagram', url: 'https://www.instagram.com/scj/' },
  { name: 'Follow us on YouTube', url: 'https://www.youtube.com/playlist?list=PLfrdrTO26jmFwvDFSWWrFrT_DOaFvguLD' },
  { name: 'View Our Sources', url: '/sources' }
];

// Region-specific footer links
export const footerLinks = {
  'United States (EN)': [
    ...commonFooterLinks,
    { name: 'Contact Us', url: 'https://contact.scjbrands.com/en-us' },
    { name: 'Visit SC Johnson Corporate Website', url: 'https://www.scjohnson.com/en' },
    { name: 'Terms of Use', url: 'https://terms.scjbrands.com/en-us' },
    { name: 'Privacy Policy', url: 'https://privacy.scjbrands.com/en-us' }
  ],
  'France (FR)': [
    ...commonFooterLinks,
    { name: 'Contact Us', url: 'https://contact.scjbrands.com/fr-fr' },
    { name: 'Visit SC Johnson Corporate Website', url: 'https://www.scjohnson.com/fr' },
    { name: 'Terms of Use', url: 'https://terms.scjbrands.com/fr-fr' },
    { name: 'Privacy Policy', url: 'https://privacy.scjbrands.com/fr-fr' }
  ],
  'Great Britain (EN)': [
    ...commonFooterLinks,
    { name: 'Contact Us', url: 'https://contact.scjbrands.com/en-gb' },
    { name: 'Visit SC Johnson Corporate Website', url: 'https://www.scjohnson.com/en-gb' },
    { name: 'Terms of Use', url: 'https://terms.scjbrands.com/en-gb' },
    { name: 'Privacy Policy', url: 'https://privacy.scjbrands.com/en-gb' }
  ]
};

// Default footer links (backwards compatibility)
export const defaultFooterLinks = footerLinks['United States (EN)'];
