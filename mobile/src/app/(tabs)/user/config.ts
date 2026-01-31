export type FAQItem = {
  question: string;
  answer: string;
};

export type PrivacyPolicySection = {
  title: string;
  content?: string;
  subsections?: {
    subtitle: string;
    text: string;
  }[];
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I add a new expense?",
    answer:
      "Navigate to the Home tab, tap the + button or the 'Add Expense' option, fill in the details including amount, category, and date, then save.",
  },
  {
    question: "How do I edit or delete an expense?",
    answer:
      "Go to the Home tab, find the expense you want to modify, tap on it to open the details, then choose to edit or delete.",
  },
  {
    question: "Can I categorize my expenses?",
    answer:
      "Yes! Go to User > Categories to manage your custom expense categories. You can add, edit, or delete categories as needed.",
  },
  {
    question: "How do I view my spending analytics?",
    answer:
      "Navigate to the Analysis tab to see detailed charts, graphs, and insights about your spending patterns and income.",
  },
  {
    question: "How do I filter expenses by date?",
    answer:
      "Use the date filter on the Home and Analysis screens. You can choose from Today, This Week, This Month, or set a custom date range.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Currently, all your data is securely stored in our database. You can view all your transactions in the app anytime.",
  },
  {
    question: "How do I change my profile information?",
    answer:
      "Go to User > Edit Profile to update your name, email, and phone number.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use industry-standard encryption and security measures to protect your financial data. Read our Privacy Policy for more details.",
  },
];

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    title: "1. Introduction",
    content:
      "Welcome to Walletly. We are committed to protecting your privacy and ensuring you have a positive experience on our application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.",
  },
  {
    title: "2. Information We Collect",
    subsections: [
      {
        subtitle: "Personal Information",
        text: "We collect information you voluntarily provide such as your name, email address, phone number, and payment information when you create an account or use our services.",
      },
      {
        subtitle: "Transaction Data",
        text: "We collect details about your financial transactions, including amounts, categories, dates, and account information to provide expense tracking services.",
      },
      {
        subtitle: "Device Information",
        text: "We may collect device-specific information such as your device type, operating system, and unique identifiers for analytics and troubleshooting purposes.",
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect information about how you interact with the app, including features used, time spent, and navigation patterns.",
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    content:
      "We use the information we collect for the following purposes:\n• To provide and maintain our services\n• To process your transactions\n• To send administrative information and updates\n• To improve and optimize our application\n• To personalize your experience\n• To analyze usage patterns and trends\n• To prevent fraud and ensure security\n• To comply with legal obligations",
  },
  {
    title: "4. Data Security",
    content:
      "We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These include:\n• Encryption of data in transit and at rest\n• Secure authentication mechanisms\n• Regular security audits and testing\n• Limited access to personal information\n• Employee confidentiality agreements\n\nHowever, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.",
  },
  {
    title: "5. Data Retention",
    content:
      "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You may request deletion of your account and associated data at any time through the app settings or by contacting us directly.",
  },
  {
    title: "6. Third-Party Services",
    content:
      "Our application may contain links to third-party services and integrations. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.",
  },
  {
    title: "7. Your Rights",
    content:
      "Depending on your location, you may have certain rights regarding your personal information, including:\n• The right to access your personal data\n• The right to correct inaccurate data\n• The right to request deletion of your data\n• The right to restrict processing\n• The right to data portability\n\nTo exercise any of these rights, please contact us at privacy@walletly.app",
  },
  {
    title: "8. Children's Privacy",
    content:
      "Walletly is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information promptly.",
  },
  {
    title: "9. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of significant changes by updating the 'Last Updated' date and, where appropriate, by providing additional notice.",
  },
  {
    title: "10. Contact Us",
    content:
      "If you have questions about this Privacy Policy or our privacy practices, please contact us at:\n\nEmail: privacy@walletly.app\n\nWe will respond to your inquiries within 30 days.",
  },
];
