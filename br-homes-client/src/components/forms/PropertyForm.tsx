import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { IProperty } from '@/types'

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  propertyType: z.enum(['house', 'flat']),
  listingType: z.enum(['sale', 'rent']),
  bhk: z.string().optional(),
  areaSqft: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  city: z.string().min(2, 'City is required'),
  areaLocality: z.string().min(2, 'Area/locality is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Must be 6 digits'),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit number'),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  initialData?: IProperty
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
}

export default function PropertyForm({ initialData, onSubmit, isSubmitting }: PropertyFormProps) {
  const { previews, addImages, removeImage, getFiles, canAddMore } = useImageUpload(7)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      propertyType: initialData.propertyType,
      listingType: initialData.listingType,
      bhk: initialData.bhk?.toString() || '',
      areaSqft: initialData.areaSqft?.toString() || '',
      price: initialData.price.toString(),
      city: initialData.city,
      areaLocality: initialData.areaLocality,
      pincode: initialData.pincode,
      contactPhone: initialData.contactPhone,
    } : {
      propertyType: 'house',
      listingType: 'sale',
      city: 'Amreli',
    },
  })

  const propertyType = watch('propertyType')
  const showBhk = propertyType === 'house' || propertyType === 'flat'

  const handleFormSubmit = async (data: PropertyFormData) => {
    const fd = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') fd.append(key, value)
    })
    getFiles().forEach((file) => fd.append('images', file))
    await onSubmit(fd)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" placeholder="e.g. 3 BHK House in Madhav Nagar" {...register('title')} className="mt-1" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your property in detail..."
            {...register('description')}
            className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Property Type *</Label>
            <select {...register('propertyType')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="house">House</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div>
            <Label>Listing Type *</Label>
            <select {...register('listingType')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {showBhk && (
            <div>
              <Label>BHK *</Label>
              <select {...register('bhk')} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select BHK</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
              </select>
            </div>
          )}
          <div>
            <Label>Area (sq.ft)</Label>
            <Input type="number" placeholder="e.g. 1200" {...register('areaSqft')} className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" type="number" placeholder="e.g. 2500000" {...register('price')} className="mt-1" />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City *</Label>
            <Input placeholder="Amreli" {...register('city')} className="mt-1" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <Label>Pincode *</Label>
            <Input placeholder="365601" {...register('pincode')} className="mt-1" />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
          </div>
        </div>
        <div>
          <Label>Area / Locality *</Label>
          <Input placeholder="e.g. Madhav Nagar" {...register('areaLocality')} className="mt-1" />
          {errors.areaLocality && <p className="text-red-500 text-xs mt-1">{errors.areaLocality.message}</p>}
        </div>
      </div>

      {/* Contact */}
      <div>
        <Label>Contact Phone *</Label>
        <Input placeholder="9876543210" {...register('contactPhone')} className="mt-1" />
        {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
        <p className="text-xs text-slate-400 mt-1">This number will be shown publicly on your listing</p>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900">Property Images</h3>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previews.map((p, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">Primary</span>}
              </div>
            ))}
          </div>
        )}
        {canAddMore && (
          <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-all">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">Click to upload images</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => addImages(e.target.files)} />
          </label>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {initialData ? 'Update Property' : 'Submit for Review'}
      </Button>
    </form>
  )
}
