/**
 * AI Travel & Expense Intelligence Engine
 * 
 * Supports:
 * 1. Universal Worldwide Trip Itineraries (All Countries, States, & Cities across the globe)
 * 2. Custom Duration & Dynamic Budget Calculations in INR (₹)
 * 3. Expense Parsing & One-Click Logging
 * 4. OpenAI GPT integration with comprehensive local offline NLP fallback.
 */

// Comprehensive Global Destination Intelligence Database
const GLOBAL_DESTINATIONS = {
  // === INTERNATIONAL DESTINATIONS ===
  paris: {
    name: 'Paris, France (The City of Light & Romance)',
    country: 'France',
    isInternational: true,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 125000,
    highlights: ['Eiffel Tower & Champ de Mars', 'Louvre Museum & Mona Lisa', 'Seine River Sunset Cruise', 'Montmartre & Sacré-Cœur', 'Palace of Versailles'],
    food: ['Fresh Butter Croissants & Baguettes', 'French Macarons from Ladurée', 'Duck Confit & Beef Bourguignon', 'Crêpes & French Cheese Platter'],
    days: [
      {
        day: 1,
        title: 'Arrival in Paris, Seine Cruise & Eiffel Tower Lights',
        morning: 'Arrive at Charles de Gaulle (CDG) Airport, check into hotel in central Paris (Le Marais / Latin Quarter).',
        afternoon: 'Stroll along Champs-Élysées and climb the Arc de Triomphe for panoramic avenue views.',
        evening: 'Sunset 1-hour cruise along the River Seine followed by viewing the sparkling Eiffel Tower at night.',
        estimatedCost: 28000,
        category: 'Stay & Sights'
      },
      {
        day: 2,
        title: 'World Art & Gothic Masterpieces',
        morning: 'Morning skip-the-line tour of the Louvre Museum (Mona Lisa, Venus de Milo, Winged Victory).',
        afternoon: 'Walk through Tuileries Garden and visit Sainte-Chapelle with its breathtaking stained glass windows and Notre-Dame Cathedral.',
        evening: 'Romantic dinner at a classic Parisian bistro in Saint-Germain-des-Prés.',
        estimatedCost: 24000,
        category: 'Museums & Dining'
      },
      {
        day: 3,
        title: 'Bohemian Montmartre & Historic Cafes',
        morning: 'Explore the cobblestone hills of Montmartre, Place du Tertre artists square, and the white Basilica of Sacré-Cœur.',
        afternoon: 'Photo stop at the iconic Moulin Rouge, followed by shopping at Galeries Lafayette rooftop.',
        evening: 'Enjoy French wine tasting and fondue dinner at a vintage Montmartre cafe.',
        estimatedCost: 22000,
        category: 'Culture & Shopping'
      },
      {
        day: 4,
        title: 'Royal Palace of Versailles Day Trip',
        morning: 'Take the RER C train (approx 45 mins) to the opulent Palace of Versailles (Hall of Mirrors & King’s Apartments).',
        afternoon: 'Rent a bicycle or golf cart to explore the vast Grand Gardens, Musical Fountains, and Marie Antoinette’s Estate.',
        evening: 'Return to Paris for dinner overlooking the River Seine.',
        estimatedCost: 26000,
        category: 'Excursion & Dining'
      },
      {
        day: 5,
        title: 'Latin Quarter, Musée d’Orsay & Departure',
        morning: 'Visit Musée d’Orsay (world’s greatest Impressionist masterworks by Monet, Van Gogh, Renoir).',
        afternoon: 'Browse vintage bookstalls along the Seine (Bouquinistes) and pick up macarons and French perfumes.',
        evening: 'Transfer to CDG airport with golden Parisian memories.',
        estimatedCost: 25000,
        category: 'Transit & Departure'
      }
    ],
    tips: [
      'Get a Paris Navigo Easy card or 10-ticket t+ booklet for fast, cheap Metro travel.',
      'Book Eiffel Tower and Louvre Museum tickets 3-4 weeks in advance online to avoid sold-out slots.',
      'Carry a universal European Type C/E plug adapter and download the Citymapper app for navigation.'
    ]
  },

  london: {
    name: 'London, United Kingdom (Royal Heritage & Modern Pulse)',
    country: 'United Kingdom',
    isInternational: true,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 135000,
    highlights: ['Big Ben & Westminster Abbey', 'Tower of London & Tower Bridge', 'British Museum & London Eye', 'Buckingham Palace & West End Show'],
    food: ['Traditional English Fish & Chips', 'Afternoon High Tea with Scones', 'Sunday Roast with Yorkshire Pudding', 'Borough Market Street Food'],
    days: [
      {
        day: 1,
        title: 'Royal Westminster & The London Eye',
        morning: 'Arrive at Heathrow/Gatwick, check into hotel; walk past Big Ben and the Houses of Parliament.',
        afternoon: 'Tour the coronation church of Westminster Abbey and stroll through St. James’s Park to Buckingham Palace.',
        evening: 'Ride the London Eye at sunset for 360° skyline views followed by riverside dinner on the South Bank.',
        estimatedCost: 30000,
        category: 'Icons & Stay'
      },
      {
        day: 2,
        title: 'Tower of London, Tower Bridge & Borough Market',
        morning: 'Explore the historic Tower of London and view the glittering Crown Jewels.',
        afternoon: 'Walk across Tower Bridge glass floor; feast on artisanal delicacies at world-famous Borough Market.',
        evening: 'View the city from Sky Garden (free observation deck) and have drinks in Covent Garden.',
        estimatedCost: 26000,
        category: 'History & Food'
      },
      {
        day: 3,
        title: 'World Museums & West End Theatre',
        morning: 'Visit the British Museum (Rosetta Stone, Egyptian Mummies) or Natural History Museum in Kensington.',
        afternoon: 'Luxury shopping on Regent Street, Oxford Street, and Harrods in Knightsbridge.',
        evening: 'Catch a world-class West End musical (e.g., Phantom of the Opera, Lion King) in Leicester Square.',
        estimatedCost: 28000,
        category: 'Arts & Shows'
      },
      {
        day: 4,
        title: 'Windsor Castle or Greenwich Meridian Day Trip',
        morning: 'Take train to Windsor Castle (oldest inhabited royal castle in the world) or river boat to Royal Observatory Greenwich.',
        afternoon: 'Stand on the Prime Meridian Line (GMT) and stroll through historic maritime Greenwich market.',
        evening: 'Traditional British pub dinner with craft ale and shepherd’s pie.',
        estimatedCost: 27000,
        category: 'Excursion & Pubs'
      },
      {
        day: 5,
        title: 'Hyde Park, Notting Hill & Departure',
        morning: 'Walk through Hyde Park and Kensington Gardens; photograph pastel houses and vintage antiques on Portobello Road in Notting Hill.',
        afternoon: 'Classic English Afternoon High Tea with clotted cream scones and sandwiches.',
        evening: 'Board Heathrow Express for departure.',
        estimatedCost: 24000,
        category: 'Transit & Leisure'
      }
    ],
    tips: [
      'Use contactless debit/credit card or Apple/Google Pay directly on the London Tube/Buses (cheaper than single paper tickets).',
      'Most major London museums (British Museum, Natural History, Science, Tate Modern) have FREE admission!',
      'Pack a compact travel umbrella and a light layer even in summer.'
    ]
  },

  dubai: {
    name: 'Dubai & Abu Dhabi, UAE (Futuristic Luxury & Desert Wonders)',
    country: 'United Arab Emirates',
    isInternational: true,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 85000,
    highlights: ['Burj Khalifa 124th/125th Floor', 'Red Dunes Desert Safari & BBQ', 'Dubai Mall & Fountain Show', 'Museum of the Future & Palm Jumeirah'],
    food: ['Authentic Arabic Shawarma & Falafel', 'Emirati Machboos', 'Kunafa & Baklava Desserts', 'Luxury Yacht Dining'],
    days: [
      {
        day: 1,
        title: 'Arrival, Dubai Mall & Burj Khalifa Sunset',
        morning: 'Arrive at DXB Airport, check into downtown or Marina hotel.',
        afternoon: 'Explore Dubai Mall, Underwater Zoo & Aquarium, and visit "At The Top" Burj Khalifa.',
        evening: 'Watch the choreographed Dubai Fountain show and enjoy dinner overlooking the lake.',
        estimatedCost: 20000,
        category: 'Downtown & Sights'
      },
      {
        day: 2,
        title: 'Old Dubai Heritage & Thrilling Desert Safari',
        morning: 'Abra boat ride across Dubai Creek (1 AED); explore Gold Souk and Spice Souk in Deira.',
        afternoon: '4x4 Desert Safari: Dune bashing, sandboarding, and camel rides in Lahbab red dunes.',
        evening: 'Bedouin desert camp buffet dinner with live Belly Dance, Tanoura show, and stargazing.',
        estimatedCost: 18000,
        category: 'Culture & Safari'
      },
      {
        day: 3,
        title: 'Palm Jumeirah, Atlantis & Marina Yacht Cruise',
        morning: 'Ride the Palm Monorail to Atlantis The Palm; visit The View at The Palm observation deck.',
        afternoon: 'Relax at JBR The Beach or explore the futuristic Museum of the Future.',
        evening: 'Sunset luxury shared yacht cruise along Dubai Marina and Ain Dubai wheel.',
        estimatedCost: 19000,
        category: 'Marina & Cruise'
      },
      {
        day: 4,
        title: 'Abu Dhabi Day Excursion (Grand Mosque & Louvre)',
        morning: 'Drive to Abu Dhabi (1.5 hrs) to visit the majestic Sheikh Zayed Grand Mosque with white marble domes.',
        afternoon: 'Visit Louvre Abu Dhabi museum and photo stop at Ferrari World / Emirates Palace.',
        evening: 'Return to Dubai for authentic Lebanese or Indian dinner in Karama.',
        estimatedCost: 15000,
        category: 'Day Excursion'
      },
      {
        day: 5,
        title: 'Miracle Garden / Global Village & Departure',
        morning: 'Visit Dubai Miracle Garden (72,000 sq m floral sculptures) or Souk Madinat Jumeirah with Burj Al Arab views.',
        afternoon: 'Duty-free shopping for dates, gold, and chocolates.',
        evening: 'Transfer to DXB Airport for flight home.',
        estimatedCost: 13000,
        category: 'Transit & Shopping'
      }
    ],
    tips: [
      'Dress modestly when visiting cultural sites like the Sheikh Zayed Grand Mosque (cover shoulders and knees; headscarf for women).',
      'Dubai Metro is ultra-modern and directly connects DXB Airport to Downtown and Marina via Red Line.',
      'Best travel months: November to March when temperatures are comfortable and breezy.'
    ]
  },

  tokyo: {
    name: 'Tokyo & Kyoto, Japan (Futuristic Neon & Ancient Shrines)',
    country: 'Japan',
    isInternational: true,
    defaultDuration: '6 Days / 5 Nights',
    defaultBudget: 150000,
    highlights: ['Shibuya Crossing & Shinjuku Neon', 'Mount Fuji Day Trip', 'Senso-ji Ancient Temple', 'Kyoto Fushimi Inari 10,000 Torii Gates'],
    food: ['Authentic Tonkotsu Ramen (Ichiran)', 'Fresh Tsukiji Sushi & Sashimi', 'Wagyu Beef Teppanyaki', 'Matcha Green Tea Ice Cream'],
    days: [
      {
        day: 1,
        title: 'Arrival in Tokyo, Shibuya Crossing & Harajuku',
        morning: 'Arrive at Narita/Haneda Airport, take the Keisei Skyliner / Monorail to hotel in Shinjuku.',
        afternoon: 'Walk across the world-famous Shibuya Scramble Crossing and see the Hachiko statue.',
        evening: 'Explore neon-lit alleys of Omoide Yokocho and Golden Gai for Yakitori skewers and ramen.',
        estimatedCost: 28000,
        category: 'City Vibes & Stay'
      },
      {
        day: 2,
        title: 'Historic Asakusa & Digital Art Experience',
        morning: 'Visit Tokyo’s oldest temple, Senso-ji in Asakusa, and shop along Nakamise street for snacks.',
        afternoon: 'Experience the mind-bending teamLab Planets digital art museum in Toyosu.',
        evening: 'Browse electronics, anime, and gaming culture in Akihabara Electric Town.',
        estimatedCost: 25000,
        category: 'Culture & Tech'
      },
      {
        day: 3,
        title: 'Breathtaking Mount Fuji & Lake Kawaguchiko Day Trip',
        morning: 'Take highway bus or train to Lake Kawaguchiko at the base of Mount Fuji.',
        afternoon: 'Visit Chureito Pagoda for postcard views of Mt. Fuji and ride the Mt. Fuji Panoramic Ropeway.',
        evening: 'Return to Tokyo; enjoy conveyor-belt sushi dinner in Ginza.',
        estimatedCost: 26000,
        category: 'Nature Excursion'
      },
      {
        day: 4,
        title: 'Shinkansen Bullet Train to Kyoto (Ancient Capital)',
        morning: 'Ride the high-speed Shinkansen Bullet Train to Kyoto (approx 2 hrs 15 mins).',
        afternoon: 'Walk through thousands of vermilion Torii gates at Fushimi Inari Taisha Shrine.',
        evening: 'Evening lantern-lit stroll through historic Gion Geisha district and Pontocho alley.',
        estimatedCost: 32000,
        category: 'Bullet Train & Kyoto'
      },
      {
        day: 5,
        title: 'Kyoto Bamboo Forest & Golden Pavilion',
        morning: 'Walk through the towering Arashiyama Bamboo Grove and visit the Tenryu-ji Zen garden.',
        afternoon: 'Tour the dazzling gold-leaf covered Kinkaku-ji (Golden Pavilion).',
        evening: 'Traditional Japanese Kaiseki multi-course dinner.',
        estimatedCost: 22000,
        category: 'Heritage & Food'
      },
      {
        day: 6,
        title: 'Souvenirs & Departure via Tokyo / Osaka Kansai',
        morning: 'Pick up Japanese KitKats, matcha sweets, and ceramics at Nishiki Market or Tokyo Station.',
        afternoon: 'Transfer to airport for return flight.',
        evening: 'Board flight back with unforgettable memories.',
        estimatedCost: 17000,
        category: 'Departure'
      }
    ],
    tips: [
      'Get a digital Suica or Pasmo IC card on your phone for seamless taps on trains, subways, and convenience stores.',
      '7-Eleven and Lawson convenience stores offer delicious, ultra-fresh budget meals (Onigiri, Bento boxes).',
      'Always carry small trash bags as public trash cans are rare in Japan.'
    ]
  },

  bali: {
    name: 'Bali, Indonesia (Tropical Paradise, Temples & Waterfalls)',
    country: 'Indonesia',
    isInternational: true,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 55000,
    highlights: ['Ubud Rice Terraces & Jungle Swing', 'Tanah Lot & Uluwatu Cliff Temples', 'Nusa Penida Island Tour', 'Seminyak & Canggu Beach Sunsets'],
    food: ['Nasi Goreng & Mie Goreng', 'Babi Guling (Balinese Roast)', 'Sate Lilit with Sambal Matah', 'Fresh Coconut & Tropical Smoothie Bowls'],
    days: [
      {
        day: 1,
        title: 'Arrival in Bali & Seminyak Sunset',
        morning: 'Arrive at Ngurah Rai International Airport (Denpasar), transfer to hotel or private pool villa.',
        afternoon: 'Relax by the beach, indulge in a 60-minute Balinese Aromatherapy massage (approx ₹600 - ₹900).',
        evening: 'Watch sunset from a vibrant beach club (Potato Head / Ku De Ta) with seafood and music.',
        estimatedCost: 12000,
        category: 'Arrival & Villa'
      },
      {
        day: 2,
        title: 'Cultural Ubud, Sacred Monkey Forest & Rice Terraces',
        morning: 'Head to Ubud; visit the lush Sacred Monkey Forest Sanctuary with over 700 playful macaques.',
        afternoon: 'Walk through the emerald green Tegalalang Rice Terraces and try the famous giant jungle swing.',
        evening: 'Visit Ubud Royal Palace and dine at a traditional Warung with authentic crispy duck (Bebek Betutu).',
        estimatedCost: 11000,
        category: 'Ubud & Nature'
      },
      {
        day: 3,
        title: 'Nusa Penida Island Adventure Day Trip',
        morning: 'Speedboat from Sanur to Nusa Penida Island (approx 45 mins).',
        afternoon: 'Visit the dramatic T-Rex shaped Kelingking Beach cliff viewpoint, Broken Beach, and Angel’s Billabong natural infinity pool.',
        evening: 'Swim with sea turtles and manta rays at Crystal Bay before returning to Bali mainland.',
        estimatedCost: 13000,
        category: 'Island Excursion'
      },
      {
        day: 4,
        title: 'Waterfalls, Coffee Plantation & Uluwatu Fire Dance',
        morning: 'Swim in the natural pool of Tegenungan or Kanto Lampo Waterfall; visit a Luwak Coffee plantation.',
        afternoon: 'Head south to Uluwatu Temple perched on a 70-meter cliff above crashing ocean waves.',
        evening: 'Watch the dramatic sunset Kecak Fire Dance performance followed by a candlelight seafood dinner on Jimbaran Bay beach.',
        estimatedCost: 11000,
        category: 'Culture & Dining'
      },
      {
        day: 5,
        title: 'Tanah Lot Temple & Souvenir Shopping',
        morning: 'Visit the sea temple of Tanah Lot sitting on an offshore rock formation.',
        afternoon: 'Shop for Balinese rattan bags, wooden handicrafts, and silver jewellery at Ubud Art Market.',
        evening: 'Transfer to Denpasar Airport for flight back.',
        estimatedCost: 8000,
        category: 'Shopping & Transit'
      }
    ],
    tips: [
      'Indians receive Visa on Arrival (VoA - approx 500,000 IDR / ~₹2,700) and fill out the online e-CD customs declaration.',
      'Use the Grab or Gojek apps for easy, cheap cab and scooter rides anywhere in Bali.',
      'Dress respectfully with a provided sarong when entering Balinese Hindu temples.'
    ]
  },

  singapore: {
    name: 'Singapore (The Lion City - Futuristic Gardens & Urban Wonders)',
    country: 'Singapore',
    isInternational: true,
    defaultDuration: '4 Days / 3 Nights',
    defaultBudget: 75000,
    highlights: ['Marina Bay Sands & SkyPark', 'Gardens by the Bay Supertree Grove', 'Universal Studios Sentosa', 'Chinatown & Little India Hawker Centres'],
    food: ['Hainanese Chicken Rice', 'Chili Crab with Fried Mantou', 'Laksa Noodle Soup', 'Roti Prata & Kaya Toast with Kopi'],
    days: [
      {
        day: 1,
        title: 'Jewel Changi, Marina Bay & Supertree Light Show',
        morning: 'Arrive at Changi Airport; witness the world’s tallest indoor waterfall at Jewel Rain Vortex.',
        afternoon: 'Check-in to hotel; stroll past the Merlion statue and explore Marina Bay Sands promenade.',
        evening: 'Visit Gardens by the Bay Flower Dome & Cloud Forest; watch the magical Garden Rhapsody Supertree light & sound show.',
        estimatedCost: 20000,
        category: 'Gardens & Sights'
      },
      {
        day: 2,
        title: 'Universal Studios & Sentosa Island Fun',
        morning: 'Cable car ride to Sentosa Island; spend the day at Universal Studios (Transformers 3D, Battlestar Galactica).',
        afternoon: 'Relax at Siloso Beach or visit S.E.A. Aquarium (one of the world’s largest marine habitats).',
        evening: 'Wings of Time fireworks & laser show on the beach followed by dinner at Sentosa Boardwalk.',
        estimatedCost: 22000,
        category: 'Theme Park & Beach'
      },
      {
        day: 3,
        title: 'Heritage Trails, Chinatown & Night Safari',
        morning: 'Explore Buddha Tooth Relic Temple in Chinatown; walk through colorful Sultan Mosque in Kampong Glam.',
        afternoon: 'Feast on Michelin-star hawker food at Maxwell Food Centre or Lau Pa Sat (Satay Street).',
        evening: 'World’s first Night Safari tram tour through open nocturnal wildlife habitats.',
        estimatedCost: 19000,
        category: 'Culture & Wildlife'
      },
      {
        day: 4,
        title: 'Orchard Road Shopping & Departure',
        morning: 'Walk along the skyway canopy of Southern Ridges or shop designer brands on Orchard Road.',
        afternoon: 'Pick up famous Pandan Chiffon cake and Kaya jam at Changi Airport duty-free.',
        evening: 'Departure flight home.',
        estimatedCost: 14000,
        category: 'Shopping & Transit'
      }
    ],
    tips: [
      'Singapore MRT (Mass Rapid Transit) is the fastest way to get anywhere; tap your contactless credit card directly at fare gates.',
      'Hawker centres offer clean, incredibly delicious meals for just $4 - $8 SGD (₹250 - ₹500).',
      'Chewing gum is illegal in Singapore, and strict fines apply for littering.'
    ]
  },

  switzerland: {
    name: 'Switzerland (The Alpine Wonderland - Lucerne, Interlaken & Jungfrau)',
    country: 'Switzerland',
    isInternational: true,
    defaultDuration: '6 Days / 5 Nights',
    defaultBudget: 175000,
    highlights: ['Jungfraujoch - Top of Europe', 'Mount Titlis Rotating Cable Car', 'Lake Lucerne Scenic Cruise', 'Interlaken & Lauterbrunnen 72 Waterfalls Valley'],
    food: ['Traditional Swiss Cheese Fondue & Raclette', 'Crispy Potato Rösti', 'Lindt & Läderach Swiss Chocolates', 'Zürcher Geschnetzeltes'],
    days: [
      {
        day: 1,
        title: 'Arrival in Zurich & Scenic Train to Lucerne',
        morning: 'Arrive at Zurich Airport (ZRH); board panoramic Swiss train to lakeside Lucerne (approx 50 mins).',
        afternoon: 'Walk across the iconic 14th-century wooden Chapel Bridge (Kapellbrücke) and view the Lion Monument.',
        evening: 'Sunset boat cruise on Lake Lucerne with stunning views of Mount Pilatus and Swiss Alps.',
        estimatedCost: 32000,
        category: 'Lucerne & Cruise'
      },
      {
        day: 2,
        title: 'Mount Titlis Snow & Glacier Cliff Walk',
        morning: 'Take the world’s first rotating cable car (Titlis Rotair) to 3,020m atop Mount Titlis.',
        afternoon: 'Walk across Europe’s highest suspension bridge (Titlis Cliff Walk) and explore the magical Ice Grotto cave.',
        evening: 'Return to Lucerne; enjoy authentic Swiss Cheese Fondue in Old Town.',
        estimatedCost: 30000,
        category: 'Glaciers & Alps'
      },
      {
        day: 3,
        title: 'Interlaken & Lauterbrunnen Waterfalls Valley',
        morning: 'Scenic GoldenPass Express train from Lucerne to Interlaken nestled between Lake Thun and Lake Brienz.',
        afternoon: 'Explore Lauterbrunnen Valley (inspiration for Tolkien’s Rivendell) with Staubbach Falls dropping 300 meters.',
        evening: 'Stroll along Höheweg promenade with views of the snow-capped Jungfrau massif.',
        estimatedCost: 30000,
        category: 'Valley of Waterfalls'
      },
      {
        day: 4,
        title: 'Jungfraujoch - The Top of Europe (3,454m)',
        morning: 'Ride the state-of-the-art Eiger Express tricable gondola and cogwheel train through the Eiger mountain to Jungfraujoch.',
        afternoon: 'Step out onto the Sphinx Observation Deck overlooking the Aletsch Glacier (Europe’s longest glacier).',
        evening: 'Visit the Ice Palace and Lindt Swiss Chocolate Heaven before descending via Grindelwald.',
        estimatedCost: 38000,
        category: 'Jungfrau Peak'
      },
      {
        day: 5,
        title: 'Lake Brienz Turquoise Waters & Iseltwald (Crash Landing on You)',
        morning: 'Cruise on Lake Brienz to the fairy-tale village of Iseltwald (famous CLOY piano dock).',
        afternoon: 'Visit Giessbach Waterfalls and Grandhotel Giessbach historic funicular.',
        evening: 'Farewell Swiss dinner with live alphorn music in Interlaken.',
        estimatedCost: 25000,
        category: 'Lakes & Romance'
      },
      {
        day: 6,
        title: 'Zurich Old Town & Departure',
        morning: 'Train back to Zurich; walk through Bahnhofstrasse luxury shopping and Old Town (Altstadt).',
        afternoon: 'Pick up Swiss artisan chocolates at Sprüngli or Läderach.',
        evening: 'Fly back with breathtaking Alpine memories.',
        estimatedCost: 20000,
        category: 'Departure'
      }
    ],
    tips: [
      'A Swiss Travel Pass gives unlimited rides on all trains, buses, lake boats, and free entry to 500+ museums!',
      'Tap water in Swiss public fountains is 100% natural, crisp mineral water from the Alps — carry a refillable bottle.',
      'Supermarkets like Coop and Migros have high-quality budget sandwiches, salads, and fresh bakery items.'
    ]
  },

  // === POPULAR DOMESTIC INDIAN DESTINATIONS ===
  rajasthan: {
    name: 'Rajasthan (The Royal Heritage Circuit - Jaipur, Jodhpur, Udaipur)',
    country: 'India',
    isInternational: false,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 25000,
    highlights: ['Amer Fort & Hawa Mahal', 'Mehrangarh Fort in Blue City', 'Lake Pichola Sunset Boat Ride', 'Desert Safari & Chokhi Dhani Folk Village'],
    food: ['Dal Baati Churma with Ghee', 'Laal Maas', 'Ghevar & Mawa Kachori', 'Pyaaz Kachori & Mirchi Vada'],
    days: [
      {
        day: 1,
        title: 'Arrival in Jaipur (The Pink City)',
        morning: 'Arrive in Jaipur, check into hotel, and visit the iconic Hawa Mahal (Palace of Winds).',
        afternoon: 'Explore the majestic City Palace and the ancient astronomical observatory Jantar Mantar.',
        evening: 'Traditional Rajasthani dinner, folk dance, and cultural shows at Chokhi Dhani village resort.',
        estimatedCost: 4500,
        category: 'Lodging & Meals'
      },
      {
        day: 2,
        title: 'Jaipur Forts & Heritage Shopping',
        morning: 'Morning excursion to the hilltop Amer Fort (enjoy the mirror work at Sheesh Mahal) and Jaigarh Fort.',
        afternoon: 'Photo stop at Jal Mahal (Water Palace) and explore Johari Bazaar & Bapu Bazaar for handicrafts.',
        evening: 'Sunset view from Nahargarh Fort overlooking Jaipur city lights; dine at a rooftop cafe.',
        estimatedCost: 4000,
        category: 'Sightseeing & Transit'
      },
      {
        day: 3,
        title: 'Jaipur to Jodhpur (The Blue City)',
        morning: 'Scenic train or cab ride from Jaipur to Jodhpur (approx 4.5 hours).',
        afternoon: 'Check-in and visit the towering Mehrangarh Fort and Jaswant Thada marble memorial.',
        evening: 'Walk through the blue alleys of Navchokiya and enjoy Mirchi Vada at Clock Tower (Ghanta Ghar) market.',
        estimatedCost: 5500,
        category: 'Transit & Stay'
      },
      {
        day: 4,
        title: 'Jodhpur to Udaipur (City of Lakes) via Ranakpur',
        morning: 'Depart for Udaipur; stop en route at the stunning 15th-century marble Jain Temple in Ranakpur.',
        afternoon: 'Reach Udaipur, check into a lake-view heritage stay or boutique hotel.',
        evening: 'Sunset boat cruise on Lake Pichola with views of Jag Mandir and the Lake Palace.',
        estimatedCost: 6500,
        category: 'Transit & Activities'
      },
      {
        day: 5,
        title: 'Udaipur Royalty & Departure',
        morning: 'Visit the sprawling Udaipur City Palace complex and crystal gallery.',
        afternoon: 'Stroll around Saheliyon-ki-Bari gardens and Fateh Sagar Lake; shop for silver jewellery & miniature paintings.',
        evening: 'Farewell dinner at Ambrai Ghat overlooking illuminated palaces before airport/train departure.',
        estimatedCost: 4500,
        category: 'Meals & Departure'
      }
    ],
    tips: [
      'Best time to visit: October to March when the weather is pleasant and cool.',
      'Use state tourist cabs or local trains (Vande Bharat / Express) for intercity transit.',
      'Pre-book Amer Fort and Mehrangarh Fort entry tickets online to skip long queues.',
      'Try authentic street food at Rawat Mishthan Bhandar (Jaipur) and Janta Sweet Home (Jodhpur).'
    ]
  },

  goa: {
    name: 'Goa (Sun, Sand, Portuguese Heritage & Nightlife)',
    country: 'India',
    isInternational: false,
    defaultDuration: '4 Days / 3 Nights',
    defaultBudget: 18000,
    highlights: ['Baga & Anjuna Beach', 'Dudhsagar Waterfalls', 'Fontainhas Latin Quarter', 'Sunset Cruise on Mandovi River'],
    food: ['Goan Fish Curry & Rice', 'Prawn Balchão', 'Bebinca', 'Pork Vindaloo', 'Poi Bread'],
    days: [
      {
        day: 1,
        title: 'North Goa Beach Vibes & Sunset Shacks',
        morning: 'Arrive at Dabolim/Mopa airport, rent a scooter or car, check into resort near Calangute or Anjuna.',
        afternoon: 'Relax at Baga or Vagator beach, indulge in water sports (parasailing, jet ski).',
        evening: 'Watch golden sunset from Chapora Fort ("Dil Chahta Hai" fort) followed by dinner at a beach shack.',
        estimatedCost: 4500,
        category: 'Stay & Leisure'
      },
      {
        day: 2,
        title: 'Old Goa Heritage & Panaji Latin Quarter',
        morning: 'Visit UNESCO heritage churches: Basilica of Bom Jesus and Se Cathedral in Old Goa.',
        afternoon: 'Walking tour through the vibrant, colourful Portuguese villas of Fontainhas Latin Quarter in Panaji.',
        evening: 'Evening Mandovi river cruise with Goan folk music or visit a beachfront cafe in Candolim.',
        estimatedCost: 4000,
        category: 'Heritage & Transit'
      },
      {
        day: 3,
        title: 'South Goa Serenity & Dudhsagar Waterfalls',
        morning: 'Day trip to Dudhsagar Waterfalls and spice plantation tour with authentic Goan lunch buffet.',
        afternoon: 'Head south to the pristine, white sands of Palolem Beach and Butterfly Beach boat ride.',
        evening: 'Candlelight seafood dinner at Palolem beach shack under the stars.',
        estimatedCost: 5500,
        category: 'Tours & Meals'
      },
      {
        day: 4,
        title: 'Flea Markets, Souvenirs & Departure',
        morning: 'Shop at Anjuna Flea Market or Arpora night bazaar for handicrafts, cashews, and spices.',
        afternoon: 'Enjoy brunch at a trendy boutique cafe (e.g. Babka or Artjuna) before heading to the airport.',
        evening: 'Departure with sun-kissed memories.',
        estimatedCost: 4000,
        category: 'Shopping & Transit'
      }
    ],
    tips: [
      'Rent a two-wheeler (scooter: ₹350 - ₹500/day) for convenient and cheap local travel.',
      'South Goa is ideal for quiet relaxation, while North Goa is best for parties and adventure.',
      'Carry sunscreen, sunglasses, and cash for flea markets and beach shacks.'
    ]
  },

  kerala: {
    name: 'Kerala (God’s Own Country - Backwaters, Hills & Spices)',
    country: 'India',
    isInternational: false,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 22000,
    highlights: ['Munnar Tea Plantations', 'Alleppey Houseboat Stay', 'Fort Kochi Chinese Nets', 'Kathakali Dance Performance'],
    food: ['Kerala Sadya on Banana Leaf', 'Appam with Stew', 'Karimeen Pollichathu (Pearl Spot Fish)', 'Banana Chips'],
    days: [
      {
        day: 1,
        title: 'Arrival in Kochi & Heritage Stroll',
        morning: 'Arrive at Cochin International Airport; transfer to heritage hotel in Fort Kochi.',
        afternoon: 'View iconic Chinese Fishing Nets, St. Francis Church, and Jewish Synagogue in Mattancherry.',
        evening: 'Watch live traditional Kathakali and Kalaripayattu martial arts show at Kerala Kathakali Centre.',
        estimatedCost: 4000,
        category: 'Heritage & Stay'
      },
      {
        day: 2,
        title: 'Scenic Drive to Munnar (Tea Capital)',
        morning: 'Drive up through misty Western Ghats to Munnar (approx 4 hrs) with stops at Cheeyappara Waterfalls.',
        afternoon: 'Check-in to tea estate resort; explore Tata Tea Museum and learn tea processing.',
        evening: 'Stroll through aromatic spice gardens and taste freshly brewed cardamom tea.',
        estimatedCost: 4800,
        category: 'Transit & Stay'
      },
      {
        day: 3,
        title: 'Munnar Peaks & Eravikulam National Park',
        morning: 'Morning safari in Eravikulam National Park to spot the endangered Nilgiri Tahr.',
        afternoon: 'Visit Mattupetty Dam, Echo Point, and Kundala Lake with boating options.',
        evening: 'Sunset from Top Station overlooking the panoramic Tamil Nadu-Kerala border valleys.',
        estimatedCost: 3500,
        category: 'Sightseeing & Parks'
      },
      {
        day: 4,
        title: 'Munnar to Alleppey Houseboat Cruise',
        morning: 'Drive down to Alleppey (Alappuzha) backwaters (approx 4.5 hrs).',
        afternoon: 'Board a traditional Kettuvallam (luxury houseboat) with private bedrooms, lounge, and personal chef.',
        evening: 'Cruise through palm-fringed canals, paddy fields, and enjoy fresh Malabar fish dinner on water.',
        estimatedCost: 6500,
        category: 'Houseboat & Meals'
      },
      {
        day: 5,
        title: 'Alleppey Sunrise & Departure via Kochi',
        morning: 'Wake up to serene backwater mist and traditional Kerala breakfast (Idiyappam / Puttu).',
        afternoon: 'Disembark at 9:30 AM, transfer to Kochi Airport / Ernakulam Railway Station.',
        evening: 'Pick up hot banana chips and authentic spices before boarding return flight.',
        estimatedCost: 3200,
        category: 'Transit & Shopping'
      }
    ],
    tips: [
      'Book a shared or private houseboat well in advance during peak season (November - February).',
      'Wear light cotton clothes, but carry a light jacket for cool Munnar evenings.',
      'Try authentic Kerala Ayurveda massage at certified traditional centres.'
    ]
  },

  himachal: {
    name: 'Himachal Pradesh (Manali, Solang Valley & Atal Tunnel)',
    country: 'India',
    isInternational: false,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 20000,
    highlights: ['Solang Valley Adventures', 'Atal Tunnel & Sissu (Lahaul)', 'Hadimba Temple', 'Old Manali Cafes'],
    food: ['Siddu with Ghee', 'Trout Fish', 'Thukpa & Momos', 'Himachali Dham'],
    days: [
      {
        day: 1,
        title: 'Arrival in Manali & Local Charms',
        morning: 'Arrive in Manali via Volvo/Cab from Delhi/Chandigarh; check into hotel with mountain view.',
        afternoon: 'Visit the historic wooden Hadimba Temple surrounded by giant deodar cedar forests.',
        evening: 'Walk through Mall Road for warm woolen shawls and dine at an Old Manali riverside cafe.',
        estimatedCost: 3800,
        category: 'Stay & Local'
      },
      {
        day: 2,
        title: 'Solang Valley Adventure & Paragliding',
        morning: 'Head to Solang Valley for thrilling adventure sports (paragliding, zorbing, ATV rides, cable car).',
        afternoon: 'Visit Anjani Mahadev waterfall trek and enjoy piping hot Maggi & tea with snowy peak views.',
        evening: 'Return to Manali, relax at Vashisht hot water sulphur springs and ancient temple.',
        estimatedCost: 5200,
        category: 'Adventure & Transit'
      },
      {
        day: 3,
        title: 'Atal Tunnel & Sissu Waterfalls (Lahaul Valley)',
        morning: 'Drive through the marvel 9.02 km Atal Tunnel into the breathtaking landscape of Lahaul Valley.',
        afternoon: 'Explore Sissu Waterfall, walk along the Chandra River, and click photos at the frozen river valley.',
        evening: 'Return to Manali; enjoy wood-fired pizza and live acoustic music in Old Manali.',
        estimatedCost: 4500,
        category: 'Excursion & Dining'
      },
      {
        day: 4,
        title: 'Kullu River Rafting & Naggar Castle',
        morning: 'White water river rafting in Beas River at Kullu, followed by a visit to Shawl factories.',
        afternoon: 'Explore the 500-year-old Naggar Castle and Nicholas Roerich Art Gallery overlooking the valley.',
        evening: 'Bonfire night at your resort with traditional Himachali Siddu dinner.',
        estimatedCost: 4000,
        category: 'Activities & Culture'
      },
      {
        day: 5,
        title: 'Jogini Waterfall Trek & Departure',
        morning: 'Short scenic nature trek from Vashisht to Jogini Waterfalls with panoramic mountain vistas.',
        afternoon: 'Last minute souvenir shopping for local honey, apple jam, and Kullu caps.',
        evening: 'Board evening overnight Volvo bus back to Delhi/Chandigarh.',
        estimatedCost: 2500,
        category: 'Transit & Departure'
      }
    ],
    tips: [
      'Obtain Rohtang Pass permits online beforehand if visiting during May - October.',
      'Layer your clothing as temperatures can drop quickly after sunset.',
      'Book Volvo buses for a comfortable overnight Delhi-Manali journey.'
    ]
  },

  kashmir: {
    name: 'Kashmir (Paradise on Earth - Srinagar, Gulmarg & Pahalgam)',
    country: 'India',
    isInternational: false,
    defaultDuration: '5 Days / 4 Nights',
    defaultBudget: 28000,
    highlights: ['Dal Lake Shikara Ride & Houseboat Stay', 'Gulmarg Gondola World’s Highest Cable Car', 'Pahalgam Betaab Valley & Aru Valley', 'Mughal Gardens of Srinagar'],
    food: ['Kashmiri Wazwan (Rogan Josh, Rista, Gushtaba)', 'Kahwa Saffron Tea', 'Kashmiri Dum Aloo', 'Haakh & Modur Pulao'],
    days: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Dal Lake Shikara Sunset',
        morning: 'Arrive at Sheikh ul-Alam International Airport Srinagar; transfer to a heritage wooden Houseboat on Dal Lake or Nigeen Lake.',
        afternoon: 'Explore Mughal Gardens: Nishat Bagh (Garden of Bliss) and Shalimar Bagh (Abode of Love) overlooking the lake.',
        evening: 'Sunset 2-hour Shikara ride on Dal Lake; visit floating vegetable market and Char Chinar island.',
        estimatedCost: 5500,
        category: 'Houseboat & Lake'
      },
      {
        day: 2,
        title: 'Gulmarg Gondola & Snow Peaks',
        morning: 'Drive to Gulmarg (approx 1.5 hrs), the Meadow of Flowers and premier ski resort.',
        afternoon: 'Ride Phase 1 and Phase 2 Gulmarg Gondola (reaching 13,780 ft at Apharwat Peak) for breathtaking snow landscapes.',
        evening: 'Return to Srinagar; sip warm saffron Kahwa tea and dine on authentic Kashmiri Wazwan.',
        estimatedCost: 6500,
        category: 'Snow & Peaks'
      },
      {
        day: 3,
        title: 'Srinagar to Pahalgam (Valley of Shepherds)',
        morning: 'Drive to Pahalgam along the scenic Lidder River; pass by fragrant saffron fields of Pampore and walnut orchards.',
        afternoon: 'Check into hotel; hire local union cab or pony to explore the picturesque Betaab Valley and Chandanwari.',
        evening: 'Walk along the sparkling crystal-clear Lidder River and relax in lush pine forests.',
        estimatedCost: 6000,
        category: 'Valleys & River'
      },
      {
        day: 4,
        title: 'Pahalgam Aru Valley & Return to Srinagar',
        morning: 'Visit the scenic meadow village of Aru Valley, famous for trekking and scenic photography.',
        afternoon: 'Drive back to Srinagar; shop for authentic Pashmina shawls, Kashmiri saffron, walnuts, and carved walnut wood items.',
        evening: 'Dinner at a traditional Wazwan restaurant in Lal Chowk or boulevard road.',
        estimatedCost: 5500,
        category: 'Shopping & Stay'
      },
      {
        day: 5,
        title: 'Shankaracharya Temple & Departure',
        morning: 'Visit the hilltop Shankaracharya Temple for panoramic views of Srinagar city and Dal Lake.',
        afternoon: 'Transfer to Srinagar Airport for your return flight.',
        evening: 'Departure with memories of heaven on earth.',
        estimatedCost: 4500,
        category: 'Departure'
      }
    ],
    tips: [
      'Book Gulmarg Gondola Phase 1 & 2 tickets well in advance online as counter tickets are not sold on spot.',
      'Check local taxi union rules in Pahalgam/Gulmarg where local union vehicles are required for certain sightseeing spots.',
      'Carry valid government photo ID as security checks at Srinagar airport are strict.'
    ]
  }
};

