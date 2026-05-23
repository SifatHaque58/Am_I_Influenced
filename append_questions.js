const fs = require('fs');

const newQuestions = `
  // === MORE FASHION ===
  { id: 'fash_more_1', category: 'Fashion', text: 'Have you ever avoided wearing an outfit because you felt it was "last season"?', type: 'binary', loads: { social: 1, status: 0.8, insecurity: 0.8 } },
  { id: 'fash_more_2', category: 'Fashion', text: 'How do you decide what to wear to an important event?', type: 'mc', options: [{ text: 'Check what influencers are wearing', loads: { algorithmic: 2, social: 1 } }, { text: 'Ask friends for advice', loads: { peer: 2, insecurity: 1 } }, { text: 'Wear something I know is prestigious', loads: { status: 2 } }, { text: 'Wear my favorite comfortable piece', loads: { independent: 2, practical: 1 } }] },
  { id: 'fash_more_3', category: 'Fashion', text: 'Do you feel pressure to buy from sustainable brands because of social expectations?', type: 'graded', loads: { cultural: 1, social: 1, status: 0.5 } },
  { id: 'fash_more_4', category: 'Fashion', text: 'If a celebrity you admire wears a strange new style, do you start liking it?', type: 'binary', loads: { social: 1, algorithmic: 0.5 } },
  { id: 'fash_more_5', category: 'Fashion', text: 'How often do you buy clothes just because they are heavily discounted, even if you don\\'t need them?', type: 'graded', loads: { advertising: 1, practical: -1, habitual: 0.5 } },
  
  // === MORE BEAUTY / MAKEUP ===
  { id: 'bty_more_1', category: 'Beauty / Makeup', text: 'Do you buy skincare products primarily because of TikTok/Instagram trends?', type: 'binary', loads: { algorithmic: 1, social: 0.8 } },
  { id: 'bty_more_2', category: 'Beauty / Makeup', text: 'How do you react when a favorite product changes its packaging?', type: 'mc', options: [{ text: 'Buy it immediately to have the new look', loads: { status: 1, habitual: 1 } }, { text: 'Wait to see reviews online', loads: { social: 1, peer: 1 } }, { text: 'Only buy it when my old one runs out', loads: { practical: 2 } }, { text: 'Switch brands if the formula changed', loads: { independent: 1, practical: 1 } }] },
  { id: 'bty_more_3', category: 'Beauty / Makeup', text: 'Do you feel insecure about your appearance if you don\\'t use certain popular beauty products?', type: 'graded', loads: { insecurity: 1, social: 0.8, peer: 0.5 } },
  { id: 'bty_more_4', category: 'Beauty / Makeup', text: 'Have you ever bought a beauty product purely because the packaging looked good for social media?', type: 'binary', loads: { status: 1, social: 0.8, algorithmic: 0.5 } },
  { id: 'bty_more_5', category: 'Beauty / Makeup', text: 'How often do you stick to the exact same beauty routine out of pure habit?', type: 'graded', loads: { habitual: 1, practical: 0.5, independent: 0.5 } },

  // === MORE SHOPPING ===
  { id: 'shop_more_1', category: 'Shopping', text: 'Have you ever bought something just because it was a "limited edition"?', type: 'binary', loads: { status: 1, advertising: 1, insecurity: 0.5 } },
  { id: 'shop_more_2', category: 'Shopping', text: 'When browsing online stores, what makes you click "Add to Cart"?', type: 'mc', options: [{ text: '"Only 2 left in stock!" warnings', loads: { advertising: 2, insecurity: 1 } }, { text: 'High ratings and hundreds of reviews', loads: { social: 2, practical: 0.5 } }, { text: 'It looks like a high-status item', loads: { status: 2 } }, { text: 'I specifically searched for it because I need it', loads: { practical: 2, independent: 1 } }] },
  { id: 'shop_more_3', category: 'Shopping', text: 'Do you find yourself buying things you didn\\'t plan to when browsing physical stores?', type: 'graded', loads: { habitual: 1, advertising: 0.8 } },
  { id: 'shop_more_4', category: 'Shopping', text: 'Do you care if the shopping bags you carry around the mall are from prestigious brands?', type: 'binary', loads: { status: 1, social: 0.8 } },
  { id: 'shop_more_5', category: 'Shopping', text: 'How often do you make purchases during major sales events (like Black Friday) just because it\\'s a tradition?', type: 'graded', loads: { cultural: 1, habitual: 1, advertising: 0.5 } },

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
  { id: 'fit_more_2', category: 'Fitness / Wellness', text: 'How do you choose your workout routine?', type: 'mc', options: [{ text: 'I follow the latest viral challenge', loads: { algorithmic: 2, social: 1 } }, { text: 'I stick to what I\\'ve done for years', loads: { habitual: 2 } }, { text: 'I do whatever my friends are doing', loads: { peer: 2 } }, { text: 'I research what works best for my specific body goals', loads: { practical: 2, independent: 1 } }] },
  { id: 'fit_more_3', category: 'Fitness / Wellness', text: 'Do you feel bad about your fitness level if you skip a workout and see others posting theirs?', type: 'graded', loads: { insecurity: 1, social: 1, algorithmic: 0.5 } },
  { id: 'fit_more_4', category: 'Fitness / Wellness', text: 'Do you use fitness trackers mostly because you like showing off your stats to friends?', type: 'binary', loads: { status: 1, peer: 0.8 } },
  { id: 'fit_more_5', category: 'Fitness / Wellness', text: 'How often do you buy supplements just because a fitness influencer heavily promoted them?', type: 'graded', loads: { advertising: 1, algorithmic: 1, insecurity: 0.5 } },

  // === MORE ENTERTAINMENT ===
  { id: 'ent_more_1', category: 'Entertainment', text: 'Do you ever pretend to have watched a popular show just so you can join the conversation?', type: 'binary', loads: { peer: 1, insecurity: 0.8, social: 0.8 } },
  { id: 'ent_more_2', category: 'Entertainment', text: 'How do you pick a movie for movie night?', type: 'mc', options: [{ text: 'Whatever Netflix puts on the top banner', loads: { advertising: 2, algorithmic: 1 } }, { text: 'A highly acclaimed award-winner', loads: { status: 1.5, cultural: 1 } }, { text: 'A genre or director I personally love, regardless of reviews', loads: { independent: 2 } }, { text: 'Whatever my friends insist on watching', loads: { peer: 2 } }] },
  { id: 'ent_more_3', category: 'Entertainment', text: 'Do you feel a fear of missing out (FOMO) if you don\\'t see a blockbuster movie on opening weekend?', type: 'graded', loads: { insecurity: 1, cultural: 1, social: 0.5 } },
  { id: 'ent_more_4', category: 'Entertainment', text: 'Have you ever started disliking a movie you initially enjoyed just because the internet decided it was bad?', type: 'binary', loads: { social: 1, algorithmic: 0.8, insecurity: 0.5 } },
  { id: 'ent_more_5', category: 'Entertainment', text: 'How often do you rewatch the same shows over and over simply out of comfort?', type: 'graded', loads: { habitual: 1, independent: 0.5 } },

  // === MORE SOCIAL MEDIA ===
  { id: 'soc_more_1', category: 'Social Media', text: 'Have you ever deleted a post because it didn\\'t get enough likes fast enough?', type: 'binary', loads: { insecurity: 1, social: 1, status: 0.5 } },
  { id: 'soc_more_2', category: 'Social Media', text: 'When you open a social app, what is your main goal?', type: 'mc', options: [{ text: 'To see what everyone else is talking about', loads: { social: 2, cultural: 1 } }, { text: 'To post updates that make my life look good', loads: { status: 2, insecurity: 1 } }, { text: 'I don\\'t even have a goal, I just open it automatically', loads: { habitual: 2 } }, { text: 'To find specific information or inspiration for a project', loads: { practical: 2, independent: 1 } }] },
  { id: 'soc_more_3', category: 'Social Media', text: 'Do you find yourself using slang or phrases you picked up entirely from TikTok/Twitter?', type: 'graded', loads: { algorithmic: 1, cultural: 1, social: 0.5 } },
  { id: 'soc_more_4', category: 'Social Media', text: 'Have you ever felt your mood drop simply because you saw peers posting about their successes?', type: 'binary', loads: { insecurity: 1, peer: 1 } },
  { id: 'soc_more_5', category: 'Social Media', text: 'How much do targeted ads in your feed actually convince you to buy things?', type: 'graded', loads: { advertising: 1, algorithmic: 1 } }
];

const content = fs.readFileSync('src/data/questions.ts', 'utf8');
const insertionPoint = content.lastIndexOf('];');

if (insertionPoint !== -1) {
  const newContent = content.slice(0, insertionPoint) + ',' + newQuestions + '\n' + content.slice(insertionPoint);
  fs.writeFileSync('src/data/questions.ts', newContent);
  console.log("Successfully appended 40 new questions!");
} else {
  console.log("Could not find insertion point.");
}
