import { supabase } from '../config/database';

export const seedCatalog = async () => {
  console.log('🌱 Seeding PadosiPro task catalogue...');

  const categories = [
    {
      name: 'Home & Maintenance',
      description: 'Keep your home running smoothly with expert management and maintenance services.',
      icon_name: 'home-outline'
    },
    {
      name: 'Errands & Shopping',
      description: 'Daily errands, groceries, parcel pick-ups, and specialized shopping handled for you.',
      icon_name: 'cart-outline'
    },
    {
      name: 'Events & Hosting',
      description: 'Flawless event planning, catering coordination, and party management.',
      icon_name: 'sparkles-outline'
    },
    {
      name: 'Administrative & Pet Care',
      description: 'Document management, bill payments, appointments, and dedicated pet care.',
      icon_name: 'clipboard-outline'
    }
  ];

  // Insert categories
  for (const cat of categories) {
    const { data: existingCat } = await supabase
      .from('categories')
      .select('id')
      .eq('name', cat.name)
      .single();

    let categoryId = existingCat?.id;

    if (!categoryId) {
      const { data: newCat, error } = await supabase
        .from('categories')
        .insert([cat])
        .select('id')
        .single();

      if (error) {
        console.error(`Error inserting category ${cat.name}:`, error.message);
        continue;
      }
      categoryId = newCat.id;
    }

    // Tasks per category
    let tasks: Array<{ name: string; short_description: string; icon_name: string }> = [];

    if (cat.name === 'Home & Maintenance') {
      tasks = [
        { name: 'Deep Home Cleaning', short_description: 'Full house deep cleaning including kitchen & bathrooms.', icon_name: 'sparkles' },
        { name: 'AC Servicing & Repair', short_description: 'Periodic maintenance, filter cleaning, and gas refilling.', icon_name: 'snow' },
        { name: 'Plumbing & Leaks', short_description: 'Fixing leaky faucets, pipe replacements, and drain unblocking.', icon_name: 'water' },
        { name: 'Electrical Repairs', short_description: 'Wiring fixes, light fixture installs, and switchboard maintenance.', icon_name: 'flash' },
        { name: 'Carpenter Work', short_description: 'Furniture assembly, door lock repair, and custom woodwork.', icon_name: 'hammer' },
        { name: 'Pest Control', short_description: 'Eco-friendly pest treatment for cockroaches, termites, and mosquitoes.', icon_name: 'bug' }
      ];
    } else if (cat.name === 'Errands & Shopping') {
      tasks = [
        { name: 'Fresh Organic Grocery Pick-up', short_description: 'Sourcing fresh vegetables and organic staples from local markets.', icon_name: 'basket' },
        { name: 'Laundry & Dry Cleaning', short_description: 'Doorstep pickup, professional washing, ironing, and delivery.', icon_name: 'shirt' },
        { name: 'Pharmacy & Medicine Delivery', short_description: 'Prescription pickup and timely delivery of healthcare supplies.', icon_name: 'medical' },
        { name: 'Courier & Package Drops', short_description: 'Sending packages via local courier services or intercity shipping.', icon_name: 'cube' },
        { name: 'Gourmet Specialty Sourcing', short_description: 'Finding rare ingredients, artisan breads, and premium wines.', icon_name: 'restaurant' }
      ];
    } else if (cat.name === 'Events & Hosting') {
      tasks = [
        { name: 'Party Catering Coordination', short_description: 'Selecting menus, booking chefs, and managing buffet setups.', icon_name: 'wine' },
        { name: 'Floral & Balloon Decor', short_description: 'Custom theme decor for birthdays, anniversaries, and dinners.', icon_name: 'rose' },
        { name: 'Bartender & Server Booking', short_description: 'Hiring professional mixologists and waitstaff for private gatherings.', icon_name: 'glass' },
        { name: 'Sound & Lighting Setup', short_description: 'Renting audio systems, microphones, and ambient lights.', icon_name: 'headset' },
        { name: 'Post-Party Cleanup', short_description: 'Complete cleanup after your home event so you can rest easy.', icon_name: 'trash' }
      ];
    } else if (cat.name === 'Administrative & Pet Care') {
      tasks = [
        { name: 'Utility Bill Management', short_description: 'Automated tracking and payment of electricity, water, and broadband.', icon_name: 'receipt' },
        { name: 'Dog Walking & Sitting', short_description: 'Daily walks, feeding, and home sitting by verified pet lovers.', icon_name: 'paw' },
        { name: 'Vet Appointment & Transit', short_description: 'Taking your pet to the vet clinic and handling vaccination logs.', icon_name: 'pulse' },
        { name: 'Document Printing & Attestation', short_description: 'Printing, scanning, notary seals, and courier drops.', icon_name: 'document-text' },
        { name: 'Car Wash & Detailing', short_description: 'Doorstep interior vacuuming, exterior wash, and polish.', icon_name: 'car' }
      ];
    }

    for (const task of tasks) {
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('id')
        .eq('name', task.name)
        .single();

      if (!existingTask) {
        await supabase.from('tasks').insert([
          {
            ...task,
            category_id: categoryId
          }
        ]);
      }
    }
  }

  console.log('✅ Task catalogue seeded successfully with 21 tasks across 4 categories!');
};

if (require.main === module) {
  seedCatalog().then(() => process.exit(0)).catch((err) => {
    console.error('Failed to seed DB:', err);
    process.exit(1);
  });
}