// Aliases and match mappings for top global and domestic locations
const DESTINATION_ALIASES = {
  // Rajasthan
  rajasthan: 'rajasthan',
  jaipur: 'rajasthan',
  udaipur: 'rajasthan',
  jodhpur: 'rajasthan',
  jaisalmer: 'rajasthan',
  pushkar: 'rajasthan',

  // Goa
  goa: 'goa',
  panaji: 'goa',
  calangute: 'goa',
  baga: 'goa',
  anjuna: 'goa',
  candolim: 'goa',

  // Kerala
  kerala: 'kerala',
  munnar: 'kerala',
  alleppey: 'kerala',
  kochi: 'kerala',
  wayanad: 'kerala',
  kovalam: 'kerala',
  varkala: 'kerala',

  // Manali & Himachal
  manali: 'manali',
  shimla: 'manali',
  himachal: 'manali',
  dharamshala: 'manali',
  kasol: 'manali',
  spiti: 'manali',
  kullu: 'manali',

  // Kashmir
  kashmir: 'kashmir',
  srinagar: 'kashmir',
  gulmarg: 'kashmir',
  pahalgam: 'kashmir',

  // Ladakh
  ladakh: 'ladakh',
  leh: 'ladakh',
  nubra: 'ladakh',
  pangong: 'ladakh',

  // Paris / France
  paris: 'paris',
  france: 'paris',
  french: 'paris',
  eiffel: 'paris',

  // London / UK
  london: 'london',
  uk: 'london',
  england: 'london',
  britain: 'london',

  // Dubai / UAE
  dubai: 'dubai',
  uae: 'dubai',
  'abu dhabi': 'dubai',

  // Tokyo / Japan
  tokyo: 'tokyo',
  japan: 'tokyo',
  kyoto: 'tokyo',
  osaka: 'tokyo',

  // Bali / Indonesia
  bali: 'bali',
  indonesia: 'bali',
  ubud: 'bali',

  // Singapore
  singapore: 'singapore',
  sg: 'singapore',

  // Switzerland / Swiss
  switzerland: 'switzerland',
  swiss: 'switzerland',
  zurich: 'switzerland',
  interlaken: 'switzerland',

  // Additional Global & Domestic Destinations
  ooty: 'ooty',
  tamilnadu: 'ooty',
  kodaikanal: 'ooty',
  coorg: 'coorg',
  mysore: 'coorg',
  karnataka: 'coorg',
  hampi: 'coorg',
  bangalore: 'coorg',
  bengaluru: 'coorg',
  mumbai: 'mumbai',
  maharashtra: 'mumbai',
  pune: 'mumbai',
  lonavala: 'mumbai',
  mahabaleshwar: 'mumbai',
  delhi: 'delhi',
  agra: 'delhi',
  'taj mahal': 'delhi',
  varanasi: 'varanasi',
  kashi: 'varanasi',
  ayodhya: 'varanasi',
  rishikesh: 'uttarakhand',
  haridwar: 'uttarakhand',
  uttarakhand: 'uttarakhand',
  mussoorie: 'uttarakhand',
  nainital: 'uttarakhand',
  sikkim: 'sikkim',
  gangtok: 'sikkim',
  darjeeling: 'sikkim',
  meghalaya: 'meghalaya',
  shillong: 'meghalaya',
  cherrapunji: 'meghalaya',
  andaman: 'andaman',
  havelock: 'andaman',
  'port blair': 'andaman',
  kolkata: 'kolkata',
  calcutta: 'kolkata',
  amritsar: 'amritsar',
  punjab: 'amritsar',
  hyderabad: 'hyderabad',
  pondicherry: 'pondicherry',
  puducherry: 'pondicherry',
  gujarat: 'gujarat',
  ahmedabad: 'gujarat',

  // Additional World Countries & Cities
  rome: 'rome',
  italy: 'rome',
  venice: 'rome',
  florence: 'rome',
  milan: 'rome',
  thailand: 'thailand',
  bangkok: 'thailand',
  phuket: 'thailand',
  pattaya: 'thailand',
  krabi: 'thailand',
  'new york': 'newyork',
  nyc: 'newyork',
  usa: 'newyork',
  america: 'newyork',
  california: 'newyork',
  'los angeles': 'newyork',
  maldives: 'maldives',
  vietnam: 'vietnam',
  hanoi: 'vietnam',
  'da nang': 'vietnam',
  'hoi an': 'vietnam',
  egypt: 'egypt',
  cairo: 'egypt',
  giza: 'egypt',
  turkey: 'turkey',
  istanbul: 'turkey',
  cappadocia: 'turkey',
  greece: 'greece',
  athens: 'greece',
  santorini: 'greece',
  spain: 'spain',
  barcelona: 'spain',
  madrid: 'spain',
  amsterdam: 'amsterdam',
  netherlands: 'amsterdam',
  holland: 'amsterdam',
  australia: 'australia',
  sydney: 'australia',
  melbourne: 'australia',
  canada: 'canada',
  toronto: 'canada',
  vancouver: 'canada',
  banff: 'canada',
  germany: 'germany',
  berlin: 'germany',
  munich: 'germany',
  austria: 'austria',
  vienna: 'austria',
  prague: 'prague',
  'czech republic': 'prague',
  budapest: 'budapest',
  hungary: 'budapest',
  korea: 'korea',
  seoul: 'korea',
  'south korea': 'korea',
  malaysia: 'malaysia',
  'kuala lumpur': 'malaysia',
  nepal: 'nepal',
  kathmandu: 'nepal',
norway: 'norway',
  'new zealand': 'newzealand',
  auckland: 'newzealand',
};

