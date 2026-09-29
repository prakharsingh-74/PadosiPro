import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES_DATA = [
  {
    name: 'Errands & Daily Tasks',
    description: 'Bills, banks, documents, government work',
    icon_name: 'check-square',
    subTasks: [
      { 
        name: 'Pickups & Deliveries',
        services: [
          'Courier pickup/drop',
          'Grocery pickup & restocking',
          'Medicine pickup & refills',
          'Pet food & supplies pickup'
        ]
      },
      { 
        name: 'Payments & Renewals',
        services: [
          'Subscription renewals handling',
          'Bill payments (electricity, water, gas, society)'
        ]
      },
      { 
        name: 'Documents & Government',
        services: [
          'Passport & Visa assistance',
          'Aadhar/PAN card updates',
          'Property tax payments',
          'RTO & Vehicle registration'
        ]
      },
      { 
        name: 'Shopping',
        services: [
          'Festival & gift shopping',
          'Hardware & spare parts',
          'Boutique & tailor pickups',
          'Electronics purchase support'
        ]
      }
    ]
  },
  {
    name: 'Home Services',
    description: 'AC, plumbing, electrical, cleaning, repairs',
    icon_name: 'home',
    subTasks: [
      { 
        name: 'Cleaning',
        services: ['Deep house cleaning', 'Sofa & carpet cleaning', 'Bathroom cleaning', 'Water tank cleaning']
      },
      { 
        name: 'Repairs',
        services: ['General handyman', 'Furniture repair & polish', 'Door & lock repair', 'Seepage & waterproofing']
      },
      { 
        name: 'Appliances & Utilities',
        services: ['AC service & repair', 'RO/Water purifier service', 'Washing machine repair', 'Refrigerator repair']
      },
      { 
        name: 'Property & Society',
        services: ['Society maintenance coordination', 'Pest control', 'Painting & renovation', 'Tenant handover management']
      }
    ]
  },
  {
    name: 'Travel & Tourism',
    description: 'Flights, hotels, visas, transfers, itineraries',
    icon_name: 'map-pin',
    subTasks: [
      { 
        name: 'Book Travel',
        services: [
          'Hotel & homestay selection',
          'Itinerary planning & rescheduling',
          'Flight booking & rebooking',
          'Train booking (Tatkal, waitlist handling)',
          'Travel insurance coordination'
        ]
      },
      { 
        name: 'On-Trip Support',
        services: ['Emergency rebooking', 'Local concierge', 'Restaurant reservations', 'Activity booking']
      },
      { 
        name: 'Documents & Visa',
        services: ['Visa application processing', 'Passport renewal', 'Forex arrangements', 'Travel insurance handling']
      },
      { 
        name: 'Local Transport',
        services: ['Airport transfers', 'Outstation cab booking', 'Rental cars', 'Daily commute setup']
      }
    ]
  },
  {
    name: 'Health & Medical',
    description: 'Doctor visits, pharmacy, labs, physio',
    icon_name: 'heart',
    subTasks: [
      { 
        name: 'Appointments & Tests',
        services: ['Doctor consultation booking', 'Lab test sample collection', 'Health checkup packages', 'Specialist referrals']
      },
      { 
        name: 'Records & Reports',
        services: ['Medical report digitization', 'Prescription management', 'Health record tracking', 'Report collection']
      },
      { 
        name: 'Hospital & Emergency',
        services: ['Ambulance booking', 'Hospital admission assistance', 'Second opinion coordination', 'Discharge paperwork']
      },
      { 
        name: 'Insurance & Claims',
        services: ['Health insurance purchase', 'Claim filing & follow-up', 'Policy renewal', 'Reimbursement tracking']
      }
    ]
  },
  {
    name: 'Senior Care',
    description: 'Check-ins, medicines, vitals, companionship',
    icon_name: 'users',
    subTasks: [
      { 
        name: 'Daily Care',
        services: ['Routine check-ins', 'Grocery & meal delivery', 'Companion visits', 'Errand running']
      },
      { 
        name: 'Medical Support',
        services: ['Medicine reminders & refills', 'Physiotherapy at home', 'Nurse booking', 'Vitals monitoring']
      },
      { 
        name: 'Safety & Mobility',
        services: ['Fall-proof home setup', 'Wheelchair arrangement', 'Assisted travel', 'Emergency response handling']
      },
      { 
        name: 'Family Coordination',
        services: ['Regular updates to family', 'Video call setup', 'Event attendance support', 'Milestone celebrations']
      }
    ]
  },
  {
    name: 'Events & Management',
    description: 'Weddings, décor, catering, photography',
    icon_name: 'calendar',
    subTasks: [
      { 
        name: 'Planning & Venue',
        services: ['Venue scouting & booking', 'Budget planning', 'Theme & decor conceptualization', 'Invitation management']
      },
      { 
        name: 'Vendors & Services',
        services: ['Catering & menu tasting', 'Photographer booking', 'Entertainment & DJ', 'Florist coordination']
      },
      { 
        name: 'Guests',
        services: ['RSVP tracking', 'Guest accommodation', 'Airport pickups for guests', 'Welcome kits']
      },
      { 
        name: 'Event Day & After',
        services: ['On-day event coordination', 'Post-event cleanup', 'Thank you notes', 'Vendor final payments']
      }
    ]
  },
  {
    name: 'Workforce Management',
    description: 'Maids, cooks, drivers, nannies, payroll',
    icon_name: 'briefcase',
    subTasks: [
      { 
        name: 'Hire Staff',
        services: ['Maid & cook hiring', 'Nanny & babysitter sourcing', 'Driver hiring', 'Security guard placement']
      },
      { 
        name: 'Staff Records & Payroll',
        services: ['Salary negotiation & payment', 'Leave tracking', 'Advance payment management', 'Benefit administration']
      },
      { 
        name: 'Verification',
        services: ['Background checks', 'Police verification', 'Reference checks', 'ID collection']
      },
      { 
        name: 'Replacement & Exit',
        services: ['Temporary replacements', 'Exit interviews', 'Final settlement', 'Handover coordination']
      }
    ]
  },
  {
    name: 'Digital & Tech Help',
    description: 'WiFi, CCTV, smart locks, device repair',
    icon_name: 'wifi',
    subTasks: [
      { 
        name: 'Device Setup',
        services: ['New laptop/phone setup', 'Smart TV installation', 'Printer configuration', 'Software installation']
      },
      { 
        name: 'Internet & Home Tech',
        services: ['WiFi router optimization', 'Smart home (Alexa/Google) setup', 'CCTV installation', 'Smart lock setup']
      },
      { 
        name: 'Accounts & Data',
        services: ['Data backup & recovery', 'Password management', 'Email setup', 'Cloud storage organization']
      },
      { 
        name: 'Safety & Support',
        services: ['Antivirus installation', 'Parental controls', 'Phishing protection', 'Tech troubleshooting']
      }
    ]
  },
  {
    name: 'Relocation Services',
    description: 'Packers, movers, handover, paperwork',
    icon_name: 'truck',
    subTasks: [
      { 
        name: 'Find a Home',
        services: ['Broker coordination', 'Property shortlisting', 'Lease negotiation', 'Locality research']
      },
      { 
        name: 'Move Execution',
        services: ['Packers & movers booking', 'Supervision of packing', 'Transit insurance', 'Vehicle transport']
      },
      { 
        name: 'Set Up New Home',
        services: ['Unpacking & organizing', 'Utilities setup', 'Deep cleaning before move', 'Handyman for mounting']
      },
      { 
        name: 'Transfers & Paperwork',
        services: ['Address change updates', 'Rental agreement registration', 'Society NOCs', 'Security deposit recovery']
      }
    ]
  },
  {
    name: 'NutriFix',
    description: 'Groceries, food delivery, diet plans, meal prep',
    icon_name: 'shopping-bag',
    isSoon: true,
    subTasks: [
      { 
        name: 'Diet Plans',
        services: ['Weight loss programs', 'Medical condition diets', 'Sports nutrition', 'Vegan/Keto plans']
      },
      { 
        name: 'Meal Delivery',
        services: ['Daily tiffin service', 'Healthy meal prep', 'Cold-pressed juices', 'Custom macro meals']
      },
      { 
        name: 'Groceries',
        services: ['Fresh organic produce sourcing', 'Exotic ingredient sourcing', 'Bulk pantry restocking', 'Specialized supplements']
      },
      { 
        name: 'Special & Corporate',
        services: ['Office catering', 'Event nutrition planning', 'Corporate wellness programs', 'Healthy snack boxes']
      }
    ]
  },
  {
    name: 'Fashion & Styling',
    description: 'Salon at home, tailoring, styling, gifting',
    icon_name: 'scissors',
    isSoon: true,
    subTasks: []
  },
  {
    name: 'Religious & Cultural',
    description: 'Pandit booking, puja, temple visits',
    icon_name: 'sun',
    isSoon: true,
    subTasks: []
  },
  {
    name: 'Business Support',
    description: 'Registration, GST, bookkeeping, compliance',
    icon_name: 'file-text',
    isSoon: true,
    subTasks: []
  },
  {
    name: 'Education Support',
    description: 'Tutors, admissions, exam prep',
    icon_name: 'book-open',
    isSoon: true,
    subTasks: []
  },
  {
    name: 'Insurance & Loans',
    description: 'Compare policies, plan loans, paperwork handled',
    icon_name: 'shield',
    isSoon: true,
    subTasks: []
  }
];

