import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  isCurrentUserAdmin,
  signInAdmin,
  signOutAdmin,
} from './lib/auth'
import { supabase } from './lib/supabase'

const emptyVendor = {
  name: '',
  whatsapp: '',
  telegram: '',
  status: 'active',
  featured: false,
}

const emptyModel = {
  vendor_id: '',
  name: '',
  slug: '',
  city: '',
  category: '',
  detail: '',
  biography: '',
  details: '',
  status: 'active',
  featured: false,
}

function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [status, setStatus] = useState('checking')
  const [errorMessage, setErrorMessage] = useState('')

  const [vendors, setVendors] = useState([])
  const [vendorForm, setVendorForm] = useState(emptyVendor)
  const [editingVendorId, setEditingVendorId] = useState(null)
  const [vendorLoading, setVendorLoading] = useState(false)
  const [vendorMessage, setVendorMessage] = useState('')

  const [models, setModels] = useState([])
  const [modelForm, setModelForm] = useState(emptyModel)
  const [editingModelId, setEditingModelId] = useState(null)
  const [modelLoading, setModelLoading] = useState(false)
  const [modelMessage, setModelMessage] = useState('')
  const [primaryImageFile, setPrimaryImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [imageLoading, setImageLoading] = useState(false)
  const [imageMessage, setImageMessage] = useState('')

  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          setStatus('login')
          return
        }

        const admin = await isCurrentUserAdmin()

        if (!admin) {
          setStatus('denied')
          return
        }

        setUser(currentUser)
        setIsAdmin(true)
        setStatus('authenticated')
      } catch (error) {
        console.error('Aurory admin session check failed:', error)
        setStatus('login')
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    loadVendors()
    loadModels()
  }, [status])

  async function handleLogin(event) {
    event.preventDefault()

    try {
      setErrorMessage('')
      setStatus('checking')

      const signedInUser = await signInAdmin(email, password)
      const admin = await isCurrentUserAdmin()

      if (!admin) {
        await signOutAdmin()
        setStatus('denied')
        return
      }

      setUser(signedInUser)
      setIsAdmin(true)
      setStatus('authenticated')
      setPassword('')
    } catch (error) {
      console.error('Aurory admin login failed:', error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to sign in.',
      )

      setStatus('login')
    }
  }

  async function handleSignOut() {
    await signOutAdmin()

    setUser(null)
    setIsAdmin(false)
    setVendors([])
    setModels([])
    setStatus('login')
  }

  async function loadVendors() {
    try {
      setVendorLoading(true)
      setVendorMessage('')

      const { data, error } = await supabase
        .from('vendors')
        .select(`
          id,
          name,
          whatsapp,
          telegram,
          status,
          featured,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      setVendors(data ?? [])
    } catch (error) {
      console.error('Aurory vendor loading failed:', error)

      setVendorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load vendors.',
      )
    } finally {
      setVendorLoading(false)
    }
  }

  function updateVendorField(field, value) {
    setVendorForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetVendorForm() {
    setVendorForm(emptyVendor)
    setEditingVendorId(null)
  }

  function startEditingVendor(vendor) {
    setEditingVendorId(vendor.id)

    setVendorForm({
      name: vendor.name ?? '',
      whatsapp: vendor.whatsapp ?? '',
      telegram: vendor.telegram ?? '',
      status: vendor.status ?? 'active',
      featured: Boolean(vendor.featured),
    })

    setVendorMessage('')
  }

  async function handleVendorSubmit(event) {
    event.preventDefault()

    if (!vendorForm.name.trim()) {
      setVendorMessage('Vendor name is required.')
      return
    }

    try {
      setVendorLoading(true)
      setVendorMessage('')

      const payload = {
        name: vendorForm.name.trim(),
        whatsapp: vendorForm.whatsapp.trim(),
        telegram: vendorForm.telegram.trim(),
        status: vendorForm.status,
        featured: vendorForm.featured,
      }

      let error

      if (editingVendorId) {
        const result = await supabase
          .from('vendors')
          .update(payload)
          .eq('id', editingVendorId)

        error = result.error
      } else {
        const result = await supabase
          .from('vendors')
          .insert(payload)

        error = result.error
      }

      if (error) {
        throw new Error(error.message)
      }

      resetVendorForm()

      setVendorMessage(
        editingVendorId
          ? 'Vendor updated successfully.'
          : 'Vendor added successfully.',
      )

      await loadVendors()
    } catch (error) {
      console.error('Aurory vendor save failed:', error)

      setVendorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save vendor.',
      )
    } finally {
      setVendorLoading(false)
    }
  }

  async function toggleVendorStatus(vendor) {
    const nextStatus =
      vendor.status === 'active'
        ? 'inactive'
        : 'active'

    try {
      setVendorLoading(true)
      setVendorMessage('')

      const { error } = await supabase
        .from('vendors')
        .update({
          status: nextStatus,
        })
        .eq('id', vendor.id)

      if (error) {
        throw new Error(error.message)
      }

      await loadVendors()

      setVendorMessage(
        `${vendor.name} is now ${nextStatus}.`,
      )
    } catch (error) {
      console.error('Aurory vendor status update failed:', error)

      setVendorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update vendor status.',
      )
    } finally {
      setVendorLoading(false)
    }
  }

  async function loadModels() {
    try {
      setModelLoading(true)
      setModelMessage('')

      const { data, error } = await supabase
        .from('models')
        .select(`
          id,
          vendor_id,
          name,
          slug,
          city,
          category,
          detail,
          biography,
          details,
          image_url,
          status,
          featured,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      setModels(data ?? [])
    } catch (error) {
      console.error('Aurory model loading failed:', error)

      setModelMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load models.',
      )
    } finally {
      setModelLoading(false)
    }
  }

  function updateModelField(field, value) {
    setModelForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function resetModelForm() {
    setModelForm(emptyModel)
    setEditingModelId(null)
    setPrimaryImageFile(null)
    setGalleryFiles([])
    setGalleryImages([])
    setImageMessage('')
  }

  function startEditingModel(model) {
    setEditingModelId(model.id)

    setModelForm({
      vendor_id: model.vendor_id ?? '',
      name: model.name ?? '',
      slug: model.slug ?? '',
      city: model.city ?? '',
      category: model.category ?? '',
      detail: model.detail ?? '',
      biography: model.biography ?? '',
      details: Array.isArray(model.details)
        ? model.details.join(', ')
        : '',
      status: model.status ?? 'active',
      featured: Boolean(model.featured),
    })

    setModelMessage('')
  }

  function getStoragePathFromPublicUrl(url) {
    if (!url) return null
    const marker = '/storage/v1/object/public/model-images/'
    const index = url.indexOf(marker)
    return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length))
  }

  function createStoragePath(modelId, type, fileName) {
    const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image'
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    return `models/${modelId}/${type}-${uniqueId}-${safeName}`
  }

  async function loadGalleryImages(modelId) {
    if (!modelId) return setGalleryImages([])
    const { data, error } = await supabase.from('model_images').select('id, model_id, image_url, sort_order').eq('model_id', modelId).order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    setGalleryImages(data ?? [])
  }

  async function uploadImageFile(modelId, file, type) {
    const path = createStoragePath(modelId, type, file.name)
    const { error } = await supabase.storage.from('model-images').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('model-images').getPublicUrl(path)
    if (!data?.publicUrl) throw new Error('Unable to create public image URL.')
    return { path, publicUrl: data.publicUrl }
  }

  async function handlePrimaryImageUpload() {
    if (!editingModelId) return setImageMessage('Save the model first, then upload images.')
    if (!primaryImageFile) return setImageMessage('Please select a primary image.')
    try {
      setImageLoading(true); setImageMessage('Uploading primary image...')
      const current = models.find((model) => model.id === editingModelId)
      const uploaded = await uploadImageFile(editingModelId, primaryImageFile, 'primary')
      const { error } = await supabase.from('models').update({ image_url: uploaded.publicUrl }).eq('id', editingModelId)
      if (error) { await supabase.storage.from('model-images').remove([uploaded.path]); throw new Error(error.message) }
      const oldPath = getStoragePathFromPublicUrl(current?.image_url)
      if (oldPath && oldPath !== uploaded.path) await supabase.storage.from('model-images').remove([oldPath])
      setPrimaryImageFile(null); await loadModels(); setImageMessage('Primary image uploaded successfully.')
    } catch (error) { console.error('Aurory primary image upload failed:', error); setImageMessage(error instanceof Error ? error.message : 'Unable to upload primary image.') }
    finally { setImageLoading(false) }
  }

  async function handleGalleryUpload() {
    if (!editingModelId) return setImageMessage('Save the model first, then upload images.')
    if (!galleryFiles.length) return setImageMessage('Please select one or more gallery images.')
    try {
      setImageLoading(true); setImageMessage('Uploading gallery images...')
      const { data, error } = await supabase.from('model_images').select('sort_order').eq('model_id', editingModelId).order('sort_order', { ascending: false }).limit(1)
      if (error) throw new Error(error.message)
      let next = data?.[0]?.sort_order != null ? data[0].sort_order + 1 : 0
      for (const file of galleryFiles) {
        const uploaded = await uploadImageFile(editingModelId, file, 'gallery')
        const result = await supabase.from('model_images').insert({ model_id: editingModelId, image_url: uploaded.publicUrl, sort_order: next++ })
        if (result.error) { await supabase.storage.from('model-images').remove([uploaded.path]); throw new Error(result.error.message) }
      }
      setGalleryFiles([]); await loadGalleryImages(editingModelId); setImageMessage('Gallery images uploaded successfully.')
    } catch (error) { console.error('Aurory gallery upload failed:', error); setImageMessage(error instanceof Error ? error.message : 'Unable to upload gallery images.') }
    finally { setImageLoading(false) }
  }

  async function handleDeleteGalleryImage(image) {
    if (!image?.id || !window.confirm('Delete this gallery image?')) return
    try {
      setImageLoading(true); setImageMessage('Deleting gallery image...')
      const { error } = await supabase.from('model_images').delete().eq('id', image.id)
      if (error) throw new Error(error.message)
      const path = getStoragePathFromPublicUrl(image.image_url)
      if (path) await supabase.storage.from('model-images').remove([path])
      await loadGalleryImages(editingModelId); setImageMessage('Gallery image deleted successfully.')
    } catch (error) { console.error('Aurory gallery deletion failed:', error); setImageMessage(error instanceof Error ? error.message : 'Unable to delete gallery image.') }
    finally { setImageLoading(false) }
  }

  async function handleModelSubmit(event) {
    event.preventDefault()

    if (!modelForm.vendor_id) {
      setModelMessage('Please select a vendor.')
      return
    }

    if (!modelForm.name.trim()) {
      setModelMessage('Model name is required.')
      return
    }

    if (!modelForm.slug.trim()) {
      setModelMessage('Model slug is required.')
      return
    }

    if (!modelForm.city.trim()) {
      setModelMessage('City is required.')
      return
    }

    if (!modelForm.category.trim()) {
      setModelMessage('Category is required.')
      return
    }

    try {
      setModelLoading(true)
      setModelMessage('')

      const details = modelForm.details
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      const payload = {
        vendor_id: modelForm.vendor_id,
        name: modelForm.name.trim(),
        slug: modelForm.slug.trim().toLowerCase(),
        city: modelForm.city.trim(),
        category: modelForm.category.trim(),
        detail: modelForm.detail.trim(),
        biography: modelForm.biography.trim(),
        details,
        status: modelForm.status,
        featured: modelForm.featured,
      }

      let error
      let savedModelId = editingModelId

      if (editingModelId) {
        const result = await supabase
          .from('models')
          .update(payload)
          .eq('id', editingModelId)
        error = result.error
      } else {
        const result = await supabase
          .from('models')
          .insert(payload)
          .select('id')
          .single()
        error = result.error
        savedModelId = result.data?.id ?? null
      }

      if (error) throw new Error(error.message)

      await loadModels()
      setEditingModelId(savedModelId)
      setModelMessage(editingModelId ? 'Model updated successfully.' : 'Model added successfully. You can now upload images.')
      await loadGalleryImages(savedModelId)
    } catch (error) {
      console.error('Aurory model save failed:', error)

      setModelMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save model.',
      )
    } finally {
      setModelLoading(false)
    }
  }

  async function toggleModelStatus(model) {
    const nextStatus =
      model.status === 'active'
        ? 'inactive'
        : 'active'

    try {
      setModelLoading(true)
      setModelMessage('')

      const { error } = await supabase
        .from('models')
        .update({
          status: nextStatus,
        })
        .eq('id', model.id)

      if (error) {
        throw new Error(error.message)
      }

      await loadModels()

      setModelMessage(
        `${model.name} is now ${nextStatus}.`,
      )
    } catch (error) {
      console.error('Aurory model status update failed:', error)

      setModelMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update model status.',
      )
    } finally {
      setModelLoading(false)
    }
  }

  if (status === 'checking') {
    return (
      <main>
        <p>Checking admin access...</p>
      </main>
    )
  }

  if (status === 'denied') {
    return (
      <main>
        <h1>Access denied</h1>
        <p>This account does not have Aurory admin access.</p>
      </main>
    )
  }

  if (status === 'login') {
    return (
      <main>
        <section>
          <p>Admin</p>

          <h1>Sign in to Aurory</h1>

          <form onSubmit={handleLogin}>
            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {errorMessage && <p>{errorMessage}</p>}

            <button type="submit">
              Sign in
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section>
        <p>Admin dashboard</p>

        <h1>Welcome to Aurory</h1>

        <p>
          Signed in as {user?.email}
        </p>

        {isAdmin && (
          <p>Admin access confirmed.</p>
        )}

        <button
          type="button"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </section>

      <section>
        <p>Vendor management</p>

        <h2>
          {editingVendorId
            ? 'Edit vendor'
            : 'Add vendor'}
        </h2>

        <form onSubmit={handleVendorSubmit}>
          <label>
            Vendor name

            <input
              type="text"
              value={vendorForm.name}
              onChange={(event) =>
                updateVendorField(
                  'name',
                  event.target.value,
                )
              }
              placeholder="Vendor or agency name"
              required
            />
          </label>

          <label>
            WhatsApp

            <input
              type="url"
              value={vendorForm.whatsapp}
              onChange={(event) =>
                updateVendorField(
                  'whatsapp',
                  event.target.value,
                )
              }
              placeholder="https://wa.me/..."
            />
          </label>

          <label>
            Telegram

            <input
              type="url"
              value={vendorForm.telegram}
              onChange={(event) =>
                updateVendorField(
                  'telegram',
                  event.target.value,
                )
              }
              placeholder="https://t.me/..."
            />
          </label>

          <label>
            Status

            <select
              value={vendorForm.status}
              onChange={(event) =>
                updateVendorField(
                  'status',
                  event.target.value,
                )
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              checked={vendorForm.featured}
              onChange={(event) =>
                updateVendorField(
                  'featured',
                  event.target.checked,
                )
              }
            />

            Featured vendor
          </label>

          <div>
            <button
              type="submit"
              disabled={vendorLoading}
            >
              {editingVendorId
                ? 'Update vendor'
                : 'Add vendor'}
            </button>

            {editingVendorId && (
              <button
                type="button"
                onClick={resetVendorForm}
                disabled={vendorLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {vendorMessage && (
          <p>{vendorMessage}</p>
        )}
      </section>

      <section>
        <p>Existing vendors</p>

        {vendorLoading && (
          <p>Loading vendors...</p>
        )}

        {!vendorLoading &&
          vendors.length === 0 && (
            <p>No vendors found.</p>
          )}

        {!vendorLoading &&
          vendors.length > 0 && (
            <div>
              {vendors.map((vendor) => (
                <article key={vendor.id}>
                  <h3>{vendor.name}</h3>

                  <p>
                    Status: {vendor.status}
                  </p>

                  <p>
                    WhatsApp:{' '}
                    {vendor.whatsapp || 'Not set'}
                  </p>

                  <p>
                    Telegram:{' '}
                    {vendor.telegram || 'Not set'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      startEditingVendor(vendor)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleVendorStatus(vendor)
                    }
                    disabled={vendorLoading}
                  >
                    {vendor.status === 'active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </article>
              ))}
            </div>
          )}
      </section>

      <section>
        <p>Model management</p>

        <h2>
          {editingModelId
            ? 'Edit model'
            : 'Add model'}
        </h2>

        <form onSubmit={handleModelSubmit}>
          <label>
            Vendor

            <select
              value={modelForm.vendor_id}
              onChange={(event) =>
                updateModelField(
                  'vendor_id',
                  event.target.value,
                )
              }
              required
            >
              <option value="">
                Select vendor
              </option>

              {vendors
                .filter(
                  (vendor) =>
                    vendor.status === 'active',
                )
                .map((vendor) => (
                  <option
                    key={vendor.id}
                    value={vendor.id}
                  >
                    {vendor.name}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Model name

            <input
              type="text"
              value={modelForm.name}
              onChange={(event) =>
                updateModelField(
                  'name',
                  event.target.value,
                )
              }
              placeholder="Model name"
              required
            />
          </label>

          <label>
            Slug

            <input
              type="text"
              value={modelForm.slug}
              onChange={(event) =>
                updateModelField(
                  'slug',
                  event.target.value
                    .toLowerCase()
                    .replace(/\s+/g, '-'),
                )
              }
              placeholder="model-name"
              required
            />

            <small>
              Used in the public URL:
              {' '}
              /models/model-name
            </small>
          </label>

          <label>
            City

            <input
              type="text"
              value={modelForm.city}
              onChange={(event) =>
                updateModelField(
                  'city',
                  event.target.value,
                )
              }
              placeholder="Mumbai"
              required
            />
          </label>

          <label>
            Category

            <input
              type="text"
              value={modelForm.category}
              onChange={(event) =>
                updateModelField(
                  'category',
                  event.target.value,
                )
              }
              placeholder="Editorial Bikini"
              required
            />
          </label>

          <label>
            Short detail

            <input
              type="text"
              value={modelForm.detail}
              onChange={(event) =>
                updateModelField(
                  'detail',
                  event.target.value,
                )
              }
              placeholder="Editorial and resort campaigns"
            />
          </label>

          <label>
            Biography

            <textarea
              value={modelForm.biography}
              onChange={(event) =>
                updateModelField(
                  'biography',
                  event.target.value,
                )
              }
              rows="5"
              placeholder="Professional biography"
            />
          </label>

          <label>
            Professional details

            <input
              type="text"
              value={modelForm.details}
              onChange={(event) =>
                updateModelField(
                  'details',
                  event.target.value,
                )
              }
              placeholder="Editorial, Swimwear, Lifestyle"
            />

            <small>
              Separate multiple details with commas.
            </small>
          </label>

          <label>
            Status

            <select
              value={modelForm.status}
              onChange={(event) =>
                updateModelField(
                  'status',
                  event.target.value,
                )
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              checked={modelForm.featured}
              onChange={(event) =>
                updateModelField(
                  'featured',
                  event.target.checked,
                )
              }
            />

            Featured model
          </label>

          <div>
            <button
              type="submit"
              disabled={modelLoading}
            >
              {editingModelId
                ? 'Update model'
                : 'Add model'}
            </button>

            {editingModelId && (
              <button
                type="button"
                onClick={resetModelForm}
                disabled={modelLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {editingModelId && (
          <section>
            <p>Image management</p>
            <h3>Primary image</h3>
            {models.find((model) => model.id === editingModelId)?.image_url && (
              <img src={models.find((model) => model.id === editingModelId)?.image_url} alt="Primary" style={{ width: '220px', maxWidth: '100%', display: 'block', marginBottom: '12px' }} />
            )}
            <input type="file" accept="image/*" onChange={(event) => setPrimaryImageFile(event.target.files?.[0] ?? null)} disabled={imageLoading} />
            <button type="button" onClick={handlePrimaryImageUpload} disabled={imageLoading || !primaryImageFile}>Upload primary image</button>

            <h3>Gallery</h3>
            <input type="file" accept="image/*" multiple onChange={(event) => setGalleryFiles(Array.from(event.target.files ?? []))} disabled={imageLoading} />
            {galleryFiles.length > 0 && <p>{galleryFiles.length} new image{galleryFiles.length === 1 ? '' : 's'} selected.</p>}
            <button type="button" onClick={handleGalleryUpload} disabled={imageLoading || !galleryFiles.length}>Upload gallery images</button>

            {galleryImages.length > 0 && (
              <div>
                <h4>Current gallery</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                  {galleryImages.map((image) => (
                    <article key={image.id}>
                      <img src={image.image_url} alt="Gallery" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
                      <button type="button" onClick={() => handleDeleteGalleryImage(image)} disabled={imageLoading}>Delete</button>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {imageMessage && <p>{imageMessage}</p>}
          </section>
        )}

        {modelMessage && (
          <p>{modelMessage}</p>
        )}
      </section>

      <section>
        <p>Existing models</p>

        {modelLoading && (
          <p>Loading models...</p>
        )}

        {!modelLoading &&
          models.length === 0 && (
            <p>No models found.</p>
          )}

        {!modelLoading &&
          models.length > 0 && (
            <div>
              {models.map((model) => {
                const vendor = vendors.find(
                  (item) =>
                    item.id === model.vendor_id,
                )

                return (
                  <article key={model.id}>
                    <h3>{model.name}</h3>

                    <p>
                      Vendor:{' '}
                      {vendor?.name ||
                        'Unknown vendor'}
                    </p>

                    <p>
                      URL: /models/{model.slug}
                    </p>

                    <p>
                      {model.city} / {model.category}
                    </p>

                    <p>
                      Status: {model.status}
                    </p>

                    <p>
                      Featured:{' '}
                      {model.featured
                        ? 'Yes'
                        : 'No'}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        startEditingModel(model)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleModelStatus(model)
                      }
                      disabled={modelLoading}
                    >
                      {model.status === 'active'
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>
                  </article>
                )
              })}
            </div>
          )}
      </section>
    </main>
  )
}

export default Admin