/**
 * Standard refusal message for queries unrelated to travel or travel expenses
 */
const OFF_TOPIC_REPLY = `I'm sorry, I can only provide assistance with travel planning, trip itineraries, destination guides, and travel expenses. I can't provide information on other topics.

Here are some things you can ask me:
- 🗺️ **"Plan a 5-day itinerary for Rajasthan under ₹25,000"**
- 🏖️ **"Goa 4-day beach trip budget ₹18,000"**
- ⛩️ **"Top places to visit in Tokyo"**
- 🏔️ **"Manali 3-day mountain trip with ₹15,000 budget"**
- 💰 **"Spent ₹1,200 on dinner at Mainland China"**`;

/**
 * Check if the query is an off-topic / non-travel question
 */
const isOffTopicQuery = (message) => {
  const text = message.toLowerCase().trim();

  // 1. Questions asking "who is", "who was", "who are"
  const celebrityOrEntity = /^(?:who|whom|whose)\s+(?:is|was|are|were|the)\b/i;
  if (celebrityOrEntity.test(text)) {
    if (!/\b(tour guide|guide|hotel|resort|travel agency|pilot|driver)\b/i.test(text)) {
      return true;
    }
  }

  // 2. Questions asking definitions, formulas, science, tech, general trivia
  const generalKnowledge = /^(?:what|why|how)\s+(?:is|are|was|were)\s+(?:the|a|an)?\s*(?:definition|meaning|formula|physics|chemistry|biology|python|javascript|react|coding|programming|math|calculus|difference\s+between|history\s+of|age\s+of|net\s*worth|height|wife|husband|parents|real\s*name|capital\s+city\s+of|president\s+of|prime\s+minister)\b/i;
  if (generalKnowledge.test(text)) {
    return true;
  }

  // 3. Obvious coding, math, essay, creative writing prompts
  const codingAndTech = /\b(write\s+(?:code|python|javascript|script|essay|poem|song|story|lyrics|email|resume|letter)|solve\s+(?:equation|math|problem|calculus)|how\s+to\s+(?:code|program|cook|bake|fix|hack|make\s+money|learn\s+python|build\s+pc)|tell\s+me\s+a\s+(?:joke|story|riddle|fact)|what\s+is\s+(?:ai|machine\s+learning|crypto|bitcoin|stocks|ethereum|react|html|css|python|java|c\+\+|node\.?js))\b/i;
  if (codingAndTech.test(text)) {
    return true;
  }

  // 4. Popular culture / celebrities / musicians / entertainment (unless accompanied by trip/vacation context)
  const entertainmentAndCelebs = /\b(the\s+weeknd|the\s+weekend\b|weeknd|singer|actor|actress|musician|celebrity|hollywood|bollywood|netflix|movie|album|lyrics|rapper|spotify|billie\s+eilish|taylor\s+swift|drake|ariana\s+grande|justin\s+bieber|elon\s+musk|mark\s+zuckerberg|jeff\s+bezos|virat\s+kohli|messi|ronaldo|cricket\s+score|football\s+match)\b/i;
  if (entertainmentAndCelebs.test(text)) {
    if (!/\b(trip|tour|itinerary|travel|vacation|holiday|visit|hotel|flight|places\s+to\s+visit)\b/i.test(text)) {
      return true;
    }
  }

  // 5. Medical, politics, sports news
  const politicsAndHealth = /\b(symptoms\s+of|headache|fever|disease|medicine|prescription|doctor|dosage|parliament|election\s+winner|political\s+party|democrat|republican)\b/i;
  if (politicsAndHealth.test(text)) {
    return true;
  }

  return false;
};

