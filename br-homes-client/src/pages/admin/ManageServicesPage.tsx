import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { useServices, useCreateService, useUpdateService, useToggleServiceActive, useDeleteService } from '@/hooks/useServices'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Trash, Pencil, Eye, EyeOff, Loader2, Plus, Wrench, X, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/components/common/ConfirmationModal'

export default function ManageServicesPage() {
  // Queries & Mutations
  const { data: catData, isLoading: isLoadingCats } = useCategories(true)
  const { data: servData, isLoading: isLoadingServs } = useServices(undefined, true)
  
  const createMut = useCreateService()
  const updateMut = useUpdateService()
  const toggleMut = useToggleServiceActive()
  const deleteMut = useDeleteService()

  // State
  const [editingService, setEditingService] = useState<any | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const categories = catData?.data || []
  const services = servData?.data || []

  // Handle Edit click
  const handleEditClick = (service: any) => {
    setEditingService(service)
    setTitle(service.title)
    setDescription(service.description)
    setContactPhone(service.contactPhone)
    setCategoryId(service.categoryId?._id || service.categoryId || '')
  }

  // Reset form
  const resetForm = () => {
    setEditingService(null)
    setTitle('')
    setDescription('')
    setContactPhone('')
    setCategoryId('')
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !contactPhone.trim() || !categoryId) {
      toast.error('All fields are required')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      contactPhone: contactPhone.trim(),
      categoryId,
    }

    if (editingService) {
      updateMut.mutate(
        { id: editingService._id, payload },
        {
          onSuccess: () => {
            resetForm()
          },
        }
      )
    } else {
      createMut.mutate(payload, {
        onSuccess: () => {
          resetForm()
        },
      })
    }
  }

  if (isLoadingCats || isLoadingServs) return <LoadingSkeleton count={4} type="row" />

  const isPending = createMut.isPending || updateMut.isPending

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Services</h1>
          <p className="text-sm text-slate-500">Create, edit, toggle visibility, and delete services under categories.</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 text-center bg-amber-50 rounded-xl border border-amber-200 max-w-2xl mx-auto">
          <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
          <h3 className="text-lg font-bold text-amber-950 mb-1">No Categories Configured</h3>
          <p className="text-sm text-amber-700 mb-4">
            You must create at least one category before you can add services.
          </p>
          <Link to="/admin/categories">
            <Button className="bg-amber-900 hover:bg-amber-800 text-white">
              Go to Manage Categories <Plus className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Add/Edit Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingService ? 'Edit Service' : 'Create Service'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Instant Home Loan Approvals"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  disabled={isPending}
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Contact Phone (for Calls)
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  disabled={isPending}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the service..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  disabled={isPending}
                />
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
                  ) : editingService ? (
                    'Update Service'
                  ) : (
                    'Create Service'
                  )}
                </Button>

                {editingService && (
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
              <h2 className="font-bold text-slate-900">Existing Services ({services.length})</h2>
            </div>

            {services.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Wrench className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No services found</p>
                <p className="text-sm text-slate-400">Create a service on the left to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 text-sm font-semibold border-b">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 text-sm">
                    {services.map((service: any) => (
                      <tr key={service._id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-semibold text-slate-900">
                          <div>
                            <p className="font-bold">{service.title}</p>
                            <p className="text-xs text-slate-500 font-normal line-clamp-1">{service.description}</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">
                          {service.categoryId?.title || 'Unknown Category'}
                        </td>
                        <td className="p-4 font-mono text-slate-600">{service.contactPhone}</td>
                        <td className="p-4">
                          <span 
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              service.isActive 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              title={service.isActive ? 'Hide' : 'Show'}
                              onClick={() => toggleMut.mutate(service._id)}
                              disabled={toggleMut.isPending}
                              className={`p-1.5 rounded-md hover:bg-slate-100 transition ${
                                service.isActive ? 'text-slate-600' : 'text-slate-400'
                              }`}
                            >
                              {toggleMut.isPending && toggleMut.variables === service._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : service.isActive ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              title="Edit"
                              onClick={() => handleEditClick(service)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              title="Delete"
                              onClick={() => setDeleteId(service._id)}
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
      )}

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
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        isPending={deleteMut.isPending}
      />
    </div>
  )
}
