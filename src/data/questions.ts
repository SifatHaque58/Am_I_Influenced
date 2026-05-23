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
  {
    id: 'bty_dupe_pressure',
    category: 'Beauty / Makeup',
    text: 'How often do you buy a "dupe" of a luxury beauty product mainly because a creator insisted it was identical?',
    type: 'graded',
    loads: { algorithmic: 1, advertising: 0.8, practical: 0.5 }
  },
  {
    id: 'bty_complex_routine',
    category: 'Beauty / Makeup',
    text: 'Do you feel pressured to maintain complex, multi-step routines (like 10-step skincare) because they seem like the standard online?',
    type: 'binary',
    loads: { social: 1, insecurity: 0.8, cultural: 0.6 }
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
  {
    id: 'shp_livestream_hype',
    category: 'Shopping',
    text: 'Have you ever bought something during a livestream shopping event (like TikTok Shop or Instagram Live) just because of the hype?',
    type: 'binary',
    loads: { algorithmic: 1, advertising: 1, social: 0.5 }
  },
  {
    id: 'shp_stress_buy',
    category: 'Shopping',
    text: 'How often do you make impulsive online purchases late at night to cope with stress or boredom?',
    type: 'graded',
    loads: { insecurity: 1, habitual: 0.8 }
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
  {
    id: 'fd_superfood_hype',
    category: 'Food / Diet',
    text: 'Do you find yourself buying expensive "superfood" ingredients or supplements primarily because influencers claim they are life-changing?',
    type: 'graded',
    loads: { advertising: 1, status: 0.6, algorithmic: 0.6 }
  },
  {
    id: 'fd_diet_peer_pressure',
    category: 'Food / Diet',
    text: 'Have you ever completely changed your diet (e.g., going vegan, keto, gluten-free) mostly because your social circle did?',
    type: 'binary',
    loads: { peer: 1, social: 0.8, cultural: 0.5 }
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
  {
    id: 'bk_special_editions',
    category: 'Books / Reading',
    text: 'How often do you buy special editions or multiple copies of the same book just to display them on your shelf?',
    type: 'graded',
    loads: { status: 1, habitual: 0.5, social: 0.5 }
  },
  {
    id: 'bk_force_genre',
    category: 'Books / Reading',
    text: 'Do you force yourself to read genres you do not actually enjoy just because they are currently dominating online discussions?',
    type: 'binary',
    loads: { social: 1, cultural: 0.6, independent: 0.6 },
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
  {
    id: 'ft_sponsored_supplements',
    category: 'Fitness / Wellness',
    text: 'How often do you buy trendy wellness supplements (like greens powders) because they are heavily sponsored online?',
    type: 'graded',
    loads: { advertising: 1, algorithmic: 0.8, social: 0.5 }
  },
  {
    id: 'ft_boutique_gym',
    category: 'Fitness / Wellness',
    text: 'Have you ever joined an expensive boutique gym or fitness class mostly because of the status associated with it?',
    type: 'binary',
    loads: { status: 1, social: 0.8, cultural: 0.5 }
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
  {
    id: 'ent_sub_for_one_show',
    category: 'Entertainment',
    text: 'How often do you pay for a new streaming service subscription just to watch one specific show everyone is talking about?',
    type: 'graded',
    loads: { social: 1, cultural: 0.6, habitual: 0.5 }
  },
  {
    id: 'ent_concert_for_content',
    category: 'Entertainment',
    text: 'Have you ever gone to a concert or live event mostly for the social media content, rather than for the performance itself?',
    type: 'binary',
    loads: { status: 1, social: 1, algorithmic: 0.5 }
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
  },
  // === MORE FASHION ===
  { id: 'fash_more_1', category: 'Fashion', text: 'Have you ever avoided wearing an outfit because you felt it was "last season"?', type: 'binary', loads: { social: 1, status: 0.8, insecurity: 0.8 } },
  { id: 'fash_more_2', category: 'Fashion', text: 'How do you decide what to wear to an important event?', type: 'mc', options: [{ text: 'Check what influencers are wearing', loads: { algorithmic: 2, social: 1 } }, { text: 'Ask friends for advice', loads: { peer: 2, insecurity: 1 } }, { text: 'Wear something I know is prestigious', loads: { status: 2 } }, { text: 'Wear my favorite comfortable piece', loads: { independent: 2, practical: 1 } }] },
  { id: 'fash_more_3', category: 'Fashion', text: 'Do you feel pressure to buy from sustainable brands because of social expectations?', type: 'graded', loads: { cultural: 1, social: 1, status: 0.5 } },
  { id: 'fash_more_4', category: 'Fashion', text: 'If a celebrity you admire wears a strange new style, do you start liking it?', type: 'binary', loads: { social: 1, algorithmic: 0.5 } },
  { id: 'fash_more_5', category: 'Fashion', text: 'How often do you buy clothes just because they are heavily discounted, even if you do not need them?', type: 'graded', loads: { advertising: 1, practical: 0.8, habitual: 0.5 }, reverse: ['practical'] },
  
  // === MORE BEAUTY / MAKEUP ===
  { id: 'bty_more_1', category: 'Beauty / Makeup', text: 'Do you buy skincare products primarily because of TikTok/Instagram trends?', type: 'binary', loads: { algorithmic: 1, social: 0.8 } },
  { id: 'bty_more_2', category: 'Beauty / Makeup', text: 'How do you react when a favorite product changes its packaging?', type: 'mc', options: [{ text: 'Buy it immediately to have the new look', loads: { status: 1, habitual: 1 } }, { text: 'Wait to see reviews online', loads: { social: 1, peer: 1 } }, { text: 'Only buy it when my old one runs out', loads: { practical: 2 } }, { text: 'Switch brands if the formula changed', loads: { independent: 1, practical: 1 } }] },
  { id: 'bty_more_3', category: 'Beauty / Makeup', text: 'Do you feel insecure about your appearance if you do not use certain popular beauty products?', type: 'graded', loads: { insecurity: 1, social: 0.8, peer: 0.5 } },
  { id: 'bty_more_4', category: 'Beauty / Makeup', text: 'Have you ever bought a beauty product purely because the packaging looked good for social media?', type: 'binary', loads: { status: 1, social: 0.8, algorithmic: 0.5 } },
  { id: 'bty_more_5', category: 'Beauty / Makeup', text: 'How often do you stick to the exact same beauty routine out of pure habit?', type: 'graded', loads: { habitual: 1, practical: 0.5, independent: 0.5 } },

  // === MORE SHOPPING ===
  { id: 'shop_more_1', category: 'Shopping', text: 'Have you ever bought something just because it was a "limited edition"?', type: 'binary', loads: { status: 1, advertising: 1, insecurity: 0.5 } },
  { id: 'shop_more_2', category: 'Shopping', text: 'When browsing online stores, what makes you click "Add to Cart"?', type: 'mc', options: [{ text: '"Only 2 left in stock!" warnings', loads: { advertising: 2, insecurity: 1 } }, { text: 'High ratings and hundreds of reviews', loads: { social: 2, practical: 0.5 } }, { text: 'It looks like a high-status item', loads: { status: 2 } }, { text: 'I specifically searched for it because I need it', loads: { practical: 2, independent: 1 } }] },
  { id: 'shop_more_3', category: 'Shopping', text: 'Do you find yourself buying things you did not plan to when browsing physical stores?', type: 'graded', loads: { habitual: 1, advertising: 0.8 } },
  { id: 'shop_more_4', category: 'Shopping', text: 'Do you care if the shopping bags you carry around the mall are from prestigious brands?', type: 'binary', loads: { status: 1, social: 0.8 } },
  { id: 'shop_more_5', category: 'Shopping', text: 'How often do you make purchases during major sales events (like Black Friday) just because it is a tradition?', type: 'graded', loads: { cultural: 1, habitual: 1, advertising: 0.5 } },

  // === MORE FOOD / DIET ===
  { id: 'food_more_1', category: 'Food / Diet', text: 'Do you often try new restaurants just because they are currently trending?', type: 'binary', loads: { social: 1, status: 0.5, algorithmic: 0.8 } },
  { id: 'food_more_2', category: 'Food / Diet', text: 'How do you pick your groceries?', type: 'mc', options: [{ text: 'Whatever brands I always buy', loads: { habitual: 2 } }, { text: 'I check nutritional labels and prices', loads: { practical: 2, independent: 1 } }, { text: 'I buy whatever is heavily advertised or on display', loads: { advertising: 2 } }, { text: 'I buy what my fitness/diet influencers recommend', loads: { algorithmic: 1.5, peer: 1 } }] },
  { id: 'food_more_3', category: 'Food / Diet', text: 'Have you ever felt guilty about your diet because of what your friends were eating?', type: 'graded', loads: { peer: 1, insecurity: 1, social: 0.5 } },
  { id: 'food_more_4', category: 'Food / Diet', text: 'Do you buy organic or "premium" groceries mostly because it feels higher class?', type: 'binary', loads: { status: 1, cultural: 0.5 } },
  { id: 'food_more_5', category: 'Food / Diet', text: 'How much do food delivery apps (and their notifications) influence when and what you eat?', type: 'graded', loads: { advertising: 1, algorithmic: 1, habitual: 0.5 } },

  // === MORE BOOKS / READING ===
  { id: 'book_more_1', category: 'Books / Reading', text: 'Do you prioritize reading books that are currently on bestseller lists?', type: 'binary', loads: { social: 1, cultural: 0.8 } },
  { id: 'book_more_2', category: 'Books / Reading', text: 'Why do you usually abandon a book?', type: 'mc', options: [{ text: 'I realize no one else is reading it anymore', loads: { social: 2, peer: 1 } }, { text: 'It stops being useful or interesting to me', loads: { independent: 2, practical: 1 } }, { text: 'I saw a bad review from an influencer I like', loads: { algorithmic: 1.5, social: 1 } }, { text: 'I just fall out of the habit of reading', loads: { habitual: 2 } }] },
  { id: 'book_more_3', category: 'Books / Reading', text: 'Do you feel pressure to display impressive books on your shelves for guests to see?', type: 'graded', loads: { status: 1, insecurity: 0.8, social: 0.5 } },
  { id: 'book_more_4', category: 'Books / Reading', text: 'Have you ever bought a book just because the cover aesthetic was trending?', type: 'binary', loads: { algorithmic: 1, advertising: 0.8, social: 0.5 } },
  { id: 'book_more_5', category: 'Books / Reading', text: 'How often do you read books simply because they are considered "classics" you are supposed to read?', type: 'graded', loads: { cultural: 1, social: 0.5, status: 0.5 } },

  // === MORE FITNESS / WELLNESS ===
  { id: 'fit_more_1', category: 'Fitness / Wellness', text: 'Have you ever bought workout gear specifically to look like you fit in at your gym?', type: 'binary', loads: { peer: 1, insecurity: 0.8, status: 0.5 } },
  { id: 'fit_more_2', category: 'Fitness / Wellness', text: 'How do you choose your workout routine?', type: 'mc', options: [{ text: 'I follow the latest viral challenge', loads: { algorithmic: 2, social: 1 } }, { text: 'I stick to what I have done for years', loads: { habitual: 2 } }, { text: 'I do whatever my friends are doing', loads: { peer: 2 } }, { text: 'I research what works best for my specific body goals', loads: { practical: 2, independent: 1 } }] },
  { id: 'fit_more_3', category: 'Fitness / Wellness', text: 'Do you feel bad about your fitness level if you skip a workout and see others posting theirs?', type: 'graded', loads: { insecurity: 1, social: 1, algorithmic: 0.5 } },
  { id: 'fit_more_4', category: 'Fitness / Wellness', text: 'Do you use fitness trackers mostly because you like showing off your stats to friends?', type: 'binary', loads: { status: 1, peer: 0.8 } },
  { id: 'fit_more_5', category: 'Fitness / Wellness', text: 'How often do you buy supplements just because a fitness influencer heavily promoted them?', type: 'graded', loads: { advertising: 1, algorithmic: 1, insecurity: 0.5 } },

  // === MORE ENTERTAINMENT ===
  { id: 'ent_more_1', category: 'Entertainment', text: 'Do you ever pretend to have watched a popular show just so you can join the conversation?', type: 'binary', loads: { peer: 1, insecurity: 0.8, social: 0.8 } },
  { id: 'ent_more_2', category: 'Entertainment', text: 'How do you pick a movie for movie night?', type: 'mc', options: [{ text: 'Whatever Netflix puts on the top banner', loads: { advertising: 2, algorithmic: 1 } }, { text: 'A highly acclaimed award-winner', loads: { status: 1.5, cultural: 1 } }, { text: 'A genre or director I personally love, regardless of reviews', loads: { independent: 2 } }, { text: 'Whatever my friends insist on watching', loads: { peer: 2 } }] },
  { id: 'ent_more_3', category: 'Entertainment', text: 'Do you feel a fear of missing out (FOMO) if you do not see a blockbuster movie on opening weekend?', type: 'graded', loads: { insecurity: 1, cultural: 1, social: 0.5 } },
  { id: 'ent_more_4', category: 'Entertainment', text: 'Have you ever started disliking a movie you initially enjoyed just because the internet decided it was bad?', type: 'binary', loads: { social: 1, algorithmic: 0.8, insecurity: 0.5 } },
  { id: 'ent_more_5', category: 'Entertainment', text: 'How often do you rewatch the same shows over and over simply out of comfort?', type: 'graded', loads: { habitual: 1, independent: 0.5 } },

  // === MORE SOCIAL MEDIA ===
  { id: 'soc_more_1', category: 'Social Media', text: 'Have you ever deleted a post because it did not get enough likes fast enough?', type: 'binary', loads: { insecurity: 1, social: 1, status: 0.5 } },
  { id: 'soc_more_2', category: 'Social Media', text: 'When you open a social app, what is your main goal?', type: 'mc', options: [{ text: 'To see what everyone else is talking about', loads: { social: 2, cultural: 1 } }, { text: 'To post updates that make my life look good', loads: { status: 2, insecurity: 1 } }, { text: 'I do not even have a goal, I just open it automatically', loads: { habitual: 2 } }, { text: 'To find specific information or inspiration for a project', loads: { practical: 2, independent: 1 } }] },
  { id: 'soc_more_3', category: 'Social Media', text: 'Do you find yourself using slang or phrases you picked up entirely from TikTok/Twitter?', type: 'graded', loads: { algorithmic: 1, cultural: 1, social: 0.5 } },
  { id: 'soc_more_4', category: 'Social Media', text: 'Have you ever felt your mood drop simply because you saw peers posting about their successes?', type: 'binary', loads: { insecurity: 1, peer: 1 } },
  { id: 'soc_more_5', category: 'Social Media', text: 'How much do targeted ads in your feed actually convince you to buy things?', type: 'graded', loads: { advertising: 1, algorithmic: 1 } }
];
export const getQuestionsByCategory = (categories: string[]) => {
  return questionBank.filter(q => categories.includes(q.category) || q.category === 'General');
};