/**
 * Helper to detect if user message is an itinerary / trip planning request
 */
const isItineraryRequest = (message) => {
  const text = message.toLowerCase().trim();

  // If query is off-topic, reject immediately
  if (isOffTopicQuery(message)) {
    return false;
  }
  
  // Explicit expense logging keywords
  const hasExpenseLogKeyword = /\b(spent|paid|cost me|charged|bill of|bought|purchased|receipt|refund)\b/i.test(text);
  if (hasExpenseLogKeyword && !/\b(itinerary|iteinary|itinery|trip plan|travel plan)\b/i.test(text)) {
    return false;
  }

  // Clear travel planning keywords
  if (/\b(itinerary|iteinary|itinery|travel plan|trip plan|holiday plan|vacation plan|tour plan|sightseeing|places to visit|things to do|where to go|how to spend \d+ days|travel guide|trip guide|weekend trip|weekend getaway|beach trip|road trip|mountain trip)\b/i.test(text)) {
    return true;
  }

  // Duration specification (e.g. "5 days", "4-day", "3 nights", "1 week")
  const hasDuration = /\b\d+[-\s]*(?:days?|nights?|weeks?|d)\b/i.test(text) || /\b(weekend trip|weekend getaway|1 week|one week|2 weeks)\b/i.test(text);

  // Check known destination keywords
  let hasKnownDestination = false;
  for (const keyword of Object.keys(DESTINATION_ALIASES)) {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(text)) {
      hasKnownDestination = true;
      break;
    }
  }

  // If message contains known destination and duration or budget or travel verbs
  if (hasKnownDestination) {
    if (hasDuration) return true;
    if (/\b(plan|trip|travel|tour|visit|vacation|holiday|guide|budget|explore|flight|hotel|stay|beach|mountain|resort|go to|fly to)\b/i.test(text)) {
      return true;
    }
    // If it's just the destination name or short query (e.g. "Rajasthan", "Goa", "Tokyo 20k")
    if (text.split(/\s+/).length <= 4 && !/\b(who|what|why|how|when|is|was|are|joke)\b/i.test(text)) {
      return true;
    }
  }

  // If message has duration + travel/trip intent (e.g. "4-day beach trip budget 18000" or "5 days trip with 20k budget")
  if (hasDuration && /\b(trip|tour|travel|vacation|holiday|visit|itinerary|budget|plan|beach|mountain|places)\b/i.test(text)) {
    return true;
  }

  // General travel request pattern like "trip to Bali 4 days" or "plan a 5 days vacation in Switzerland"
  if (/\b(?:plan|itinerary|trip|tour|vacation|holiday|travel)\s+(?:for|to|in|of)\s+[A-Za-z]/i.test(text)) {
    return true;
  }

  return false;
};

