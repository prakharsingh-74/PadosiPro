-- Migration 002: Seed Task Categories & Tasks Catalogue

-- Insert Categories
INSERT INTO categories (id, name, description, icon_name) VALUES
('11111111-1111-1111-1111-111111111111', 'Home & Maintenance', 'Keep your home running smoothly with expert management and maintenance services.', 'home-outline'),
('22222222-2222-2222-2222-222222222222', 'Errands & Shopping', 'Daily errands, groceries, parcel pick-ups, and specialized shopping handled for you.', 'cart-outline'),
('33333333-3333-3333-3333-333333333333', 'Events & Hosting', 'Flawless event planning, catering coordination, and party management.', 'sparkles-outline'),
('44444444-4444-4444-4444-444444444444', 'Administrative & Pet Care', 'Document management, bill payments, appointments, and dedicated pet care.', 'clipboard-outline')
ON CONFLICT (name) DO NOTHING;

-- Insert Tasks for Category 1: Home & Maintenance
INSERT INTO tasks (category_id, name, short_description, icon_name) VALUES
('11111111-1111-1111-1111-111111111111', 'Deep Home Cleaning', 'Full house deep cleaning including kitchen & bathrooms.', 'sparkles'),
('11111111-1111-1111-1111-111111111111', 'AC Servicing & Repair', 'Periodic maintenance, filter cleaning, and gas refilling.', 'snow'),
('11111111-1111-1111-1111-111111111111', 'Plumbing & Leaks', 'Fixing leaky faucets, pipe replacements, and drain unblocking.', 'water'),
('11111111-1111-1111-1111-111111111111', 'Electrical Repairs', 'Wiring fixes, light fixture installs, and switchboard maintenance.', 'flash'),
('11111111-1111-1111-1111-111111111111', 'Carpenter Work', 'Furniture assembly, door lock repair, and custom woodwork.', 'hammer'),
('11111111-1111-1111-1111-111111111111', 'Pest Control', 'Eco-friendly pest treatment for cockroaches, termites, and mosquitoes.', 'bug');

-- Insert Tasks for Category 2: Errands & Shopping
INSERT INTO tasks (category_id, name, short_description, icon_name) VALUES
('22222222-2222-2222-2222-222222222222', 'Fresh Organic Grocery Pick-up', 'Sourcing fresh vegetables and organic staples from local markets.', 'basket'),
('22222222-2222-2222-2222-222222222222', 'Laundry & Dry Cleaning', 'Doorstep pickup, professional washing, ironing, and delivery.', 'shirt'),
('22222222-2222-2222-2222-222222222222', 'Pharmacy & Medicine Delivery', 'Prescription pickup and timely delivery of healthcare supplies.', 'medical'),
('22222222-2222-2222-2222-222222222222', 'Courier & Package Drops', 'Sending packages via local courier services or intercity shipping.', 'cube'),
('22222222-2222-2222-2222-222222222222', 'Gourmet Specialty Sourcing', 'Finding rare ingredients, artisan breads, and premium wines.', 'restaurant');

-- Insert Tasks for Category 3: Events & Hosting
INSERT INTO tasks (category_id, name, short_description, icon_name) VALUES
('33333333-3333-3333-3333-333333333333', 'Party Catering Coordination', 'Selecting menus, booking chefs, and managing buffet setups.', 'wine'),
('33333333-3333-3333-3333-333333333333', 'Floral & Balloon Decor', 'Custom theme decor for birthdays, anniversaries, and dinners.', 'rose'),
('33333333-3333-3333-3333-333333333333', 'Bartender & Server Booking', 'Hiring professional mixologists and waitstaff for private gatherings.', 'glass'),
('33333333-3333-3333-3333-333333333333', 'Sound & Lighting Setup', 'Renting audio systems, microphones, and ambient lights.', 'headset'),
('33333333-3333-3333-3333-333333333333', 'Post-Party Cleanup', 'Complete cleanup after your home event so you can rest easy.', 'trash');

-- Insert Tasks for Category 4: Administrative & Pet Care
INSERT INTO tasks (category_id, name, short_description, icon_name) VALUES
('44444444-4444-4444-4444-444444444444', 'Utility Bill Management', 'Automated tracking and payment of electricity, water, and broadband.', 'receipt'),
('44444444-4444-4444-4444-444444444444', 'Dog Walking & Sitting', 'Daily walks, feeding, and home sitting by verified pet lovers.', 'paw'),
('44444444-4444-4444-4444-444444444444', 'Vet Appointment & Transit', 'Taking your pet to the vet clinic and handling vaccination logs.', 'pulse'),
('44444444-4444-4444-4444-444444444444', 'Document Printing & Attestation', 'Printing, scanning, notary seals, and courier drops.', 'document-text'),
('44444444-4444-4444-4444-444444444444', 'Car Wash & Detailing', 'Doorstep interior vacuuming, exterior wash, and polish.', 'car');
