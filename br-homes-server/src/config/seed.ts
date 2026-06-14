import bcrypt from 'bcryptjs'
import User from '../models/User.model'
import Setting from '../models/Setting.model'

/**
 * Seed default platform settings
 */
export const seedSettings = async () => {
  try {
    await Setting.findOneAndUpdate(
      { key: 'globalImageLimit' },
      {
        $setOnInsert: {
          key: 'globalImageLimit',
          value: 7,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    )
    console.log('Settings seeded successfully')
  } catch (error) {
    console.error('Failed to seed settings:', error)
  }
}

/**
 * Seed admin user - creates admin account if it does not exist
 */
export const seedAdmin = async () => {
  try {
    const adminEmail = 'brhomes.app@gmail.com'
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    const passwordHash = await bcrypt.hash('Admin@123', 10)
    await User.create({
      name: 'BR-Homes Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isActive: true,
      isProfileComplete: true,
      ownerApproved: true,
      emailVerified: new Date(),
      phone: '0000000000',
    })
    console.log('Admin user created successfully')
  } catch (error) {
    console.error('Failed to seed admin:', error)
  }
}
