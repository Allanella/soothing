'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PRODUCT_CATEGORIES,
  catalogProducts,
  formatPrice,
  galleryImageOptions,
  normalizeProductRow,
  type CatalogProduct,
} from '@/lib/catalog'

export default function AdminDashboard() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [form, setForm] = useState({
    title: '',
    category: 'Seating',
    price: '',
    description: '',
    imageUrl: galleryImageOptions[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usingLocal, setUsingLocal] = useState(false)
  const router = useRouter()

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setProducts(data.map((row: Record<string, unknown>) => normalizeProductRow(row)))
        setUsingLocal(false)
        return
      }
    } catch {
      // fall through to local catalog
    }
    setProducts(catalogProducts)
    setUsingLocal(true)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        imageUrl: form.imageUrl,
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setForm({
          title: '',
          category: 'Seating',
          price: '',
          description: '',
          imageUrl: galleryImageOptions[0],
        })
        await fetchProducts()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not save to database. Showing local catalog instead.')
        // Optimistic local preview when DB is unavailable
        setProducts((prev) => [
          {
            id: `local-${Date.now()}`,
            title: payload.title,
            category: payload.category,
            price: payload.price,
            currency: 'UGX',
            description: payload.description,
            image: payload.imageUrl,
          },
          ...prev,
        ])
        setUsingLocal(true)
      }
    } catch (err) {
      console.error('Failed to save product', err)
      setError('Could not reach the products API. Check database settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    if (String(id).startsWith('local-') || String(id).startsWith('p')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      return
    }
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  const handleLogout = async () => {
    document.cookie = 'admin_token=; Max-Age=0; path=/;'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#f2ede2] text-[#181b1e] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-[#e5dec9] pb-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">Director Dashboard</h1>
            <p className="text-sm text-gray-600">Manage Soothing Interiors Product Inventory & Pricing</p>
          </div>
          <div className="flex gap-4">
            <Link href="/products" className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
              View Products Page
            </Link>
            <Link href="/" className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
              View Website
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
              Sign Out
            </button>
          </div>
        </div>

        {usingLocal && (
          <p className="mb-6 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded px-4 py-3">
            Showing the built-in catalog (database unavailable or empty). Add DB credentials in `.env` to persist inventory.
          </p>
        )}
        {error && (
          <p className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3">{error}</p>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md border border-[#e5dec9] mb-12">
          <h2 className="text-xl font-serif font-semibold mb-4">Add New Product & Price</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="p-3 border rounded"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-3 border rounded bg-white"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              step="1000"
              placeholder="Price (UGX)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="p-3 border rounded"
            />
            <select
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              required
              className="p-3 border rounded bg-white"
            >
              {galleryImageOptions.map((img) => (
                <option key={img} value={img}>{img}</option>
              ))}
            </select>

            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Pick image from gallery</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-1">
                {galleryImageOptions.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: img })}
                    className={`relative aspect-square overflow-hidden rounded border-2 ${form.imageUrl === img ? 'border-[#181b1e]' : 'border-transparent'}`}
                    title={img}
                  >
                    <img src={`/${img}`} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Short Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="md:col-span-2 p-3 border rounded"
              rows={2}
            />
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 py-3 bg-[#181b1e] text-[#f2ede2] font-medium rounded hover:bg-black transition cursor-pointer"
            >
              {loading ? 'Saving...' : 'Add Product to Inventory'}
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-serif font-semibold mb-4">Current Inventory & Pricing</h2>
        <div className="bg-white rounded-xl shadow border border-[#e5dec9] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No products added yet. Use the form above to add your first item.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={`/${p.image}`}
                        alt={p.title}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                      />
                    </td>
                    <td className="p-4 font-medium">{p.title}</td>
                    <td className="p-4 text-sm text-gray-600">{p.category}</td>
                    <td className="p-4 font-semibold">{formatPrice(p.price, p.currency)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
