import type { Question } from '../types';

export const questionBank: Question[] = [
  // ================= GENERAL / LIFESTYLE =================
  {
    id: 'gen_1',
    category: 'General',
    text: 'Which phrase sounds most like you when making a decision?',
    type: 'multiple_choice',
    options: [
      { text: 'I choose based on personal preference and practical needs.', scores: { practical: 3, independent: 3 } },
      { text: 'I notice what is trending but decide independently.', scores: { independent: 2, cultural: 1 } },
      { text: 'I often want what people around me want or what is popular.', scores: { peer: 3, social: 2 } },
      { text: 'I sometimes feel behind if I do not follow the current trends.', scores: { insecurity: 3, social: 2, status: 1 } },
    ]
  },
  {
    id: 'gen_2',
    category: 'General',
    text: 'Have you ever bought something mainly because you kept seeing it repeatedly?',
    type: 'yes_no',
    yesScores: { algorithmic: 3, advertising: 2, habitual: 1 },
    noScores: { independent: 2 }
  },
  {
    id: 'gen_3',
    category: 'General',
    text: 'How often do you feel pressure to upgrade your lifestyle (tech, car, home) after seeing others online?',
    type: 'scale',
    minLabel: 'Never',
    maxLabel: 'Very Often',
    scoresMapping: (val: number) => ({
      status: val * 0.6,
      insecurity: val * 0.6,
      social: val * 0.4,
      independent: (10 - val) * 0.5
    })
  },
  {
    id: 'gen_4',
    category: 'General',
    text: 'Do you feel a sense of belonging when you own the same items as your friends?',
    type: 'yes_no',
    yesScores: { peer: 3, social: 1 },
    noScores: { independent: 2 }
  },
  {
    id: 'gen_5',
    category: 'General',
    text: 'When choosing a travel destination or activity, what matters most?',
    type: 'multiple_choice',
    options: [
      { text: 'I have always wanted to go there for personal reasons.', scores: { independent: 3 } },
      { text: 'It looks amazing in photos and videos I have seen online.', scores: { algorithmic: 2, social: 2 } },
      { text: 'My friends or family are going / have recommended it highly.', scores: { peer: 3 } },
      { text: 'It is a known prestigious or trendy spot.', scores: { status: 3, cultural: 1 } }
    ]
  },

  // ================= FASHION =================
  {
    id: 'fash_1',
    category: 'Fashion',
    text: 'When you buy clothing, what usually inspires the purchase?',
    type: 'multiple_choice',
    options: [
      { text: 'I genuinely need it (e.g., replacing worn items).', scores: { practical: 4, independent: 1 } },
      { text: 'I saw someone wearing something similar in person.', scores: { peer: 2, social: 1 } },
      { text: 'It is trending online.', scores: { algorithmic: 2, social: 3 } },
      { text: 'A brand or influencer promoted it.', scores: { advertising: 3, social: 2 } },
      { text: 'I felt pressure to upgrade my look for an event or group.', scores: { insecurity: 3, peer: 2, status: 1 } }
    ]
  },
  {
    id: 'fash_2',
    category: 'Fashion',
    text: 'How frequently do you buy clothes that you only wear once or twice?',
    type: 'scale',
    minLabel: 'Rarely/Never',
    maxLabel: 'Very Often',
    scoresMapping: (val: number) => ({
      habitual: val * 0.5,
      social: val * 0.4,
      practical: (10 - val) * 0.5
    })
  },
  {
    id: 'fash_3',
    category: 'Fashion',
    text: 'Do you ever hide or throw away clothes because they went "out of style" even if they are still good?',
    type: 'yes_no',
    yesScores: { cultural: 2, status: 2, insecurity: 1 },
    noScores: { practical: 3, independent: 2 }
  },
  {
    id: 'fash_4',
    category: 'Fashion',
    text: 'Are you loyal to certain clothing brands primarily because of the status they convey?',
    type: 'yes_no',
    yesScores: { status: 4, cultural: 1 },
    noScores: { practical: 2, independent: 2 }
  },
  {
    id: 'fash_5',
    category: 'Fashion',
    text: 'How much do fashion hauls on social media influence your urge to shop?',
    type: 'scale',
    minLabel: 'Not at all',
    maxLabel: 'A lot',
    scoresMapping: (val: number) => ({ algorithmic: val * 0.6, advertising: val * 0.4, independent: (10 - val) * 0.4 })
  },

  // ================= BEAUTY / MAKEUP =================
  {
    id: 'beau_1',
    category: 'Beauty / Makeup',
    text: 'How often do you buy beauty or grooming products after seeing them repeatedly in your feed?',
    type: 'scale',
    minLabel: 'Never',
    maxLabel: 'Very Often',
    scoresMapping: (val: number) => ({
      algorithmic: val * 0.5,
      advertising: val * 0.5,
      independent: (10 - val) * 0.5
    })
  },
  {
    id: 'beau_2',
    category: 'Beauty / Makeup',
    text: 'Why do you usually try a new skincare or makeup routine?',
    type: 'multiple_choice',
    options: [
      { text: 'To solve a specific issue I have (e.g., dry skin).', scores: { practical: 4, independent: 1 } },
      { text: 'A dermatologist or trusted professional recommended it.', scores: { practical: 2, cultural: 1 } },
      { text: 'An influencer with great skin/makeup showed it.', scores: { advertising: 2, algorithmic: 2 } },
      { text: 'I felt insecure about my appearance and wanted a quick fix.', scores: { insecurity: 4 } }
    ]
  },
  {
    id: 'beau_3',
    category: 'Beauty / Makeup',
    text: 'Do you feel less confident when you go without your usual beauty products, even around close friends?',
    type: 'yes_no',
    yesScores: { insecurity: 3, social: 2 },
    noScores: { independent: 3 }
  },
  {
    id: 'beau_4',
    category: 'Beauty / Makeup',
    text: 'Have you purchased "viral" beauty products that didn\'t actually suit you?',
    type: 'yes_no',
    yesScores: { algorithmic: 3, social: 2, habitual: 1 },
    noScores: { practical: 2 }
  },

  // ================= SHOPPING =================
  {
    id: 'shop_1',
    category: 'Shopping',
    text: 'When a store offers a "limited time" discount, how often do you buy something you didn\'t plan to?',
    type: 'scale',
    minLabel: 'Never',
    maxLabel: 'Always',
    scoresMapping: (val: number) => ({
      advertising: val * 0.6,
      habitual: val * 0.4,
      independent: (10 - val) * 0.5
    })
  },
  {
    id: 'shop_2',
    category: 'Shopping',
    text: 'Where do you discover most of the products you buy?',
    type: 'multiple_choice',
    options: [
      { text: 'Searching for them when I have a need.', scores: { practical: 4, independent: 2 } },
      { text: 'Social media ads and sponsored posts.', scores: { advertising: 3, algorithmic: 2 } },
      { text: 'Friends and family recommendations.', scores: { peer: 3 } },
      { text: 'Store displays and browsing in person.', scores: { habitual: 2, advertising: 1 } }
    ]
  },
  {
    id: 'shop_3',
    category: 'Shopping',
    text: 'Do you feel a sense of relief or temporary happiness immediately after clicking "Buy"?',
    type: 'yes_no',
    yesScores: { habitual: 3, insecurity: 1 },
    noScores: { practical: 2 }
  },
  {
    id: 'shop_4',
    category: 'Shopping',
    text: 'How often do you abandon a purchase because it didn\'t have enough positive reviews?',
    type: 'scale',
    minLabel: 'Rarely',
    maxLabel: 'Often',
    scoresMapping: (val: number) => ({ social: val * 0.5, practical: val * 0.3 })
  },

  // ================= FOOD / DIET =================
  {
    id: 'food_1',
    category: 'Food / Diet',
    text: 'When choosing what to eat, how often are your decisions affected by wellness trends or diet culture?',
    type: 'scale',
    minLabel: 'Never',
    maxLabel: 'Constantly',
    scoresMapping: (val: number) => ({
      cultural: val * 0.4,
      social: val * 0.4,
      insecurity: val * 0.2,
      independent: (10 - val) * 0.5
    })
  },
  {
    id: 'food_2',
    category: 'Food / Diet',
    text: 'Have you ever gone to a specific restaurant mostly because it looks good for photos/social media?',
    type: 'yes_no',
    yesScores: { status: 3, social: 2, algorithmic: 1 },
    noScores: { practical: 2, independent: 1 }
  },
  {
    id: 'food_3',
    category: 'Food / Diet',
    text: 'If your friends order healthy salads, are you likely to change your mind and order one too?',
    type: 'yes_no',
    yesScores: { peer: 4, insecurity: 1 },
    noScores: { independent: 4 }
  },
  {
    id: 'food_4',
    category: 'Food / Diet',
    text: 'What drives your grocery shopping habits the most?',
    type: 'multiple_choice',
    options: [
      { text: 'Budget, meal planning, and basic needs.', scores: { practical: 4 } },
      { text: 'I buy what I crave in the moment.', scores: { independent: 2, habitual: 2 } },
      { text: 'I try to buy trendy "superfoods" or popular organic brands.', scores: { cultural: 2, status: 2 } },
      { text: 'I buy what I grew up eating.', scores: { cultural: 3, habitual: 2 } }
    ]
  },

  // ================= BOOKS / READING =================
  {
    id: 'book_1',
    category: 'Books / Reading',
    text: 'How do you usually pick the next book you read?',
    type: 'multiple_choice',
    options: [
      { text: 'Browsing topics I am personally curious about.', scores: { independent: 4 } },
      { text: 'BookTok, Bookstagram, or other online book communities.', scores: { algorithmic: 3, social: 2 } },
      { text: 'It is a bestseller or a classic I feel I "should" read.', scores: { cultural: 3, status: 1 } },
      { text: 'Recommendations from a close friend.', scores: { peer: 3 } }
    ]
  },
  {
    id: 'book_2',
    category: 'Books / Reading',
    text: 'Do you ever buy books to display them, even if you do not plan to read them immediately?',
    type: 'yes_no',
    yesScores: { status: 3, cultural: 2 },
    noScores: { practical: 3 }
  },
  {
    id: 'book_3',
    category: 'Books / Reading',
    text: 'Does a popular book with a beautiful cover influence you to buy the physical copy instead of digital/audio?',
    type: 'scale',
    minLabel: 'Not at all',
    maxLabel: 'Absolutely',
    scoresMapping: (val: number) => ({ advertising: val * 0.4, status: val * 0.4, practical: (10 - val) * 0.4 })
  },
  {
    id: 'book_4',
    category: 'Books / Reading',
    text: 'If you dislike a widely praised book, do you doubt your own taste?',
    type: 'yes_no',
    yesScores: { insecurity: 4, social: 2 },
    noScores: { independent: 4 }
  },

  // ================= FITNESS / WELLNESS =================
  {
    id: 'fit_1',
    category: 'Fitness / Wellness',
    text: 'Why do you exercise or participate in wellness activities?',
    type: 'multiple_choice',
    options: [
      { text: 'To feel good, healthy, and energized.', scores: { practical: 3, independent: 3 } },
      { text: 'To achieve a body type I see glorified online.', scores: { insecurity: 4, cultural: 2 } },
      { text: 'Because my friends are doing it (e.g., joining a run club together).', scores: { peer: 4 } },
      { text: 'To signal discipline or participate in fitness culture.', scores: { status: 3, cultural: 2 } }
    ]
  },
  {
    id: 'fit_2',
    category: 'Fitness / Wellness',
    text: 'Have you purchased expensive workout gear mainly because it is the current "it" brand?',
    type: 'yes_no',
    yesScores: { status: 3, advertising: 2 },
    noScores: { practical: 3 }
  },
  {
    id: 'fit_3',
    category: 'Fitness / Wellness',
    text: 'How often do you track your health metrics (steps, sleep, calories) primarily because the app prompts you to?',
    type: 'scale',
    minLabel: 'Never',
    maxLabel: 'Constantly',
    scoresMapping: (val: number) => ({ habitual: val * 0.5, algorithmic: val * 0.5, independent: (10 - val) * 0.5 })
  },
  {
    id: 'fit_4',
    category: 'Fitness / Wellness',
    text: 'Do you feel guilty if you miss a workout because you see others posting about theirs?',
    type: 'yes_no',
    yesScores: { insecurity: 3, social: 3 },
    noScores: { independent: 3 }
  },

  // ================= ENTERTAINMENT =================
  {
    id: 'ent_1',
    category: 'Entertainment',
    text: 'How do you decide which movies or TV shows to watch?',
    type: 'multiple_choice',
    options: [
      { text: 'I watch whatever the streaming platform recommends to me.', scores: { algorithmic: 4, habitual: 1 } },
      { text: 'I watch what everyone is talking about online so I do not miss out.', scores: { social: 3, peer: 2 } },
      { text: 'I seek out genres or creators I have always liked.', scores: { independent: 4 } },
      { text: 'I rely heavily on critics’ scores (e.g., Rotten Tomatoes).', scores: { cultural: 3, social: 1 } }
    ]
  },
  {
    id: 'ent_2',
    category: 'Entertainment',
    text: 'Do you ever force yourself to finish a popular show you dislike just to be part of the cultural conversation?',
    type: 'yes_no',
    yesScores: { social: 3, peer: 2 },
    noScores: { independent: 3 }
  },
  {
    id: 'ent_3',
    category: 'Entertainment',
    text: 'How much do celebrity endorsements impact whether you listen to a specific artist or watch a movie?',
    type: 'scale',
    minLabel: 'Not at all',
    maxLabel: 'A lot',
    scoresMapping: (val: number) => ({ advertising: val * 0.5, status: val * 0.3, independent: (10 - val) * 0.4 })
  },
  {
    id: 'ent_4',
    category: 'Entertainment',
    text: 'Have you ever started a hobby or game primarily because your favorite streamer/YouTuber played it?',
    type: 'yes_no',
    yesScores: { algorithmic: 2, advertising: 2, peer: 1 },
    noScores: { independent: 2 }
  },

  // ================= SOCIAL MEDIA =================
  {
    id: 'soc_1',
    category: 'Social Media',
    text: 'When you open a social app, why are you usually doing it?',
    type: 'multiple_choice',
    options: [
      { text: 'Muscle memory; I do it without thinking.', scores: { habitual: 4 } },
      { text: 'I want to see what my friends are up to.', scores: { peer: 3 } },
      { text: 'I am looking for specific information or entertainment.', scores: { practical: 3, independent: 1 } },
      { text: 'I feel anxious I might miss out on news or trends.', scores: { insecurity: 3, social: 2 } }
    ]
  },
  {
    id: 'soc_2',
    category: 'Social Media',
    text: 'Do you ever feel less confident about your own life after scrolling through your feed?',
    type: 'scale',
    minLabel: 'Never',
    maxLabel: 'Very Often',
    scoresMapping: (val: number) => ({ insecurity: val * 0.7, social: val * 0.4, independent: (10 - val) * 0.5 })
  },
  {
    id: 'soc_3',
    category: 'Social Media',
    text: 'Have you ever deleted a post because it didn\'t get enough likes or engagement?',
    type: 'yes_no',
    yesScores: { insecurity: 3, status: 2, social: 2 },
    noScores: { independent: 3 }
  },
  {
    id: 'soc_4',
    category: 'Social Media',
    text: 'Do you curate your online persona to appear more successful, happy, or trendy than you feel?',
    type: 'scale',
    minLabel: 'Not at all',
    maxLabel: 'Extensively',
    scoresMapping: (val: number) => ({ status: val * 0.6, insecurity: val * 0.5, social: val * 0.3 })
  },
  {
    id: 'soc_5',
    category: 'Social Media',
    text: 'Do you find yourself using phrases or slang just because you see them constantly on TikTok/Twitter/Reels?',
    type: 'yes_no',
    yesScores: { algorithmic: 3, habitual: 2, cultural: 1 },
    noScores: { independent: 2 }
  }
];

export const getQuestionsByCategory = (categories: string[]) => {
  return questionBank.filter(q => categories.includes(q.category) || q.category === 'General');
};
