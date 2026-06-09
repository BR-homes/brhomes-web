import { useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminSliderPage() {
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { data, isLoading } = useQuery({ queryKey: ['slider', 'images'], queryFn: async () => (await api.get('/api/sliders')).data })

  const uploadMut = useMutation({
    mutationFn: async (form: FormData) => {
      const res = await api.post('/api/admin/sliders', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['slider', 'images'] })
      toast.success('Slider images uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload slider images')
    },
  })

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/sliders/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['slider', 'images'] })
      toast.success('Slider image removed')
    },
    onError: () => {
      toast.error('Failed to remove slider image')
    },
  })

  if (isLoading) return <LoadingSkeleton count={4} type="row" />

  const images = data?.data || []

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    const fd = new FormData()
    Array.from(files).forEach((f) => fd.append('images', f))
    uploadMut.mutate(fd)
  }

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold mb-4">Slider Images</h1>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          disabled={uploadMut.status === 'pending'}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadMut.status === 'pending' ? 'Uploading...' : 'Upload Images'}
        </Button>
        <p className="text-sm text-slate-500">Upload one or more slider images for the homepage.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img: any) => (
          <div key={img._id} className="relative rounded overflow-hidden bg-white border">
            <img src={img.imageUrl} alt="slider" className="w-full h-40 object-cover" />
            <button onClick={() => delMut.mutate(img._id)} className="absolute top-2 right-2 bg-white p-1 rounded shadow">
              <Trash className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
