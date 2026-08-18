import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { invalidateArtworksCache } from './useArtworksCatalog';

/**
 * Shared upload/edit logic for admin Gallery and Shop tabs.
 * @param {{ session: object, mode: 'gallery' | 'shop', onSuccess?: () => void }} options
 */
export function useArtworkUpload({ session, mode, onSuccess }) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadType, setUploadType] = useState('gallery');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const subCategoryOverrideRef = useRef(null);
  const preserveRef = useRef(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDesc('');
    setCategory('');
    setSubCategory('');
    setFile(null);
    setPreviewUrl(null);
    setUploadType('gallery');
    setPrice('');
    setOriginalPrice('');
    setStock('');
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNew(false);
    preserveRef.current = null;
    subCategoryOverrideRef.current = null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (preserveRef.current) preserveRef.current.image_url = null;
  };

  const loadForEdit = (art) => {
    setEditingId(art.id);
    setTitle(art.title || '');

    let cleanDesc = art.description || '';
    let extractedSub = '';
    const subMatch = cleanDesc.match(/\[SubCategory:\s*(.*?)\]/);
    if (subMatch) {
      extractedSub = subMatch[1];
      cleanDesc = cleanDesc.replace(/\[SubCategory:.*?\]/g, '').trim();
    }

    const isFeaturedItem = cleanDesc.includes('[FEATURED]');
    const isBestsellerItem = cleanDesc.includes('[BESTSELLER]');
    const isNewItem = /\[NEW\]/.test(cleanDesc);
    cleanDesc = cleanDesc
      .replace(/\[FEATURED\]/g, '')
      .replace(/\[BESTSELLER\]/g, '')
      .replace(/\[NEW\]/g, '')
      .trim();

    setDesc(cleanDesc);
    setPrice(art.price ?? '');
    setOriginalPrice(art.original_price ?? '');
    setStock(art.stock ?? '');
    setIsFeatured(art.is_featured || isFeaturedItem);
    setIsBestseller(art.is_bestseller || isBestsellerItem);
    setIsNew(art.is_new || isNewItem);

    preserveRef.current = {
      price: art.price ?? null,
      original_price: art.original_price ?? null,
      stock: art.stock ?? null,
      is_bestseller: art.is_bestseller || false,
      is_new: art.is_new || false,
      image_url: art.image_url,
    };

    if (mode === 'shop') {
      setUploadType('gallery');
      setCategory(art.category === 'Upcoming' ? '' : (art.category || ''));
      setSubCategory(extractedSub || art.sub_category || '');
    } else if (art.category === 'Upcoming') {
      setUploadType('upcoming');
      setCategory('');
      setSubCategory('');
    } else if (art.is_featured || isFeaturedItem) {
      setUploadType('featured');
      setCategory(art.category === 'Featured' ? '' : (art.category || ''));
      setSubCategory(extractedSub || art.sub_category || '');
    } else {
      setUploadType('gallery');
      setCategory(art.category || '');
      setSubCategory(extractedSub || art.sub_category || '');
    }

    setPreviewUrl(art.image_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!session) return;
    if (!file && !editingId) return;

    if (mode === 'shop' && !price) {
      alert('Please set a price — shop items need a sale price.');
      return;
    }

    let finalImageUrl = null;
    try {
      setUploading(true);

      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File size must be less than 10MB');
        }
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('artworks').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('artworks').getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      } else if (editingId) {
        finalImageUrl = preserveRef.current?.image_url;
      }

      let finalDescription = desc
        .replace(/\[FEATURED\]/g, '')
        .replace(/\[BESTSELLER\]/g, '')
        .replace(/\[NEW\]/g, '')
        .trim();
      let finalCategory = category;

      const showFeatured = mode === 'shop' ? isFeatured : uploadType === 'featured' || isFeatured;

      if (mode === 'shop') {
        if (!category) throw new Error('Please pick a category for this shop item.');
        finalCategory = category;
        if (subCategory) finalDescription += `\n\n[SubCategory: ${subCategory}]`;
      } else if (uploadType === 'upcoming') {
        finalCategory = 'Upcoming';
      } else if (uploadType === 'featured') {
        if (!category) throw new Error('Please pick a category for this piece.');
        finalCategory = category;
        if (subCategory) finalDescription += `\n\n[SubCategory: ${subCategory}]`;
      } else {
        if (!category) throw new Error('Please pick a category for this piece.');
        finalCategory = category;
        if (subCategory) finalDescription += `\n\n[SubCategory: ${subCategory}]`;
      }

      if (showFeatured) finalDescription = `[FEATURED] ${finalDescription}`.trim();
      if (isBestseller) finalDescription = `[BESTSELLER] ${finalDescription}`.trim();
      if (isNew) finalDescription = `[NEW] ${finalDescription}`.trim();

      const marketplaceFields =
        mode === 'gallery' && editingId && preserveRef.current
          ? {
              price: preserveRef.current.price,
              original_price: preserveRef.current.original_price,
              stock: preserveRef.current.stock,
              is_featured: uploadType === 'featured' || isFeatured,
              is_bestseller: preserveRef.current.is_bestseller,
              is_new: preserveRef.current.is_new,
              sub_category: subCategory || null,
            }
          : {
              price: price ? Number(price) : null,
              original_price: originalPrice ? Number(originalPrice) : null,
              is_featured: mode === 'shop' ? isFeatured : uploadType === 'featured' || isFeatured,
              is_bestseller: isBestseller,
              is_new: isNew,
              sub_category: subCategory || null,
              stock: stock === '' ? null : Number(stock),
            };

      const payload = {
        title,
        description: finalDescription,
        category: finalCategory,
        image_url: finalImageUrl,
        listing_type: mode === 'shop' ? 'shop' : 'gallery',
        ...marketplaceFields,
      };

      const res = await fetch('/api/manage-art', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : { ...payload, user_id: session.user.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save artwork');
      }

      setSuccess(true);
      invalidateArtworksCache();
      setTimeout(() => setSuccess(false), 3000);
      resetForm();
      onSuccess?.();
    } catch (error) {
      alert(error.message);
      if (file && finalImageUrl) {
        const fileName = finalImageUrl.split('/').pop();
        supabase.storage.from('artworks').remove([fileName]).catch(console.error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item permanently?')) return;
    try {
      const res = await fetch('/api/manage-art', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      if (editingId === id) resetForm();
      onSuccess?.();
    } catch (err) {
      alert(err.message);
    }
  };

  return {
    editingId,
    title,
    setTitle,
    desc,
    setDesc,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    subCategoryOverrideRef,
    file,
    previewUrl,
    uploadType,
    setUploadType,
    price,
    setPrice,
    originalPrice,
    setOriginalPrice,
    stock,
    setStock,
    isFeatured,
    setIsFeatured,
    isBestseller,
    setIsBestseller,
    isNew,
    setIsNew,
    uploading,
    success,
    resetForm,
    handleFileChange,
    clearImage,
    loadForEdit,
    handleUpload,
    handleDelete,
  };
}
