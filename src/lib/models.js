import { supabase } from './supabase'

export async function getActiveModels() {
  const { data, error } = await supabase
    .from('models')
    .select(`
      id,
      name,
      slug,
      city,
      category,
      detail,
      biography,
      details,
      image_url,
      featured,
      vendor_id,
      vendors (
        id,
        name,
        whatsapp,
        telegram,
        status
      ),
      model_images (
        id,
        image_url,
        sort_order
      )
    `)
    .eq('status', 'active')
    .eq('vendors.status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Unable to load models: ${error.message}`)
  }

  return (data ?? []).map((model) => ({
    id: model.id,
    name: model.name,
    slug: model.slug,
    city: model.city,
    category: model.category,
    detail: model.detail ?? '',
    biography: model.biography ?? '',
    details: model.details ?? [],
    image: model.image_url ?? '',
    featured: model.featured,
    vendorId: model.vendor_id,

    vendorContact: {
      whatsapp: model.vendors?.whatsapp ?? '',
      telegram: model.vendors?.telegram ?? '',
    },

    gallery: [...(model.model_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.image_url),
  }))
}

export async function getActiveModelBySlug(slug) {
  const { data, error } = await supabase
    .from('models')
    .select(`
      id,
      name,
      slug,
      city,
      category,
      detail,
      biography,
      details,
      image_url,
      featured,
      vendor_id,
      vendors (
        id,
        name,
        whatsapp,
        telegram,
        status
      ),
      model_images (
        id,
        image_url,
        sort_order
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .eq('vendors.status', 'active')
    .maybeSingle()

  if (error) {
    throw new Error(`Unable to load model: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    city: data.city,
    category: data.category,
    detail: data.detail ?? '',
    biography: data.biography ?? '',
    details: data.details ?? [],
    image: data.image_url ?? '',
    featured: data.featured,
    vendorId: data.vendor_id,

    vendorContact: {
      whatsapp: data.vendors?.whatsapp ?? '',
      telegram: data.vendors?.telegram ?? '',
    },

    gallery: [...(data.model_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.image_url),
  }
}