/**
 * Helper to detect if user message is an expense logging request
 */
const isExpenseRequest = (message) => {
  const text = message.toLowerCase().trim();

  // If query is off-topic, reject immediately
  if (isOffTopicQuery(message)) {
    return false;
  }

  // Expense action verbs
  if (/\b(spent|paid|cost|bought|purchased|charged|bill|receipt|booked|ordered|refund)\b/i.test(text)) {
    return true;
  }

  // Travel expense categories with amount or merchant
  const hasExpenseCategory = /\b(flight|flights|airfare|airline|hotel|motel|resort|airbnb|lodging|room stay|room booking|uber|ola|lyft|taxi|cab|metro|train|bus|auto|rickshaw|lunch|dinner|breakfast|food|restaurant|cafe|coffee|chai|starbucks|swiggy|zomato|drinks|meal|dining|bar|burger|pizza|snacks)\b/i.test(text);
  const hasAmount = /[₹$€£]|\b\d+(?:\.\d{1,2})?\s*(?:rs\.?|inr|rupees|bucks|dollars|euros|k)\b|\b(?:spent|paid|cost|for|at|amount)\s*[₹$€£]?\s*\d+/i.test(text);

  if (hasExpenseCategory && (hasAmount || text.split(/\s+/).length <= 5)) {
    return true;
  }

  // Pure expense phrase e.g. "Dinner 1200", "Starbucks ₹350", "Uber 450"
  if (/^[a-z0-9\s'&.-]+\s+[₹$€£]?\s*\d+(?:\.\d{1,2})?\s*(?:rs|inr|rupees|bucks|dollars)?$/i.test(text)) {
    return true;
  }

  return false;
};

/**
 * Extract budget number from message (e.g. ₹25,000, 20k, 1.5 lakh, 50000 rupees)
 */
const extractBudget = (message) => {
  const text = message.toLowerCase();
  
  // Check lakh e.g. 1.5 lakh, 2 lakh, 1 lakh
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/i);
  if (lakhMatch && lakhMatch[1]) {
    return parseFloat(lakhMatch[1]) * 100000;
  }

  // Check 20k, 25k, 50k
  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch && kMatch[1]) {
    return parseFloat(kMatch[1]) * 1000;
  }

  // Check currency expressions
  const patterns = [
    /[₹$€£]\s*([\d,]+)/i,
    /(?:budget|amount|cost|around|under|within)\s*(?:of|is|:)?\s*[₹$€£]?\s*([\d,]+)/i,
    /([\d,]+)\s*(?:rs\.?|inr|rupees|bucks|euros|pounds|dollars)/i,
  ];

  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) {
      const num = parseFloat(m[1].replace(/,/g, ''));
      if (!isNaN(num) && num > 100) return num;
    }
  }
  return null;
};