async function seed() {
  console.log('Seeding Task Catalogue...');
  
  for (const cat of CATEGORIES_DATA) {
    // 1. Insert/Update Category
    const { data: categoryData, error: catError } = await supabase
      .from('categories')
      .upsert({
        name: cat.name,
        description: cat.description,
        icon_name: cat.icon_name,
        is_soon: cat.isSoon || false
      }, { onConflict: 'name' })
      .select()
      .single();

    if (catError) {
      console.error(`Failed to insert category ${cat.name}:`, catError);
      continue;
    }
    console.log(`✓ Upserted Category: ${cat.name}`);

    // 2. Insert SubTasks
    if (cat.subTasks && cat.subTasks.length > 0) {
      const taskInserts = cat.subTasks.map(t => ({
        category_id: categoryData.id,
        name: t.name,
        services: JSON.stringify(t.services || [])
      }));

      await supabase.from('tasks').delete().eq('category_id', categoryData.id);
      
      const { error: taskError } = await supabase
        .from('tasks')
        .insert(taskInserts);

      if (taskError) {
        console.error(`  x Failed to insert tasks for ${cat.name}:`, taskError);
      } else {
        console.log(`  ✓ Inserted ${taskInserts.length} tasks for ${cat.name}`);
      }
    }
  }

  console.log('✅ Seeding completed!');
}

seed().catch(console.error);
