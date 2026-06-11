import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Trash, Upload, Film, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/components/common/ConfirmationModal'

export default function AdminSidebarAdsPage() {
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadProgress, setUploadProgress] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['sidebar', 'ads'],
    queryFn: async () => (await api.get('/api/sidebar-ads')).data,
  })

  const uploadMut = useMutation({
    mutationFn: async (form: FormData) => {
      setUploadProgress(true)
      const res = await api.post('/api/admin/sidebar-ads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sidebar', 'ads'] })
      toast.success('Ad videos uploaded successfully')
      setUploadProgress(false)
    },
    onError: () => {
      toast.error('Failed to upload ad videos. Check file size (max 50MB each).')
      setUploadProgress(false)
    },
  })

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/sidebar-ads/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sidebar', 'ads'] })
      toast.success('Ad video removed')
    },
    onError: () => {
      toast.error('Failed to remove ad video')
    },
  })

  if (isLoading) return <LoadingSkeleton count={4} type="row" />

  const videos = data?.data || []

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast.error('Please select at least one video')
      return
    }

    // Validate file types
    const invalidFiles = Array.from(files).filter(
      (f) => !f.type.startsWith('video/')
    )
    if (invalidFiles.length > 0) {
      toast.error('Only video files are allowed')
      return
    }

    const fd = new FormData()
    Array.from(files).forEach((f) => fd.append('videos', f))
    uploadMut.mutate(fd)
  }

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sidebar Ad Videos</h1>
          <p className="text-sm text-slate-500">Manage advertisement videos shown on property detail pages</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Upload New Videos</h3>
            <p className="text-xs text-slate-500">
              Videos will play automatically one after another on the property detail page sidebar. Max 50MB per file.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            disabled={uploadMut.status === 'pending'}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 shrink-0"
          >
            <Upload className="w-4 h-4" />
            {uploadMut.status === 'pending' ? 'Uploading...' : 'Upload Videos'}
          </Button>
        </div>
        {uploadProgress && (
          <div className="mt-4">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Uploading videos to cloud storage... This may take a while for large files.</p>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No ad videos uploaded yet</p>
          <p className="text-sm text-slate-400 mt-1">Upload videos above to show them on property detail pages</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid: any) => (
            <div
              key={vid._id}
              className="relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
            >
              <video
                src={vid.videoUrl}
                className="w-full aspect-video object-cover bg-slate-950"
                controls
                muted
                preload="metadata"
              />
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  disabled={delMut.isPending}
                  onClick={() => setDeleteId(vid._id)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete video"
                >
                  {delMut.isPending && delMut.variables === vid._id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <Trash className="w-4 h-4 text-red-600" />
                  )}
                </button>
              </div>
              <div className="px-3 py-2 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Added {new Date(vid.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            delMut.mutate(deleteId, {
              onSuccess: () => setDeleteId(null)
            })
          }
        }}
        title="Delete Ad Video"
        message="Are you sure you want to delete this ad video? This action cannot be undone."
        confirmText="Delete"
        isPending={delMut.isPending}
      />
    </div>
  )
}