/**
 * Extract duration in days (e.g. 5 days, 4-day, 3 nights, 1 week)
 */
const extractDuration = (message) => {
  const text = message.toLowerCase();
  const dayMatch = text.match(/(\d+)[-\s]*(?:day|days|d|nights|night)\b/i);
  if (dayMatch && dayMatch[1]) {
    const days = parseInt(dayMatch[1], 10);
    if (days >= 1 && days <= 30) return days;
  }
  if (text.includes('weekend') || text.includes('2 days')) return 2;
  if (text.includes('1 week') || text.includes('one week') || text.includes('7 days')) return 7;
  return null;
};

/**
 * Extract destination name from query for any place worldwide
 */
const extractDestinationName = (message) => {
  const text = message.toLowerCase();

  // 1. Check known aliases first (sort by key length descending)
  const sortedAliases = Object.entries(DESTINATION_ALIASES).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, key] of sortedAliases) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(text)) {
      const properName = GLOBAL_DESTINATIONS[key] ? GLOBAL_DESTINATIONS[key].name.split(',')[0].split('(')[0].trim() : keyword.charAt(0).toUpperCase() + keyword.slice(1);
      return { key, matched: keyword, customName: properName };
    }
  }

  // 2. Generic destination extraction via regex patterns
  const patterns = [
    /(?:for|to|in|of)\s+([A-Za-z\s]+?)(?:\s+(?:trip|tour|vacation|holiday|budget|with|under|\d)|$)/i,
    /(?:plan|itinerary|iteinary|itinery|guide|visit)\s+(?:for|to|in|of)?\s*([A-Za-z\s]+?)(?:\s+(?:trip|tour|under|with|budget|\d)|$)/i,
    /^([A-Za-z\s]+?)\s+(?:\d+[-\s]*(?:days?|nights?)|trip|tour|itinerary|iteinary|plan|budget)/i,
  ];

  for (const p of patterns) {
    const match = message.match(p);
    if (match && match[1]) {
      const candidate = match[1].trim();
      const lower = candidate.toLowerCase();
      if (!['a', 'the', 'my', 'proper', 'best', '5', '4', '3', '7', 'days', 'days trip', 'trip', 'who is', 'who was', 'what is', 'tell me', 'weekend', 'beach', 'mountain'].includes(lower) && candidate.length > 2) {
        return { key: 'generic', customName: candidate.charAt(0).toUpperCase() + candidate.slice(1) };
      }
    }
  }

  // 3. Fallback extraction: strip stopwords only if in valid travel context
  const stripped = message
    .replace(/\b(give me|show me|create|plan|generate|prepare|tell me|what is|the|a|an|proper|best|tour|trip|vacation|holiday|travel|guide|itinerary|iteinary|itinery|days?|nights?|budget|under|with|for|in|to|of|around|please|beach|mountain)\b/gi, ' ')
    .replace(/[₹$€£\d,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (stripped && stripped.length > 2 && !/\b(who|what|why|how|when|is|was|are|weekend|weeknd)\b/i.test(stripped)) {
    return { key: 'generic', customName: stripped.charAt(0).toUpperCase() + stripped.slice(1) };
  }

  return { key: 'rajasthan', matched: 'rajasthan', customName: 'Rajasthan' };
};

/**
 * Generate bespoke itinerary for ANY destination in the world
 */
const generateDynamicDestination = (destName, numDays, userBudget) => {
  const cleanName = destName.replace(/\b(trip|tour|visit|plan|itinerary|iteinary)\b/gi, '').trim();
  const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  
  const isInternational = !['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'ooty', 'rishikesh', 'varanasi', 'darjeeling', 'sikkim', 'shimla', 'manali', 'agra', 'amritsar', 'pondicherry', 'andaman', 'coorg', 'hampi', 'kerala', 'goa', 'rajasthan', 'kashmir', 'ladakh'].includes(cleanName.toLowerCase());
  
  const baselineTotal = userBudget || (numDays * (isInternational ? 18000 : 4500));
  
  const days = [];
  const themes = [
    { time: 'Arrival & Iconic Landmarks', morning: `Arrive in ${formattedName}, check in to hotel/resort, and explore the central square & historic old quarter.`, afternoon: `Visit top architectural landmarks, famous monuments, and cultural museums in ${formattedName}.`, evening: `Sunset views from a scenic viewpoint followed by authentic local dinner.` },
    { time: 'Heritage, Culture & Art', morning: `Morning guided tour of the premier historic sites, palaces, and heritage temples/cathedrals.`, afternoon: `Stroll through art galleries, botanical gardens, and traditional artisan craft markets.`, evening: `Experience local cultural music/dance performance and dine at a renowned local restaurant.` },
    { time: 'Nature, Adventure & Day Excursion', morning: `Excursion to nearby scenic landscapes, mountain viewpoints, coastal beaches, or nature parks.`, afternoon: `Enjoy outdoor activities, boat cruise, or adventure experiences with local cuisine lunch.`, evening: `Relaxing evening at a vibrant waterfront promenade or local street food market.` },
    { time: 'Local Hidden Gems & Shopping', morning: `Explore charming local neighborhoods, hidden cafes, and historic viewpoints off the beaten path.`, afternoon: `Shopping for authentic local souvenirs, traditional textiles, and culinary delicacies.`, evening: `Special panoramic rooftop or riverside dinner overlooking ${formattedName} city lights.` },
    { time: 'Farewell Highlights & Departure', morning: `Visit final landmark attractions and scenic gardens for photo keepsakes.`, afternoon: `Last-minute bakery treats, coffee tasting, and souvenir shopping.`, evening: `Transfer to the airport / station for your return departure with wonderful memories.` }
  ];

  for (let i = 1; i <= numDays; i++) {
    const themeIndex = (i - 1) % themes.length;
    const theme = themes[themeIndex];
    const dailyCost = Math.round(baselineTotal / numDays);
    days.push({
      day: i,
      title: `Day ${i}: ${formattedName} - ${theme.time}`,
      morning: theme.morning,
      afternoon: theme.afternoon,
      evening: theme.evening,
      estimatedCost: dailyCost,
      category: 'Sightseeing & Stay'
    });
  }

  return {
    name: `${formattedName} (${numDays} Days Global Tour)`,
    country: formattedName,
    isInternational,
    defaultDuration: `${numDays} Days / ${numDays - 1} Nights`,
    defaultBudget: baselineTotal,
    highlights: [`Top Sightseeing & Historic Landmarks of ${formattedName}`, `Cultural & Scenic Excursions`, `Authentic Local Food & Cuisine`, `Vibrant Markets & Sunset Views`],
    food: [`Signature ${formattedName} Local Specialties`, `Street Food & Regional Delicacies`, `Artisanal Coffee & Bakeries`, `Fine Dining Experiences`],
    days,
    tips: [
      `Book top attraction tickets online in advance to skip ticket queues in ${formattedName}.`,
      `Use public transit or registered taxis/ride-hailing apps for cheap and reliable local travel.`,
      `Keep digital copies of your passport/ID, carry a universal power adapter, and check local weather before packing.`
    ]
  };
};

/**
 * Universal Master Itinerary Generator
 */
const generateLocalItinerary = (message) => {
  const userBudget = extractBudget(message);
  const userDays = extractDuration(message);
  const destInfo = extractDestinationName(message);

  let destData = null;
  if (destInfo.key && GLOBAL_DESTINATIONS[destInfo.key]) {
    destData = GLOBAL_DESTINATIONS[destInfo.key];
  } else {
    const fallbackName = destInfo.customName || destInfo.matched || destInfo.key || 'Custom Tour';
    destData = generateDynamicDestination(fallbackName, userDays || 5, userBudget);
  }

  const numDays = userDays || (destData.days ? destData.days.length : 5);

  // Compute realistic estimated budget breakdown
  const baselineTotal = userBudget || (destData.defaultBudget ? Math.round((destData.defaultBudget / 5) * numDays) : (numDays * (destData.isInternational ? 22000 : 4500)));
  const lodgingBudget = Math.round(baselineTotal * 0.38);
  const mealsBudget = Math.round(baselineTotal * 0.24);
  const transitBudget = Math.round(baselineTotal * 0.20);
  const activitiesBudget = Math.round(baselineTotal * 0.12);
  const bufferBudget = Math.max(500, baselineTotal - (lodgingBudget + mealsBudget + transitBudget + activitiesBudget));

  // Build days list
  let daysList = [];
  if (destData.days && destData.days.length >= numDays) {
    daysList = destData.days.slice(0, numDays).map((d, index) => ({
      ...d,
      day: index + 1,
      estimatedCost: Math.round(baselineTotal / numDays),
    }));
  } else if (destData.days && destData.days.length > 0) {
    // Repeat/expand if user requested more days than default
    daysList = Array.from({ length: numDays }, (_, index) => {
      const template = destData.days[index % destData.days.length];
      return {
        ...template,
        day: index + 1,
        title: index < destData.days.length ? template.title : `Day ${index + 1}: ${destData.name} - Extended Exploration & Leisure`,
        estimatedCost: Math.round(baselineTotal / numDays),
      };
    });
  } else {
    daysList = generateDynamicDestination(destData.name, numDays, baselineTotal).days;
  }

  const budgetBreakdown = [
    { category: 'Lodging', amount: lodgingBudget, percentage: '38%', description: destData.isInternational ? 'Hotels / Boutique Stays / Apartments' : 'Quality 3-4★ heritage & boutique stays' },
    { category: 'Meals', amount: mealsBudget, percentage: '24%', description: 'Authentic local dining, cafes & street snacks' },
    { category: 'Transit', amount: transitBudget, percentage: '20%', description: destData.isInternational ? 'Metro passes, high-speed rail & local cabs' : 'Private cabs / express trains & autos' },
    { category: 'Other', amount: activitiesBudget, percentage: '12%', description: 'Entry tickets, museum passes & guided boat/city tours' },
    { category: 'Buffer', amount: bufferBudget, percentage: '6%', description: 'Emergency buffer & souvenir shopping' },
  ];

  // Compose clean markdown message
  const budgetFormatted = `₹${baselineTotal.toLocaleString('en-IN')}`;
  let replyText = `### 🌟 Complete Itinerary: ${destData.name}\n\n`;
  replyText += `**Duration:** ${numDays} Days / ${numDays - 1} Nights  \n`;
  replyText += `**Estimated Total Budget:** **${budgetFormatted}** ${userBudget ? '(Optimized for your specified budget)' : '(Recommended mid-range budget in INR - ₹)'}\n\n`;

  replyText += `#### 💰 Estimated Budget Breakdown (INR - ₹)\n`;
  replyText += `| Category | Estimated Cost | Details |\n`;
  replyText += `| :--- | :--- | :--- |\n`;
  replyText += `| 🏨 **Lodging** | ₹${lodgingBudget.toLocaleString('en-IN')} | ${budgetBreakdown[0].description} |\n`;
  replyText += `| 🍽️ **Food & Dining** | ₹${mealsBudget.toLocaleString('en-IN')} | ${budgetBreakdown[1].description} |\n`;
  replyText += `| 🚖 **Transport** | ₹${transitBudget.toLocaleString('en-IN')} | ${budgetBreakdown[2].description} |\n`;
  replyText += `| 🎟️ **Activities & Entry** | ₹${activitiesBudget.toLocaleString('en-IN')} | ${budgetBreakdown[3].description} |\n`;
  replyText += `| 🛡️ **Emergency Buffer** | ₹${bufferBudget.toLocaleString('en-IN')} | ${budgetBreakdown[4].description} |\n\n`;

  replyText += `#### 🗓️ Day-by-Day Travel Plan\n\n`;
  daysList.forEach((d) => {
    replyText += `**Day ${d.day}: ${d.title}** (Est. ₹${d.estimatedCost.toLocaleString('en-IN')})\n`;
    replyText += `- **Morning:** ${d.morning}\n`;
    replyText += `- **Afternoon:** ${d.afternoon}\n`;
    replyText += `- **Evening:** ${d.evening}\n\n`;
  });

  replyText += `#### 💡 Insider Travel Tips\n`;
  destData.tips.forEach((tip) => {
    replyText += `- ${tip}\n`;
  });

  return {
    type: 'itinerary',
    destination: destData.name,
    duration: `${numDays} Days / ${numDays - 1} Nights`,
    totalBudget: baselineTotal,
    budgetBreakdown,
    days: daysList,
    tips: destData.tips,
    replyMessage: replyText,
    isComplete: true,
  };
};

/**
 * OpenAI GPT parser with strict topic guardrails
 */
const parseWithOpenAI = async (message, apiKey) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are TravelWise AI - a specialized travel planner and travel expense intelligence assistant ONLY.
You CANNOT answer general trivia, non-travel questions, celebrities, coding, math, science, politics, or unrelated topics.

Classify the user's intent into one of three types:
1. "itinerary": User asks for a travel itinerary, vacation plan, destination guide, sightseeing, places to visit, or travel budget for ANY destination worldwide (e.g. "5 days itinerary for Paris", "plan a trip to Tokyo Japan", "Rajasthan 4 days with 25k budget", "Goa beach trip").
2. "expense": User is logging a specific travel expense (e.g. "Spent 1200 on lunch", "Uber ₹850", "Hotel booking ₹14,000").
3. "off_topic": User asks anything unrelated to travel, vacations, destination guides, or travel expenses (e.g. "who is the weekend", "what is python", "who is elon musk", "write code", "tell me a joke", "general trivia").

Always output a valid JSON object matching one of these schemas:

For "off_topic":
{
  "type": "off_topic",
  "replyMessage": "I'm sorry, I can only provide assistance with travel planning, trip itineraries, destination guides, and travel expenses. I can't provide information on other topics.\\n\\nHere are some things you can ask me:\\n- 🗺️ **\\"Plan a 5-day itinerary for Rajasthan under ₹25,000\\"**\\n- 🏖️ **\\"Goa 4-day beach trip budget ₹18,000\\"**\\n- ⛩️ **\\"Top places to visit in Tokyo\\"**\\n- 🏔️ **\\"Manali 3-day mountain trip ₹15,000\\"**\\n- 💰 **\\"Spent ₹1,200 on dinner at Mainland China\\"**",
  "isComplete": false
}

For "itinerary":
{
  "type": "itinerary",
  "destination": string (full name of the city, state, or country, e.g. "Paris, France"),
  "duration": string (e.g. "5 Days / 4 Nights"),
  "totalBudget": number (in INR - ₹),
  "budgetBreakdown": [
    { "category": "Lodging", "amount": number, "percentage": "38%", "description": string },
    { "category": "Meals", "amount": number, "percentage": "24%", "description": string },
    { "category": "Transit", "amount": number, "percentage": "20%", "description": string },
    { "category": "Other", "amount": number, "percentage": "12%", "description": string },
    { "category": "Buffer", "amount": number, "percentage": "6%", "description": string }
  ],
  "days": [
    {
      "day": number,
      "title": string,
      "morning": string,
      "afternoon": string,
      "evening": string,
      "estimatedCost": number
    }
  ],
  "tips": string[],
  "replyMessage": string (rich, comprehensive markdown text with headers, tables, bullet points, and day-by-day itinerary formatted elegantly)
}

For "expense":
{
  "type": "expense",
  "amount": number (positive numeric value without currency symbols, or null if missing),
  "category": "Flight" | "Lodging" | "Meals" | "Transit" | "Other",
  "merchant": string (vendor or merchant name),
  "title": string (descriptive title),
  "notes": string,
  "date": "YYYY-MM-DD",
  "trip": string,
  "status": "Pending",
  "isComplete": boolean (true if amount > 0 is present),
  "missingFields": string[],
  "replyMessage": string
}`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    if (parsed.type === 'off_topic') {
      return {
        type: 'off_topic',
        replyMessage: parsed.replyMessage || OFF_TOPIC_REPLY,
        isComplete: false,
      };
    }

    if (parsed.type === 'itinerary') {
      return {
        type: 'itinerary',
        destination: parsed.destination || 'Custom Destination',
        duration: parsed.duration || '4 Days / 3 Nights',
        totalBudget: parsed.totalBudget || 25000,
        budgetBreakdown: parsed.budgetBreakdown || [],
        days: parsed.days || [],
        tips: parsed.tips || [],
        replyMessage: parsed.replyMessage || 'Here is your custom travel itinerary.',
        isComplete: true,
      };
    }

    // Default Expense format
    return {
      type: 'expense',
      amount: parsed.amount || 0,
      category: parsed.category || 'Other',
      merchant: parsed.merchant || 'General Merchant',
      title: parsed.title || 'Travel Expense',
      notes: parsed.notes || `AI logged: "${message}"`,
      date: parsed.date || new Date().toISOString(),
      trip: parsed.trip || 'General',
      status: parsed.status || 'Pending',
      isComplete: !!(parsed.amount && parsed.amount > 0),
      missingFields: parsed.missingFields || (parsed.amount ? [] : ['amount']),
      replyMessage: parsed.replyMessage || (parsed.amount ? `I've prepared your expense of ₹${parsed.amount} for ${parsed.title}. You can review and confirm it below.` : "Could you please specify how much was spent in ₹?"),
    };
  } catch (error) {
    console.warn('OpenAI parser notice (falling back to universal global travel engine):', error.message);
    return null;
  }
};

