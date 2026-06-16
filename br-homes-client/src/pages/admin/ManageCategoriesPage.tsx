import { useRef, useState } from 'react'
import { useCategories, useCreateCategory, useUpdateCategory, useToggleCategoryActive, useDeleteCategory } from '@/hooks/useCategories'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Trash, Pencil, Eye, EyeOff, Loader2, Plus, Image as ImageIcon, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/components/common/ConfirmationModal'

export default function ManageCategoriesPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Queries & Mutations
  const { data, isLoading } = useCategories(true)
  const createMut = useCreateCategory()
  const updateMut = useUpdateCategory()
  const toggleMut = useToggleCategoryActive()
  const deleteMut = useDeleteCategory()

  // State
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const categories = data?.data || []

  // Handles file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFilePreview(URL.createObjectURL(file))
    }
  }

  // Handle Edit click
  const handleEditClick = (category: any) => {
    setEditingCategory(category)
    setTitle(category.title)
    setSelectedFile(null)
    setFilePreview(category.imageUrl)
  }

  // Reset form
  const resetForm = () => {
    setEditingCategory(null)
    setTitle('')
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle Create or Update submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    if (editingCategory) {
      updateMut.mutate(
        { id: editingCategory._id, formData },
        {
          onSuccess: () => {
            resetForm()
          },
        }
      )
    } else {
      if (!selectedFile) {
        toast.error('Category image is required')
        return
      }
      createMut.mutate(formData, {
        onSuccess: () => {
          resetForm()
        },
      })
    }
  }

  if (isLoading) return <LoadingSkeleton count={4} type="row" />

  const isPending = createMut.isPending || updateMut.isPending

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Categories</h1>
          <p className="text-sm text-slate-500">Create, edit, toggle visibility, and delete service categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Add/Edit Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Category Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Home Loan, Valuation"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Category Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isPending}
              />
              
              <div 
                onClick={() => !isPending && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition ${
                  filePreview ? 'border-slate-900' : 'border-slate-300'
                }`}
              >
                {filePreview ? (
                  <div className="relative">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold rounded transition">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <span className="text-xs block mt-1 text-slate-400">Max size 5MB (PNG, JPG)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingCategory ? (
                  'Update Category'
                ) : (
                  'Create Category'
                )}
              </Button>

              {editingCategory && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: List Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold text-slate-900">Existing Categories ({categories.length})</h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No categories found</p>
              <p className="text-sm text-slate-400">Create a category on the left to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-sm font-semibold border-b">
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 text-sm">
                  {categories.map((category: any) => (
                    <tr key={category._id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <img 
                          src={category.imageUrl} 
                          alt={category.title} 
                          className="w-10 h-10 rounded object-cover border" 
                        />
                      </td>
                      <td className="p-4 font-semibold text-slate-900">{category.title}</td>
                      <td className="p-4">
                        <span 
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            category.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title={category.isActive ? 'Hide' : 'Show'}
                            onClick={() => toggleMut.mutate(category._id)}
                            disabled={toggleMut.isPending}
                            className={`p-1.5 rounded-md hover:bg-slate-100 transition ${
                              category.isActive ? 'text-slate-600' : 'text-slate-400'
                            }`}
                          >
                            {toggleMut.isPending && toggleMut.variables === category._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : category.isActive ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            title="Edit"
                            onClick={() => handleEditClick(category)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            title="Delete"
                            onClick={() => setDeleteId(category._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMut.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? Deleting this category will also permanently delete all associated services under it. This action cannot be undone."
        confirmText="Delete"
        isPending={deleteMut.isPending}
      />
    </div>
  )
}
