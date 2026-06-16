import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useAuthStore } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import type { IProperty, IUser, IApiResponse } from '@/types'

const propertySchema = z.object({
  customOwnerName: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description cannot exceed 2000 characters'),
  propertyType: z.enum(['house', 'flat']),
  listingType: z.enum(['sale', 'rent']),
  bhk: z.string().optional(),
  areaSqft: z.string()
    .min(1, 'Property area is required')
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: 'Property area must be a positive number (greater than 0)' }),
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: 'Price must be a positive number (greater than 0)' }),
  city: z.string().min(2, 'City is required (at least 2 characters)'),
  areaLocality: z.string().min(2, 'Area/locality is required (at least 2 characters)'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number starting with 6-9'),
}).refine((data) => {
  if (['house', 'flat'].includes(data.propertyType)) {
    return !!data.bhk && data.bhk !== '';
  }
  return true;
}, {
  message: 'BHK selection is required',
  path: ['bhk'],
})

const getPropertySchema = (isAdmin: boolean) => {
  return propertySchema.superRefine((data, ctx) => {
    if (isAdmin && (!data.customOwnerName || data.customOwnerName.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Owner Name is required',
        path: ['customOwnerName'],
      })
    }
  })
}

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  initialData?: IProperty
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
}

export default function PropertyForm({ initialData, onSubmit, isSubmitting }: PropertyFormProps) {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const [existingImages, setExistingImages] = useState(initialData?.images || [])
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>([])

  const { previews, addImages, removeImage, getFiles } = useImageUpload(7 - existingImages.length)
  const canAddMore = (existingImages.length + previews.length) < 7

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(getPropertySchema(isAdmin)),
    defaultValues: initialData ? {
      customOwnerName: initialData.customOwnerName || '',
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
      customOwnerName: '',
      propertyType: 'house',
      listingType: 'sale',
      city: 'Amreli',
    },
  })

  const propertyType = watch('propertyType')
  const showBhk = propertyType === 'house' || propertyType === 'flat'

  const handleRemoveExistingImage = (publicId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.cloudinaryPublicId !== publicId))
    setRemovedImagePublicIds((prev) => [...prev, publicId])
  }

  const handleFormSubmit = async (data: PropertyFormData) => {
    const fd = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') fd.append(key, value)
    })
    getFiles().forEach((file) => fd.append('images', file))
    removedImagePublicIds.forEach((id) => fd.append('removeImages', id))
    await onSubmit(fd)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Owner Selection (Admin Only) */}
      {isAdmin && (
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Owner Information</h3>
          <div>
            <Label htmlFor="customOwnerName">Owner Name *</Label>
            <Input
              id="customOwnerName"
              placeholder="e.g. Rajesh Kumar"
              {...register('customOwnerName')}
              className="mt-1"
            />
            {errors.customOwnerName && <p className="text-red-500 text-xs mt-1">{errors.customOwnerName.message}</p>}
            <p className="text-xs text-slate-400 mt-1">This is the name of the owner that will be displayed publicly on this property.</p>
          </div>
        </div>
      )}

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
              {errors.bhk && <p className="text-red-500 text-xs mt-1">{errors.bhk.message}</p>}
            </div>
          )}
          <div>
            <Label>Area (sq.ft) *</Label>
            <Input type="number" placeholder="e.g. 1200" {...register('areaSqft')} className="mt-1" onWheel={(e) => e.currentTarget.blur()} />
            {errors.areaSqft && <p className="text-red-500 text-xs mt-1">{errors.areaSqft.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" type="number" placeholder="e.g. 2500000" {...register('price')} className="mt-1" onWheel={(e) => e.currentTarget.blur()} />
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
        {(existingImages.length > 0 || previews.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {/* Existing Images */}
            {existingImages.map((img) => (
              <div key={img.cloudinaryPublicId} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRemoveExistingImage(img.cloudinaryPublicId)}
                  className={`absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'}`}
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
                {img.isPrimary && <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">Primary</span>}
              </div>
            ))}

            {/* New Previews */}
            {previews.map((p, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => removeImage(i)}
                  className={`absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'}`}
                  title="Remove preview image"
                >
                  <X className="w-3 h-3" />
                </button>
                {existingImages.length === 0 && i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">Primary</span>
                )}
              </div>
            ))}
          </div>
        )}
        {canAddMore && (
          <label className={`flex items-center justify-center gap-2 p-8 border-2 border-dashed border-slate-200 rounded-xl transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300 hover:bg-slate-50'}`}>
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">Click to upload images</span>
            {!isSubmitting && (
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => addImages(e.target.files)} />
            )}
          </label>
        )}
      </div>

      {isSubmitting && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2.5 text-slate-600 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          <span>Uploading property details and images to cloud storage. Please do not close this page...</span>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {initialData ? 'Update Property' : 'Submit for Review'}
      </Button>
    </form>
  )
}