/**
 * Local NLP Expense Parser
 */
const parseWithLocalExpenseNLP = (message) => {
  const text = message.trim();
  const lowerText = text.toLowerCase();

  // 1. Amount Extraction
  let amount = null;
  const amountPatterns = [
    /[₹$€£]\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:rs\.?|inr|rupees)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:rs\.?|inr|rupees|dollars|bucks|usd|eur|gbp)/i,
    /(?:spent|cost|paid|for|amount of)\s*[₹$€£]?\s*(?:rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /\b([\d]+(?:\.\d{1,2})?)\s*(?:on|at|for|in)\b/i,
    /\b([\d,]+(?:\.\d{1,2})?)\b/,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const cleaned = match[1].replace(/,/g, '');
      const parsedNum = parseFloat(cleaned);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        amount = parsedNum;
        break;
      }
    }
  }

  // 2. Category Detection
  let category = 'Other';
  const flightRegex = /\b(flight|flights|airline|airfare|air\s*india|indigo|spicejet|vistara|emirates|delta|united|plane|air\s*ticket)\b/i;
  const lodgingRegex = /\b(hotel|motel|\binn\b|resort|airbnb|lodging|stay|taj\s*hotel|marriott|hyatt|oberoi|lemon\s*tree|hostel|room\s*stay|room\s*booking)\b/i;
  const mealRegex = /\b(lunch|dinner|breakfast|food|sushi|restaurant|cafe|coffee|starbucks|chai|swiggy|zomato|drinks|meal|dining|bar|burger|pizza|diner|bistro|snack|snacks|tea)\b/i;
  const transitRegex = /\b(uber|ola|lyft|taxi|cab|transit|subway|metro|train|bus|auto|rickshaw|airport\s*cab|toll|parking|ride|flight\s*transit)\b/i;

  if (flightRegex.test(lowerText)) {
    category = 'Flight';
  } else if (mealRegex.test(lowerText)) {
    category = 'Meals';
  } else if (transitRegex.test(lowerText)) {
    category = 'Transit';
  } else if (lodgingRegex.test(lowerText)) {
    category = 'Lodging';
  }

  // 3. Merchant & Place Extraction
  let merchant = 'N/A';
  const merchantMatch = text.match(/(?:at|from|with|to|via)\s+([A-Z][A-Za-z0-9\s'&.-]+?)(?:\s+(?:for|on|yesterday|today|last|[₹$]|rs|\d)|$)/i);
  if (merchantMatch && merchantMatch[1]) {
    merchant = merchantMatch[1].trim();
  } else if (lowerText.includes('uber')) {
    merchant = 'Uber';
  } else if (lowerText.includes('ola')) {
    merchant = 'Ola Cabs';
  } else if (lowerText.includes('air india')) {
    merchant = 'Air India';
  } else if (lowerText.includes('indigo')) {
    merchant = 'IndiGo Airlines';
  } else if (lowerText.includes('taj hotel')) {
    merchant = 'Taj Hotel';
  } else if (lowerText.includes('mainland china')) {
    merchant = 'Mainland China';
  } else if (lowerText.includes('starbucks')) {
    merchant = 'Starbucks';
  } else if (lowerText.includes('sushi dai')) {
    merchant = 'Sushi Dai';
  }

  // 4. Title / Description Generation
  let title = '';
  if (merchant !== 'N/A' && category !== 'Other') {
    title = `${category === 'Meals' ? 'Meal' : category} at ${merchant}`;
  } else if (merchant !== 'N/A') {
    title = `Expense at ${merchant}`;
  } else if (category !== 'Other') {
    title = `${category} Expense`;
  } else {
    title = text.length > 40 ? text.substring(0, 37) + '...' : text;
  }

  if (lowerText.includes('lunch')) title = merchant !== 'N/A' ? `Lunch at ${merchant}` : 'Lunch';
  if (lowerText.includes('dinner')) title = merchant !== 'N/A' ? `Dinner at ${merchant}` : 'Client Dinner';
  if (lowerText.includes('breakfast')) title = merchant !== 'N/A' ? `Breakfast at ${merchant}` : 'Breakfast';
  if (lowerText.includes('coffee') || lowerText.includes('chai')) title = merchant !== 'N/A' ? `Coffee & Snacks at ${merchant}` : 'Coffee & Refreshments';
  if (lowerText.includes('flight') || lowerText.includes('fly')) title = merchant !== 'N/A' ? `${merchant} Flight` : 'Flight Ticket';
  if (lowerText.includes('hotel') || lowerText.includes('stay')) title = merchant !== 'N/A' ? `${merchant} Stay` : 'Hotel Lodging';
  if (lowerText.includes('uber') || lowerText.includes('ola') || lowerText.includes('taxi') || lowerText.includes('cab')) title = merchant !== 'N/A' ? `${merchant} Ride` : 'Transit / Cab';

  // 5. Date determination
  let date = new Date().toISOString();
  if (lowerText.includes('yesterday')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString();
  }

  // 6. Check completeness
  const missingFields = [];
  if (!amount) missingFields.push('amount');
  if (merchant === 'N/A' && category === 'Other') missingFields.push('merchant/category');

  const isComplete = amount !== null && amount > 0;

  let replyMessage = '';
  if (isComplete) {
    replyMessage = `I've prepared your expense of ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for ${title}. You can review and confirm it below.`;
  } else {
    replyMessage = "I got some details, but I couldn't determine the exact amount spent. Could you please specify how much it cost in ₹?";
  }

  return {
    type: 'expense',
    amount: amount || 0,
    category,
    merchant: merchant !== 'N/A' ? merchant : 'General Merchant',
    title,
    trip: 'General',
    status: 'Pending',
    date,
    notes: `Logged via AI Chat from message: "${text}"`,
    isComplete,
    missingFields,
    replyMessage,
  };
};

/**
 * Unified Main Entry Point
 */
const parseExpenseMessage = async (message) => {
  const cleanMsg = (message || '').trim();
  if (!cleanMsg) {
    return {
      type: 'off_topic',
      replyMessage: OFF_TOPIC_REPLY,
      isComplete: false,
    };
  }

  // 1. Explicit off-topic check
  if (isOffTopicQuery(cleanMsg)) {
    return {
      type: 'off_topic',
      replyMessage: OFF_TOPIC_REPLY,
      isComplete: false,
    };
  }

  // 2. OpenAI with strict guardrails
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim().length > 10) {
    const aiResult = await parseWithOpenAI(cleanMsg, apiKey);
    if (aiResult) return aiResult;
  }

  // 3. Fallback: Travel Itinerary Request
  if (isItineraryRequest(cleanMsg)) {
    return generateLocalItinerary(cleanMsg);
  }

  // 4. Fallback: Travel Expense Logging
  if (isExpenseRequest(cleanMsg)) {
    return parseWithLocalExpenseNLP(cleanMsg);
  }

  // 5. Default fallback for non-travel queries
  return {
    type: 'off_topic',
    replyMessage: OFF_TOPIC_REPLY,
    isComplete: false,
  };
};

module.exports = {
  parseExpenseMessage,
  generateLocalItinerary,
  parseWithLocalExpenseNLP,
  isItineraryRequest,
  isExpenseRequest,
  isOffTopicQuery,
  OFF_TOPIC_REPLY,
};

