import type { Question } from '../types';

export const questionBank: Question[] = [
  // ================= GENERAL / LIFESTYLE =================
  {
    id: 'gen_decision_phrase',
    category: 'General',
    text: 'Which phrase sounds most like you when making a decision?',
    type: 'mc',
    options: [
      { text: 'I go with what\'s popular or recommended', loads: { social: 2, advertising: 1 } },
      { text: 'I check what my friends or family think', loads: { peer: 2, social: 1 } },
      { text: 'I weigh the cost and whether I actually need it', loads: { practical: 2 } },
      { text: 'I trust my own judgment regardless of trends', loads: { independent: 2 } }
    ]
  },
  {
    id: 'gen_seen_repeatedly',
    category: 'General',
    text: 'Have you ever bought something mainly because you kept seeing it repeatedly?',
    type: 'binary',
    loads: { advertising: 1, habitual: 0.6, algorithmic: 0.6 }
  },
  {
    id: 'gen_upgrade_pressure',
    category: 'General',
    text: 'How often do you feel pressure to upgrade your lifestyle (tech, car, home) after seeing others online?',
    type: 'graded',
    loads: { status: 1, social: 0.6, insecurity: 0.6, algorithmic: 0.4 }
  },
  {
    id: 'gen_belonging_same_items',
    category: 'General',
    text: 'Do you feel a sense of belonging when you own the same items as your friends?',
    type: 'binary',
    loads: { peer: 1, social: 0.6, cultural: 0.5 }
  },
  {
    id: 'gen_travel_choice',
    category: 'General',
    text: 'When choosing a travel destination or activity, what matters most?',
    type: 'mc',
    options: [
      { text: 'How it will look and how share-worthy it is', loads: { status: 2, social: 1, algorithmic: 1 } },
      { text: 'Where my friends have been or recommend', loads: { peer: 2, social: 1 } },
      { text: 'Cost, logistics, and what I will genuinely enjoy', loads: { practical: 2 } },
      { text: 'Somewhere off the beaten path that feels like mine', loads: { independent: 2 } }
    ]
  },

  // ================= FASHION =================
  {
    id: 'fas_inspiration',
    category: 'Fashion',
    text: 'When you buy clothing, what usually inspires the purchase?',
    type: 'mc',
    options: [
      { text: 'Something an influencer or ad showed me', loads: { advertising: 2, social: 1, algorithmic: 1 } },
      { text: 'What my friends are wearing', loads: { peer: 2, social: 1 } },
      { text: 'It is practical and fits my needs and budget', loads: { practical: 2 } },
      { text: 'My own personal style', loads: { independent: 2 } }
    ]
  },
  {
    id: 'fas_wear_once',
    category: 'Fashion',
    text: 'How frequently do you buy clothes that you only wear once or twice?',
    type: 'graded',
    loads: { advertising: 0.6, status: 0.6, habitual: 1 }
  },
  {
    id: 'fas_throw_out_of_style',
    category: 'Fashion',
    text: 'Do you ever hide or throw away clothes because they went "out of style" even if they are still good?',
    type: 'binary',
    loads: { status: 1, social: 0.6, cultural: 0.5 }
  },
  {
    id: 'fas_brand_status',
    category: 'Fashion',
    text: 'Are you loyal to certain clothing brands primarily because of the status they convey?',
    type: 'binary',
    loads: { status: 1, habitual: 0.6 }
  },
  {
    id: 'fas_hauls_influence',
    category: 'Fashion',
    text: 'How much do fashion hauls on social media influence your urge to shop?',
    type: 'graded',
    loads: { algorithmic: 1, advertising: 0.6, social: 0.6 }
  },

  // ================= BEAUTY / MAKEUP =================
  {
    id: 'bty_feed_repeat',
    category: 'Beauty / Makeup',
    text: 'How often do you buy beauty or grooming products after seeing them repeatedly in your feed?',
    type: 'graded',
    loads: { algorithmic: 1, advertising: 0.6 }
  },
  {
    id: 'bty_new_routine_why',
    category: 'Beauty / Makeup',
    text: 'Why do you usually try a new skincare or makeup routine?',
    type: 'mc',
    options: [
      { text: 'It went viral or kept appearing in my feed', loads: { algorithmic: 2, advertising: 1, social: 1 } },
      { text: 'A friend recommended it', loads: { peer: 2 } },
      { text: 'It addresses a specific need I researched', loads: { practical: 2 } },
      { text: 'I like experimenting on my own terms', loads: { independent: 2 } }
    ]
  },
  {
    id: 'bty_less_confident_without',
    category: 'Beauty / Makeup',
    text: 'Do you feel less confident when you go without your usual beauty products, even around close friends?',
    type: 'binary',
    loads: { insecurity: 1, habitual: 0.6 }
  },
  {
    id: 'bty_viral_didnt_suit',
    category: 'Beauty / Makeup',
    text: 'Have you purchased "viral" beauty products that did not actually suit you?',
    type: 'binary',
    loads: { algorithmic: 1, advertising: 0.6, social: 0.5 }
  },

  // ================= SHOPPING =================
  {
    id: 'shp_limited_discount',
    category: 'Shopping',
    text: 'When a store offers a "limited time" discount, how often do you buy something you did not plan to?',
    type: 'graded',
    loads: { advertising: 1, habitual: 0.6, independent: 0.5 },
    reverse: ['independent']
  },
  {
    id: 'shp_discover_where',
    category: 'Shopping',
    text: 'Where do you discover most of the products you buy?',
    type: 'mc',
    options: [
      { text: 'Social feeds and influencers', loads: { algorithmic: 2, advertising: 1, social: 1 } },
      { text: 'Friends and family', loads: { peer: 2 } },
      { text: 'Searching for something I specifically need', loads: { practical: 2 } },
      { text: 'Brands I always go back to', loads: { habitual: 2 } }
    ]
  },
  {
    id: 'shp_buy_relief',
    category: 'Shopping',
    text: 'Do you feel a sense of relief or temporary happiness immediately after clicking "Buy"?',
    type: 'binary',
    loads: { insecurity: 1, habitual: 0.6 }
  },
  {
    id: 'shp_abandon_no_reviews',
    category: 'Shopping',
    text: 'How often do you abandon a purchase because it did not have enough positive reviews?',
    type: 'graded',
    loads: { social: 1 }
  },

  // ================= FOOD / DIET =================
  {
    id: 'fd_wellness_trends',
    category: 'Food / Diet',
    text: 'When choosing what to eat, how often are your decisions affected by wellness trends or diet culture?',
    type: 'graded',
    loads: { social: 0.6, cultural: 0.6, algorithmic: 0.6 }
  },
  {
    id: 'fd_restaurant_photos',
    category: 'Food / Diet',
    text: 'Have you ever gone to a specific restaurant mostly because it looks good for photos or social media?',
    type: 'binary',
    loads: { social: 0.6, status: 0.6, algorithmic: 0.6 }
  },
  {
    id: 'fd_friends_salad',
    category: 'Food / Diet',
    text: 'If your friends order healthy salads, are you likely to change your mind and order one too?',
    type: 'binary',
    loads: { peer: 1, social: 0.6 }
  },
  {
    id: 'fd_grocery_drivers',
    category: 'Food / Diet',
    text: 'What drives your grocery shopping habits the most?',
    type: 'mc',
    options: [
      { text: 'Trending products and what is marketed', loads: { advertising: 2, algorithmic: 1, social: 1 } },
      { text: 'What my household or friends usually buy', loads: { peer: 2, habitual: 1 } },
      { text: 'Price, nutrition, and a plan', loads: { practical: 2 } },
      { text: 'The same staples I always get', loads: { habitual: 2 } }
    ]
  },

  // ================= BOOKS / READING =================
  {
    id: 'bk_pick_next',
    category: 'Books / Reading',
    text: 'How do you usually pick the next book you read?',
    type: 'mc',
    options: [
      { text: 'Bestseller lists, BookTok, or what is hyped', loads: { social: 2, algorithmic: 1, status: 1 } },
      { text: 'Friends\' recommendations', loads: { peer: 2 } },
      { text: 'A topic or author I deliberately chose', loads: { practical: 1, independent: 2 } },
      { text: 'Whatever I am in the mood for, my own pick', loads: { independent: 2 } }
    ]
  },
  {
    id: 'bk_display_unread',
    category: 'Books / Reading',
    text: 'Do you ever buy books to display them, even if you do not plan to read them immediately?',
    type: 'binary',
    loads: { status: 1, social: 0.5 }
  },
  {
    id: 'bk_cover_buy',
    category: 'Books / Reading',
    text: 'Does a popular book with a beautiful cover influence you to buy the physical copy instead of digital or audio?',
    type: 'graded',
    loads: { social: 0.6, status: 0.6, advertising: 0.5 }
  },
  {
    id: 'bk_doubt_taste',
    category: 'Books / Reading',
    text: 'If you dislike a widely praised book, do you doubt your own taste?',
    type: 'binary',
    loads: { insecurity: 1, social: 0.6, independent: 0.6 },
    reverse: ['independent']
  },

  // ================= FITNESS / WELLNESS =================
  {
    id: 'ft_why_exercise',
    category: 'Fitness / Wellness',
    text: 'Why do you exercise or participate in wellness activities?',
    type: 'mc',
    options: [
      { text: 'It is trendy and everyone is doing it', loads: { social: 2, cultural: 1 } },
      { text: 'Friends got me into it', loads: { peer: 2 } },
      { text: 'For my own health goals', loads: { practical: 2 } },
      { text: 'It is my own routine, not for show', loads: { independent: 2 } }
    ]
  },
  {
    id: 'ft_it_brand_gear',
    category: 'Fitness / Wellness',
    text: 'Have you purchased expensive workout gear mainly because it is the current "it" brand?',
    type: 'binary',
    loads: { status: 1, social: 0.6, habitual: 0.5 }
  },
  {
    id: 'ft_track_because_prompted',
    category: 'Fitness / Wellness',
    text: 'How often do you track your health metrics (steps, sleep, calories) primarily because the app prompts you to?',
    type: 'graded',
    loads: { algorithmic: 1, habitual: 0.6 }
  },
  {
    id: 'ft_guilt_missed_workout',
    category: 'Fitness / Wellness',
    text: 'Do you feel guilty if you miss a workout because you see others posting about theirs?',
    type: 'binary',
    loads: { insecurity: 1, social: 0.6, peer: 0.5 }
  },

  // ================= ENTERTAINMENT =================
  {
    id: 'ent_pick_show',
    category: 'Entertainment',
    text: 'How do you decide which movies or TV shows to watch?',
    type: 'mc',
    options: [
      { text: 'What is trending or everyone is talking about', loads: { social: 2, cultural: 1 } },
      { text: 'Recommendations from friends', loads: { peer: 2 } },
      { text: 'Reviews and whether it fits my taste', loads: { practical: 1, social: 1 } },
      { text: 'My own interests, regardless of buzz', loads: { independent: 2 } }
    ]
  },
  {
    id: 'ent_finish_disliked',
    category: 'Entertainment',
    text: 'Do you ever force yourself to finish a popular show you dislike just to be part of the cultural conversation?',
    type: 'binary',
    loads: { cultural: 1, social: 0.6, independent: 0.6 },
    reverse: ['independent']
  },
  {
    id: 'ent_celebrity_endorse',
    category: 'Entertainment',
    text: 'How much do celebrity endorsements impact whether you listen to a specific artist or watch a movie?',
    type: 'graded',
    loads: { advertising: 1, social: 0.6, status: 0.5 }
  },
  {
    id: 'ent_streamer_hobby',
    category: 'Entertainment',
    text: 'Have you ever started a hobby or game primarily because your favorite streamer or YouTuber played it?',
    type: 'binary',
    loads: { advertising: 1, algorithmic: 0.6, social: 0.5 }
  },

  // ================= SOCIAL MEDIA =================
  {
    id: 'sm_why_open',
    category: 'Social Media',
    text: 'When you open a social app, why are you usually doing it?',
    type: 'mc',
    options: [
      { text: 'To see what everyone else is doing', loads: { social: 2, insecurity: 1 } },
      { text: 'Out of habit, I just open it', loads: { habitual: 2, algorithmic: 1 } },
      { text: 'To message specific friends', loads: { peer: 1, practical: 1 } },
      { text: 'For a specific purpose, then I leave', loads: { practical: 2, independent: 1 } }
    ]
  },
  {
    id: 'sm_less_confident_scrolling',
    category: 'Social Media',
    text: 'Do you ever feel less confident about your own life after scrolling through your feed?',
    type: 'graded',
    loads: { insecurity: 1, social: 0.6, algorithmic: 0.5 }
  },
  {
    id: 'sm_deleted_low_likes',
    category: 'Social Media',
    text: 'Have you ever deleted a post because it did not get enough likes or engagement?',
    type: 'binary',
    loads: { insecurity: 1, social: 0.6, status: 0.5 }
  },
  {
    id: 'sm_curate_persona',
    category: 'Social Media',
    text: 'Do you curate your online persona to appear more successful, happy, or trendy than you feel?',
    type: 'graded',
    loads: { status: 1, insecurity: 0.6, social: 0.6 }
  },
  {
    id: 'sm_slang_from_feed',
    category: 'Social Media',
    text: 'Do you find yourself using phrases or slang just because you see them constantly on TikTok, Twitter, or Reels?',
    type: 'binary',
    loads: { algorithmic: 1, cultural: 0.6, social: 0.5 }
  },

  // ================= INTERNAL-DRIVER ITEMS =================
  {
    id: 'int_research_before_buy',
    category: 'General',
    text: 'I research and compare options carefully before a significant purchase.',
    type: 'graded',
    loads: { practical: 1 }
  },
  {
    id: 'int_avoid_popular',
    category: 'General',
    text: 'I deliberately avoid buying things just because they are popular.',
    type: 'graded',
    loads: { independent: 1 }
  },
  {
    id: 'int_comfortable_differ',
    category: 'General',
    text: 'I am comfortable with my choices even when they differ from my friends\'.',
    type: 'graded',
    loads: { independent: 1 }
  },
  {
    id: 'int_need_check',
    category: 'General',
    text: 'Before buying something, I stop to think about whether I actually need it.',
    type: 'graded',
    loads: { practical: 1 }
  }
];

export const getQuestionsByCategory = (categories: string[]) => {
  return questionBank.filter(q => categories.includes(q.category) || q.category === 'General');
};
