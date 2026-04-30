import { createClient } from '@supabase/supabase-js'
import { books } from '../app/src/data/books'

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3BuY3dtcmZ0bmpueXFod2JpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU2NDM3NSwiZXhwIjoyMDkzMTQwMzc1fQ.Nz7Y4iql2jhvvw8P_YRz8cZddlhnEejk4qc8ujXcEBY'
const SUPABASE_URL = 'https://vvopncwmrftnjnxqhwbi.supabase.co'

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function seedBooks() {
  console.log(`Seeding ${books.length} books...`)
  
  // Transform books to match database schema
  const bookRecords = books.map(book => ({
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    category: book.category,
    subcategory: book.subcategory,
    cover: book.cover,
    rating: book.rating,
    pages: book.pages,
    language: book.language,
    price: book.price,
    is_premium: book.isPremium,
    is_new: book.isNew,
    is_trending: book.isTrending,
    description: book.description,
    tags: book.tags,
  }))
  
  // Insert in batches of 50
  const batchSize = 50
  for (let i = 0; i < bookRecords.length; i += batchSize) {
    const batch = bookRecords.slice(i, i + batchSize)
    const { error } = await supabaseAdmin
      .from('books')
      .upsert(batch, { onConflict: 'id' })
    
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
    } else {
      console.log(`✅ Batch ${i / batchSize + 1}: ${batch.length} books inserted`)
    }
  }
  
  console.log('Seeding complete!')
}

async function createAdminUser() {
  // Create default admin user
  const adminEmail = 'admin@quickfare.pk'
  const adminPassword = 'QuickFareAdmin123!'
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { full_name: 'QuickFare Admin' },
  })
  
  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('Admin user already exists')
      // Update role to admin
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const adminUser = users?.users?.find(u => u.email === adminEmail)
      if (adminUser) {
        await supabaseAdmin.from('profiles').update({ role: 'admin' }).eq('id', adminUser.id)
        console.log('Admin role confirmed')
      }
    } else {
      console.error('Error creating admin:', error)
    }
  } else {
    console.log('Admin user created:', data.user?.id)
    // Set role to admin in profiles
    if (data.user) {
      await supabaseAdmin.from('profiles').update({ role: 'admin' }).eq('id', data.user.id)
      console.log('Admin role set')
    }
  }
  
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`)
}

seedBooks().then(() => createAdminUser())
