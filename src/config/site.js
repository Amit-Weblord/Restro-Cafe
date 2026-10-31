// ─────────────────────────────────────────────────────────────────────────────
//  ONE FILE TO REBRAND THE WHOLE WEBSITE FOR A NEW CLIENT
//
//  Change the name, colours, contact details, menu, events and photos here.
//  Photos live in /public/images — drop the client's photos in with the same
//  file names (or change the file names below).
//
//  Anything marked SAMPLE is demo content for the pitch. Replace it with the
//  client's real details before the site goes live.
// ─────────────────────────────────────────────────────────────────────────────

const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

export const site = {
  brand: {
    name: 'Ember & Thyme',
    // Used for the logo: first word, joiner, second word
    logo: ['Ember', '&', 'Thyme'],
    kind: 'Kitchen · Café · Bar',
    since: 2014,
    city: 'Bengaluru',
  },

  // Main accent colour. Every gold detail on the site (and the 3D scene) uses it.
  theme: { accent: '#d6a756', accentSoft: '#ecca8c' },

  // Floating "brand colour" switcher — handy in a pitch ("this can be in YOUR colours").
  // Set themeSwitcher to false for the client's live site.
  demo: {
    themeSwitcher: true,
    palettes: [
      { name: 'Saffron gold', accent: '#d6a756', accentSoft: '#ecca8c' },
      { name: 'Terracotta', accent: '#d9774b', accentSoft: '#f0a882' },
      { name: 'Sage', accent: '#9fb88a', accentSoft: '#c6dab4' },
      { name: 'Rosé', accent: '#d98c9a', accentSoft: '#f0bcc5' },
      { name: 'Ocean', accent: '#6fb3c9', accentSoft: '#a8d6e5' },
    ],
  },

  // Small credit line in the footer — put your agency / studio name here.
  credit: { name: 'Your Studio', url: '#' },

  contact: {
    // SAMPLE
    phone: '+91 98765 43210',
    whatsapp: '919876543210', // country code + number, digits only
    email: 'hello@emberandthyme.in',
    address: '12 Lavelle Road, Ashok Nagar, Bengaluru 560001',
    mapUrl: 'https://maps.google.com/?q=Lavelle+Road+Bengaluru',
    hours: [
      { days: 'Mon – Fri', time: '8:00 AM – 11:00 PM' },
      { days: 'Sat – Sun', time: '8:00 AM – 12:00 AM' },
    ],
  },

  socials: [
    { type: 'instagram', label: 'Instagram', url: 'https://instagram.com/' },
    { type: 'facebook', label: 'Facebook', url: 'https://facebook.com/' },
    { type: 'youtube', label: 'YouTube', url: 'https://youtube.com/' },
  ],

  nav: [
    { id: 'story', label: 'About' },
    { id: 'menu', label: 'Menu' },
    { id: 'dishes', label: 'Signatures' },
    { id: 'events', label: 'Events' },
    { id: 'reserve', label: 'Reservation' },
  ],

  hero: {
    eyebrow: 'Restaurant & Café · Since 2014',
    lines: ['Welcome to', 'Ember & Thyme', 'kitchen & café'],
    accentLine: 1, // which line is gold + italic
    text: 'Wood-fired plates, slow-brewed coffee and a garden courtyard in the heart of the city. Come hungry, stay late.',
    image: img('hero-dish.jpg'), // shown on the spinning 3D plate
    imageZoom: 1.08, // >1 zooms the photo in on the plate
    stats: [
      // SAMPLE
      { value: '4.9★', label: 'Guest rating' },
      { value: '120+', label: 'Dishes & brews' },
      { value: '8 AM', label: 'Doors open daily' },
    ],
  },

  // Full-screen reveal behind the steam transition
  space: {
    eyebrow: 'Step inside',
    title: 'The Ember Garden',
    text: 'Plant-filled café · Open kitchen · 90 seats',
    image: img('space.jpg'),
  },

  story: {
    eyebrow: 'Discover',
    title: ['Our Delicious', 'Story'],
    text: [
      'Ember & Thyme began as a six-table café with one wood-fired oven and a stubborn belief: honest ingredients, cooked over real fire, taste better.',
      'Today our kitchen still starts every morning by lighting the embers — for sourdough at breakfast, smoky tandoor plates at dinner and everything in between.',
    ],
    image: img('story.jpg'),
    badge: 'Since 2014 • Slow fire • Good food • ',
  },

  marquee: ['Wood-fired', 'Fresh every morning', 'House-roasted coffee', 'Farm to table', 'Open late'],

  menu: {
    eyebrow: 'Discover',
    title: ['Our', 'Menu'],
    text: 'Our team spent months testing recipes with local farmers and roasters so there is something for every mood — from a slow breakfast to a long dinner with friends.',
  },

  // The three big zig-zag plates. `category` opens that tab of the full menu.
  menuHighlights: [
    {
      title: 'Sunrise breakfasts',
      text: 'Served all day for the late risers — sourdough, farm eggs, fresh fruit and our house-roasted coffee.',
      image: img('menu-breakfast.jpg'),
      category: 'breakfast',
    },
    {
      title: 'Fire-kissed dinners',
      text: 'From tandoor to wood-fire grill — vegetarian and non-vegetarian plates made for sharing.',
      image: img('menu-dinner.jpg'),
      category: 'mains',
    },
    {
      title: 'Sweet endings',
      text: 'Desserts and café bakes made fresh every morning by our pastry team.',
      image: img('menu-dessert.jpg'),
      category: 'desserts',
    },
  ],

  // Full menu shown in the "View menu" overlay. SAMPLE prices.
  fullMenu: [
    {
      id: 'cafe',
      label: 'Café & Brews',
      items: [
        { name: 'Single-origin Pour Over', desc: 'Chikmagalur beans, hand-poured', price: 240, veg: true, tag: 'House roast' },
        { name: 'Cappuccino', desc: 'Double shot, velvety milk foam', price: 220, veg: true },
        { name: 'Cold Brew Tonic', desc: '18-hour cold brew, tonic, orange peel', price: 260, veg: true },
        { name: 'Masala Chai Latte', desc: 'Our own spice blend, steamed milk', price: 180, veg: true, tag: 'Bestseller' },
        { name: 'Hazelnut Mocha', desc: 'Dark chocolate, roasted hazelnut', price: 280, veg: true },
        { name: 'Matcha Cloud', desc: 'Ceremonial matcha, oat milk, vanilla', price: 300, veg: true },
      ],
    },
    {
      id: 'breakfast',
      label: 'Breakfast',
      items: [
        { name: 'Avocado Sourdough', desc: 'Smashed avocado, chilli, lime, seeds', price: 420, veg: true, tag: 'Bestseller' },
        { name: 'Buttermilk Pancakes', desc: 'Berries, maple, whipped butter', price: 380, veg: true },
        { name: 'Shakshuka', desc: 'Baked eggs, spiced tomato, warm pita', price: 440, veg: false },
        { name: 'Akuri on Toast', desc: 'Parsi-style spiced scrambled eggs', price: 360, veg: false },
        { name: 'Granola Bowl', desc: 'House granola, Greek yoghurt, honey', price: 340, veg: true },
        { name: 'Masala Omelette & Pav', desc: 'Green chilli, onion, coriander', price: 320, veg: false },
      ],
    },
    {
      id: 'mains',
      label: 'Mains',
      items: [
        { name: 'Wood-fired Chicken Tikka', desc: 'Charred, smoky, mint chutney', price: 540, veg: false, tag: "Chef's pick" },
        { name: 'Paneer Butter Masala', desc: 'Silky tomato makhani, butter naan', price: 460, veg: true },
        { name: 'Lamb Rogan Josh', desc: 'Slow-braised shank, Kashmiri chilli', price: 780, veg: false },
        { name: 'Truffle Mushroom Risotto', desc: 'Arborio, parmesan, truffle oil', price: 620, veg: true },
        { name: 'Grilled Fish, Lemon Butter', desc: 'Catch of the day, herbed potatoes', price: 640, veg: false },
        { name: 'Ember Smash Burger', desc: 'Double patty, cheddar, house pickles', price: 520, veg: false },
      ],
    },
    {
      id: 'desserts',
      label: 'Desserts',
      items: [
        { name: 'Burnt Basque Cheesecake', desc: 'Caramelised top, berry compote', price: 380, veg: true, tag: 'Bestseller' },
        { name: 'Gulab Jamun Tiramisu', desc: 'Mascarpone, cardamom, espresso', price: 360, veg: true },
        { name: 'Dark Chocolate Fondant', desc: 'Molten centre, vanilla gelato', price: 420, veg: true },
        { name: 'Saffron Pistachio Kulfi', desc: 'Slow-reduced milk, Kashmiri saffron', price: 280, veg: true },
      ],
    },
  ],

  // "Signature dishes" horizontal gallery. SAMPLE prices.
  dishes: [
    { name: 'Meatball Spaghetti', desc: 'Slow-simmered tomato sugo, hand-rolled meatballs, parmesan, basil', price: 560, veg: false, image: img('dish-1.jpg'), tag: "Chef's pick" },
    { name: 'Fire-grilled Steak', desc: 'Char-grilled tenderloin, rested and sliced, rosemary jus, smoked salt', price: 980, veg: false, image: img('dish-2.jpg') },
    { name: 'Garden Buddha Bowl', desc: 'Avocado, chickpeas, roast sweet potato, red cabbage, microgreens', price: 420, veg: true, image: img('dish-3.jpg') },
    { name: 'Tandoori Chicken Pizza', desc: 'Wood-fired base, tandoori chicken, red onion, fresh coriander', price: 540, veg: false, image: img('dish-4.jpg'), tag: 'Bestseller' },
    { name: 'Butter Chicken & Naan', desc: 'Silky makhani gravy, charred tandoor naan, coriander', price: 520, veg: false, image: img('dish-5.jpg') },
    { name: 'Raspberry Cream Cake', desc: 'Layered vanilla sponge, whipped cream, fresh raspberries', price: 340, veg: true, image: img('dish-6.jpg') },
  ],

  services: {
    eyebrow: 'What we offer',
    title: ['Our Great', 'Services'],
    text: 'The atmosphere sets the stage. It is about more than a dining room — it is a place where food takes the spotlight and every guest feels at home.',
    items: [
      { icon: 'events', title: 'Private events', text: 'Birthdays, anniversaries and team dinners for up to 80 guests.' },
      { icon: 'chef', title: "Chef's tasting menu", text: 'A seasonal 7-course journey, paired with wine or mocktails.' },
      { icon: 'delivery', title: 'Delivery & takeaway', text: 'Hot from our kitchen to your door, packed with care.' },
      { icon: 'coffee', title: 'Café & co-working', text: 'Fast Wi-Fi, bottomless filter coffee and quiet corners.' },
    ],
  },

  events: {
    eyebrow: 'Discover',
    title: 'Upcoming Events',
    text: 'Live music, open-fire evenings and long Sunday brunches — there is always something happening at Ember.',
    items: [
      {
        title: 'Candlelight Supper Club',
        when: 'Every Saturday',
        time: '7:30 PM onwards',
        place: 'Garden terrace',
        text: "A four-course chef's menu by candlelight, with wine or mocktail pairings.",
        image: img('event.jpg'),
      },
      {
        title: 'Acoustic Fridays',
        when: 'Every Friday',
        time: '8:00 PM – 11:00 PM',
        place: 'Main hall',
        text: 'Local artists, warm lights and a special small-plates menu.',
        image: img('reserve-bg.jpg'),
      },
      {
        title: 'Sunday Brunch Club',
        when: 'Every Sunday',
        time: '11:00 AM – 3:00 PM',
        place: 'Café & courtyard',
        text: 'Bottomless coffee, live pancake station and kids eat free.',
        image: img('cafe.jpg'),
      },
    ],
  },

  testimonials: {
    eyebrow: 'Kind words',
    title: 'What Our Guests Say',
    // SAMPLE — replace with the client's real reviews
    rating: { score: '4.9', count: '1,200+' },
    image: img('cafe.jpg'),
    items: [
      { name: 'Ananya R.', occasion: 'Anniversary dinner', stars: 5, text: 'The wood-fired chicken was unreal and the staff made our anniversary feel so special. The courtyard at night is magical.' },
      { name: 'Rahul M.', occasion: 'Sunday brunch', stars: 5, text: 'Best pancakes in the city, and the cold brew tonic is my new obsession. We are already regulars.' },
      { name: 'Priya S.', occasion: 'Team lunch', stars: 4, text: 'Beautiful space, quick service even for a group of twelve. The paneer butter masala is a must.' },
      { name: 'Arjun K.', occasion: 'Date night', stars: 5, text: 'Live acoustic music, candle-lit tables and a dessert I still think about. Book the terrace!' },
      { name: 'Meera N.', occasion: 'Family dinner', stars: 5, text: 'Something for everyone — my parents loved the rogan josh and the kids loved the pizza.' },
      { name: 'Kabir D.', occasion: 'Working from café', stars: 5, text: 'Great coffee, fast Wi-Fi and nobody rushes you. My favourite place to get work done.' },
    ],
  },

  reservation: {
    eyebrow: 'Reservation',
    title: 'Book Your Table',
    text: 'Reserve in under a minute. We will confirm your table on WhatsApp.',
    image: img('reserve-bg.jpg'),
    maxGuests: 12,
    occasions: ['Just dinner', 'Birthday', 'Anniversary', 'Date night', 'Business'],
    // Opening 8:00, last seating 22:30
    firstSlot: 8 * 60,
    lastSlot: 22 * 60 + 30,
  },
};

export const images = {
  chef: img('chef.jpg'),
  cafe: img('cafe.jpg'),
};
