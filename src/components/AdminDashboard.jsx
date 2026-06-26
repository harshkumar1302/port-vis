import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Default Categories Data - Used for initial setup if DB is empty
const DEFAULT_CATEGORIES = [
    { id: 'mandala', label: 'Mandala Art', subCategories: ['Flower Mandala', 'Creative Mandala', 'Wall Mandala', 'Arc Mini Mandalas'] },
    { id: 'miniature', label: 'Miniatures', subCategories: ['Miniatures', 'Clay Sets'] },
    { id: 'gift', label: 'Gift Material', subCategories: ['Vintage Frame', 'Fridge Magnet', 'Key Chains', 'Brooch', 'Garlands', 'Gopi Dots', 'Bottle Arts', 'Tote Bags', 'Car Hanging'] },
    { id: 'diy', label: 'DIY Art', subCategories: ['Bookmarks', 'Stick Bookmarks (Clay)', 'Wooden Bookmarks', 'MDF Boards', 'Backdrops'] },
];

// Sortable Item Component
const SortableArtworkRow = ({ art, isFeatured, handleEdit, handleDelete, isOverlay }) => {
    if (!art) return null;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: art?.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-2xl transition-all border border-transparent hover:border-ghibli-wood/10 group ${isFeatured ? 'bg-ghibli-wood/5' : 'bg-white/20 hover:bg-white/40'}`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="hidden sm:flex items-center justify-center p-2 cursor-grab active:cursor-grabbing text-ghibli-wood/30 hover:text-ghibli-wood/60 touch-none"
            >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 6h8M8 12h8M8 18h8" strokeLinecap="round" />
                </svg>
            </div>

            <div className="w-full sm:w-20 h-40 sm:h-20 rounded-xl overflow-hidden bg-ghibli-paper/20 flex-shrink-0 relative">
                <img src={art.image_url} alt={art.title} className="w-full h-full object-cover" />
                {isFeatured && (
                    <div className="absolute top-1 right-1 bg-yellow-400 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm" title="Featured Item">
                        ★
                    </div>
                )}
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-ghibli-wood/10 text-[9px] font-bold text-ghibli-wood uppercase tracking-widest">{art.category}</span>
                    {art.description?.includes('[SubCategory:') && (
                        <span className="px-2 py-0.5 rounded-md bg-ghibli-paper/40 text-[9px] font-bold text-ghibli-charcoal/60 uppercase tracking-widest">
                            {art.description.match(/\[SubCategory:\s*(.*?)\]/)?.[1]}
                        </span>
                    )}
                    {isFeatured && <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest bg-yellow-100 px-2 py-0.5 rounded-md">Featured</span>}
                </div>
                <h3 className="font-bold text-ghibli-charcoal truncate">{art.title || 'Untitled'}</h3>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                {/* Mobile Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="sm:hidden p-3 text-ghibli-wood/30 active:text-ghibli-wood/60 cursor-grab active:cursor-grabbing touch-none"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 6h8M8 12h8M8 18h8" strokeLinecap="round" />
                    </svg>
                </div>

                <button
                    onClick={() => handleEdit(art)}
                    className="flex-1 sm:flex-none p-3 text-ghibli-wood/60 hover:text-ghibli-wood hover:bg-ghibli-wood/10 rounded-xl transition-all flex items-center justify-center active:scale-90 border border-transparent hover:border-ghibli-wood/10"
                    title="Edit artwork"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase ml-2 sm:hidden tracking-widest">Edit</span>
                </button>
                <button
                    onClick={() => handleDelete(art)}
                    className="flex-1 sm:flex-none p-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center active:scale-90 border border-transparent hover:border-red-500/10"
                    title="Delete artwork"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase ml-2 sm:hidden tracking-widest">Delete</span>
                </button>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [artworks, setArtworks] = useState([]);

    // Artwork form state
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const subCategoryOverrideRef = useRef(null);

    // Setup mode state
    const [loginMode, setLoginMode] = useState('login'); // 'login' or 'register'
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Site Settings State
    const [categoryDefinitions, setCategoryDefinitions] = useState([]);
    const [categoryPriorities, setCategoryPriorities] = useState({});
    const [artworkOrders, setArtworkOrders] = useState({});
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [savingCategories, setSavingCategories] = useState(false);
    const [categoriesSaveSuccess, setCategoriesSaveSuccess] = useState(false);

    // Category Manager UI State
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [newCategoryLabel, setNewCategoryLabel] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    // Collapsible Sections State
    const [collapsedSections, setCollapsedSections] = useState({});
    const [activeId, setActiveId] = useState(null);

    const toggleSection = (sectionId) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // 5px movement required for drag
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Update sub-category when main category changes
    useEffect(() => {
        if (subCategoryOverrideRef.current !== null) {
            setSubCategory(subCategoryOverrideRef.current);
            subCategoryOverrideRef.current = null;
            return;
        }

        const catDef = categoryDefinitions.find(c =>
            c.label?.trim().toLowerCase() === category?.trim().toLowerCase() ||
            c.id?.trim().toLowerCase() === category?.trim().toLowerCase()
        );
        if (catDef && catDef.subCategories?.length > 0) {
            // Only auto-set if current subCategory isn't valid for this category
            if (!catDef.subCategories.includes(subCategory)) {
                setSubCategory(catDef.subCategories[0]);
            }
        } else {
            setSubCategory('');
        }
    }, [category, categoryDefinitions]);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/me', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setSession({ user: { id: 'admin-master', email: 'owner' } });
                fetchSettings();
            } else {
                setSession(null);
            }
        } catch (err) {
            console.error('Session check failed:', err);
            setSession(null);
        }
    };

    const fetchSettings = async () => {
        try {
            const resCat = await fetch('/api/settings?id=category_definitions');
            if (resCat.ok) {
                const data = await resCat.json();
                if (data.value && Array.isArray(data.value) && data.value.length > 0) {
                    setCategoryDefinitions(data.value);
                    // Initialize category/subcategory if not set
                    setCategory(prev => {
                        if (prev && data.value.some(c => c.label === prev)) return prev;
                        return data.value[0].label;
                    });
                } else {
                    // Initialize with defaults if empty
                    setCategoryDefinitions(DEFAULT_CATEGORIES);
                    saveCategoryDefinitions(DEFAULT_CATEGORIES);
                }
            }

            const res = await fetch('/api/settings?id=category_priorities');
            if (res.ok) {
                const data = await res.json();
                setCategoryPriorities(data.value || {});
            }

            const resOrder = await fetch('/api/settings?id=artwork_orders');
            if (resOrder.ok) {
                const data = await resOrder.json();
                setArtworkOrders(data.value || {});
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        }
    };

    const saveCategoryDefinitions = async (defs) => {
        try {
            setSavingCategories(true);
            setCategoriesSaveSuccess(false);
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: 'category_definitions',
                    value: defs
                })
            });
            if (res.ok) {
                setCategoriesSaveSuccess(true);
                setTimeout(() => setCategoriesSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Failed to save category definitions:', err);
        } finally {
            setSavingCategories(false);
        }
    };

    const saveArtworkOrder = async (newOrders) => {
        try {
            await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: 'artwork_orders',
                    value: newOrders
                })
            });
        } catch (err) {
            console.error('Failed to save order:', err);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeArt = artworks.find(a => a.id === active.id);
        const overArt = artworks.find(a => a.id === over.id);

        if (!activeArt || !overArt) return;

        const category = activeArt.category === 'Featured' || activeArt.description?.includes('[FEATURED]') ? 'Featured' : activeArt.category;
        const overCategory = overArt.category === 'Featured' || overArt.description?.includes('[FEATURED]') ? 'Featured' : overArt.category;

        // Ensure we're in the same top-level category or featured/upcoming buckets
        if (category !== overCategory) return;

        // Get current list of IDs for this category (sorted by current display order)
        const catItems = artworks.filter(a => {
            if (category === 'Featured') return a.category === 'Featured' || a.description?.includes('[FEATURED]');
            return a.category === category;
        });

        // Calculate the current order array based on existing state + any new items
        let currentOrder = artworkOrders[category] || [];
        const catIds = catItems.map(a => a.id);

        // Filter out any IDs that might have been deleted
        currentOrder = currentOrder.filter(id => catIds.includes(id));

        // Add any new IDs that aren't in the order list yet (put them at the top or bottom as per preference)
        const newIds = catIds.filter(id => !currentOrder.includes(id));
        // Default: New items at top? Or bottom? 
        // If "created_at desc" is default, newly created items are at top.
        // So let's prepend new IDs.
        const fullOrder = [...newIds, ...currentOrder];

        const oldIndex = fullOrder.indexOf(active.id);
        const newIndex = fullOrder.indexOf(over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(fullOrder, oldIndex, newIndex);

            const updatedOrders = {
                ...artworkOrders,
                [category]: reordered
            };

            setArtworkOrders(updatedOrders);
            saveArtworkOrder(updatedOrders);
        }
    };

    const handleUpdatePriorities = async () => {
        setLoadingSettings(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    id: 'category_priorities',
                    value: categoryPriorities
                })
            });

            if (res.ok) {
                alert('✨ Category priorities updated!');
            } else {
                const data = await res.json();
                alert(`❌ Failed to update: ${data.error}`);
            }
        } catch (err) {
            console.error('Update settings failed:', err);
            alert('Connection error');
        } finally {
            setLoadingSettings(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchArtworks();
        }
    }, [session]);

    const fetchArtworks = async () => {
        const { data, error } = await supabase
            .from('artworks')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setArtworks(data || []);
    };

    // Calculate unique subcategories grouped by main category
    const subcategoriesByMain = artworks.reduce((acc, art) => {
        const subMatch = art.description?.match(/\[SubCategory:\s*(.*?)\]/);
        if (subMatch) {
            const main = art.category;
            const sub = subMatch[1];
            if (!acc[main]) acc[main] = new Set();
            acc[main].add(sub);
        }
        return acc;
    }, {});

    // Convert Sets to sorted Arrays
    Object.keys(subcategoriesByMain).forEach(key => {
        subcategoriesByMain[key] = [...subcategoriesByMain[key]].sort();
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                setSession({ user: { id: 'admin-master', email: 'owner' } });
            } else {
                let errorMsg = 'Invalid credentials';
                try {
                    const data = await res.json();
                    errorMsg = data.error || errorMsg;
                } catch (jsonErr) {
                    errorMsg = `Server error (${res.status})`;
                }
                alert(`🔒 Access Denied: ${errorMsg}`);
            }
        } catch (err) {
            console.error('Login error:', err);
            alert(`🔒 Connection error. 
            
If you are developing locally, please use "vercel dev" to start the server. 

If this is production, please check your Vercel logs and ensure you have run the Supabase SQL setup.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await fetch('/api/logout', { method: 'POST', credentials: 'include' });
            setSession(null);
            window.location.href = '/';
        } catch (err) {
            console.error('Logout failed:', err);
            setSession(null);
            window.location.href = '/';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regPassword !== regConfirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setIsRegistering(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regEmail, password: regPassword }),
            });

            if (res.ok) {
                alert('✨ Owner account registered successfully! You can now log in.');
                setLoginMode('login');
                setEmail(regEmail);
                setPassword(''); // Clear passwords
            } else {
                let errorMsg = 'Failed to register';
                try {
                    const data = await res.json();
                    errorMsg = data.error || errorMsg;
                } catch (jsonErr) {
                    errorMsg = `Server error (${res.status})`;
                }
                alert(`❌ Registration failed: ${errorMsg}`);
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert(`❌ Connection error. 
            
Check your internet connection. If this is on Vercel, please ensure you have run the Supabase SQL setup and configured your environment variables.`);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setIsSendingReset(true);
        try {
            const res = await fetch('/api/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            });

            if (res.ok) {
                setResetSuccess(true);
                setTimeout(() => {
                    setShowForgotModal(false);
                    setResetSuccess(false);
                    setResetEmail('');
                }, 3000);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            console.error('Reset request error:', err);
            alert('Connection error. Please try again.');
        } finally {
            setIsSendingReset(false);
        }
    };

    const [uploadType, setUploadType] = useState('gallery'); // gallery, featured, upcoming

    // ... existing login logic ...

    const handleEdit = (art) => {
        setEditingId(art.id);
        setTitle(art.title || '');

        // Parse description and subcategory
        let cleanDesc = art.description || '';
        let extractedSub = '';

        // Extract subcategory if present
        const subMatch = cleanDesc.match(/\[SubCategory:\s*(.*?)\]/);
        if (subMatch) {
            extractedSub = subMatch[1];
            cleanDesc = cleanDesc.replace(/\[SubCategory:.*?\]/g, '').trim();
        }

        // Extract featured status
        const isFeaturedItem = cleanDesc.includes('[FEATURED]');
        cleanDesc = cleanDesc.replace(/\[FEATURED\]/g, '').trim();

        setDesc(cleanDesc);

        // Determine mode and category
        if (art.category === 'Upcoming') {
            setUploadType('upcoming');
            setCategory(categoryDefinitions[0]?.label || ''); // Reset category dropdown
        } else if (art.category === 'Featured' || isFeaturedItem) {
            setUploadType('featured');
            setCategory(categoryDefinitions[0]?.label || '');
        } else {
            setUploadType('gallery');
            setCategory(art.category || (categoryDefinitions[0]?.label || ''));
            subCategoryOverrideRef.current = extractedSub;
        }

        setPreviewUrl(art.image_url);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!session) return;
        if (!file && !editingId) return;

        let finalImageUrl = null;
        try {
            setUploading(true);

            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error("File size must be less than 10MB");
                }
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                // 1. Upload Image
                let { error: uploadError } = await supabase.storage
                    .from('artworks')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('artworks')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
            } else if (editingId) {
                const art = artworks.find(a => a.id === editingId);
                finalImageUrl = art.image_url;
            }

            // 3. Prepare Metadata
            let finalDescription = desc;
            let finalCategory = category;

            if (uploadType === 'upcoming') {
                finalCategory = 'Upcoming';
            } else if (uploadType === 'featured') {
                finalCategory = 'Featured';
                finalDescription += `\n\n[FEATURED]`;
            } else {
                if (subCategory) finalDescription += `\n\n[SubCategory: ${subCategory}]`;
            }

            if (editingId) {
                // Update Existing via Private API
                const res = await fetch('/api/manage-art', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        id: editingId,
                        title,
                        description: finalDescription,
                        category: finalCategory,
                        image_url: finalImageUrl,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to update artwork');
                }
            } else {
                // Insert New via Private API
                const res = await fetch('/api/manage-art', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        title,
                        description: finalDescription,
                        category: finalCategory,
                        image_url: finalImageUrl,
                        user_id: session.user.id,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to add artwork');
                }
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            resetForm();
            fetchArtworks();
        } catch (error) {
            alert(error.message);
            // Cleanup orphaned image if DB insert/update failed
            if (file && finalImageUrl) {
                const fileName = finalImageUrl.split('/').pop();
                supabase.storage.from('artworks').remove([fileName]).catch(console.error);
            }
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDesc('');
        setCategory(categoryDefinitions[0]?.label || '');
        setFile(null);
        setPreviewUrl(null);
        setUploadType('gallery');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleDelete = async (art) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${art.title}"? This cannot be undone.`);
        if (!confirmDelete) return;

        try {
            if (art.image_url && art.image_url.includes('storage/v1/object/public/artworks/')) {
                const fileName = art.image_url.split('/').pop();
                await supabase.storage.from('artworks').remove([fileName]);
            }

            // Delete via Private API
            const res = await fetch('/api/manage-art', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: art.id }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete artwork');
            }

            setArtworks(artworks.filter(a => a.id !== art.id));
        } catch (error) {
            alert(`Delete failed: ${error.message}`);
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ghibli-cream p-4 sm:p-6">
                <div className="max-w-md w-full">
                    <a href="/" className="inline-flex items-center gap-2 text-ghibli-wood hover:text-ghibli-navy mb-8 font-bold transition-all group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Studio
                    </a>
                    <div className="card-ghibli p-10 bg-white/40 backdrop-blur-xl border border-white/20 text-center shadow-2xl rounded-[2rem]">
                        <h1 className="text-3xl font-bold text-ghibli-navy font-serif mb-2">Admin Dashboard</h1>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-ghibli-wood/60 uppercase block mb-8">🔒 Secure Authentication System</span>

                        {/* Login/Setup Tabs */}
                        <div className="flex bg-ghibli-paper/20 p-1 rounded-xl mb-8">
                            <button
                                onClick={() => setLoginMode('login')}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${loginMode === 'login' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => {
                                    setLoginMode('register');
                                    setRegPassword('');
                                    setRegConfirmPassword('');
                                }}
                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${loginMode === 'register' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                            >
                                Register
                            </button>
                        </div>

                        {loginMode === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors rounded-full hover:bg-white/50"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4 active:scale-95 disabled:opacity-50">
                                    {loading ? 'Logging in...' : 'Enter Studio'}
                                </button>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-sm text-ghibli-wood hover:text-ghibli-navy underline font-bold transition-colors active:scale-95"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6 text-left">
                                <p className="text-xs text-ghibli-charcoal/60 leading-relaxed italic mb-2 text-center">
                                    Create your master owner account. <br /> (Only one account is allowed)
                                </p>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Registration Email</label>
                                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" placeholder="e.g. art@studio.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Create Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                            placeholder="Choose a strong password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors rounded-full hover:bg-white/50"
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={regConfirmPassword}
                                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                                            className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                            placeholder="Repeat your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors rounded-full hover:bg-white/50"
                                            title={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={isRegistering} className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-4 active:scale-95">
                                    {isRegistering ? 'Registering...' : 'Register Owner account'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Forgot Password Modal */}
                {showForgotModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full relative border border-white/20">
                            <button
                                onClick={() => {
                                    setShowForgotModal(false);
                                    setResetEmail('');
                                    setResetSuccess(false);
                                }}
                                className="absolute top-6 right-6 text-ghibli-charcoal/40 hover:text-ghibli-charcoal text-2xl transition-colors"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-ghibli-navy font-serif mb-3">Reset Password</h2>
                                <p className="text-ghibli-charcoal/60 text-sm leading-relaxed">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {resetSuccess ? (
                                <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                        ✨
                                    </div>
                                    <h3 className="text-xl font-bold text-ghibli-navy mb-2">Check Your Email</h3>
                                    <p className="text-ghibli-charcoal/60 text-sm">
                                        If that email exists, a reset link has been sent. This window will close shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleRequestReset} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Studio Email</label>
                                        <input
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="w-full p-4 rounded-2xl border border-ghibli-wood/10 bg-ghibli-paper/10 focus:bg-white transition-all text-ghibli-wood font-bold placeholder:text-ghibli-wood/30 shadow-inner focus:ring-2 focus:ring-ghibli-wood/20 outline-none"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSendingReset}
                                        className="w-full py-4 bg-ghibli-wood text-ghibli-cream rounded-2xl font-bold text-lg hover:bg-[#A0704F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSendingReset ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : 'Send Reset Link'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(false)}
                                        className="w-full text-center text-sm font-bold text-ghibli-wood/50 hover:text-ghibli-wood transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-10 pt-24 sm:pt-32 bg-ghibli-cream transition-colors duration-500">
            <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex flex-col w-full sm:w-auto">
                        <a href="/" className="text-sm font-bold text-ghibli-wood hover:text-ghibli-navy transition-colors mb-2 flex items-center gap-1 group active:scale-95">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Exit to Site
                        </a>
                        <h1 className="text-3xl sm:text-4xl font-bold text-ghibli-wood font-serif">Artist Dashboard</h1>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-ghibli-wood/10 hover:bg-ghibli-wood/20 text-ghibli-wood border border-ghibli-wood/20 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <span>⚙️</span> <span className="hidden xs:inline">Reset Password</span><span className="xs:hidden">Settings</span>
                        </button>
                        <button onClick={handleSignOut} className="flex-1 sm:flex-none px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95">
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
                    {/* Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] lg:sticky lg:top-32">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-ghibli-navy">{editingId ? 'Edit Artwork' : 'New Creation'}</h2>
                                {editingId && (
                                    <button onClick={resetForm} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors active:scale-90">Cancel</button>
                                )}
                            </div>

                            {/* Mode Selector */}
                            <div className="flex bg-ghibli-paper/20 p-1 rounded-xl mb-8">
                                <button
                                    onClick={() => setUploadType('gallery')}
                                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadType === 'gallery' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                                >
                                    Gallery
                                </button>
                                <button
                                    onClick={() => setUploadType('featured')}
                                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadType === 'featured' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                                >
                                    Featured
                                </button>
                                <button
                                    onClick={() => setUploadType('upcoming')}
                                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${uploadType === 'upcoming' ? 'bg-white text-ghibli-wood shadow-sm' : 'text-ghibli-charcoal/40 hover:text-ghibli-charcoal/60'}`}
                                >
                                    Upcoming
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Title (Optional)</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold" />
                                </div>

                                {uploadType === 'gallery' ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Main Category</label>
                                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer">
                                                {categoryDefinitions.map(cat => <option key={cat.id} value={cat.label}>{cat.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Sub-Category</label>
                                            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer">
                                                {(() => {
                                                    const catDef = categoryDefinitions.find(c =>
                                                        c.label?.trim().toLowerCase() === category?.trim().toLowerCase() ||
                                                        c.id?.trim().toLowerCase() === category?.trim().toLowerCase()
                                                    );
                                                    return catDef?.subCategories?.map(sub => <option key={sub} value={sub}>{sub}</option>) || <option value="">No subcategories</option>;
                                                })()}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-ghibli-wood/5 border border-ghibli-wood/10 text-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-ghibli-wood opacity-60">
                                            {uploadType === 'featured' ? '★ FOR TOP HIGHLIGHTS' : '🌿 FOR UPCOMING ART'}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Story</label>
                                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood h-24" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70 text-left">Image File {editingId && '(Optional if not changing)'}</label>
                                    <div className="relative group">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" required={!editingId} />
                                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-ghibli-wood/20 rounded-2xl bg-white/30 hover:bg-white/50 transition-all cursor-pointer overflow-hidden group-hover:border-ghibli-wood/40">
                                            {previewUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-6">
                                                    <span className="text-3xl block mb-2 opacity-50">📸</span>
                                                    <span className="text-[10px] font-bold text-ghibli-wood/60 uppercase tracking-widest">Select File</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button disabled={uploading} className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 ${success ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream hover:bg-[#A0704F]'}`}>
                                    {uploading ? 'Processing...' : success ? '✨ Done!' : editingId ? '✨ Update Artwork' : `✨ Add to ${uploadType === 'upcoming' ? 'Upcoming Art' : uploadType === 'featured' ? 'Highlights' : 'Gallery'}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Manage List */}
                    <div className="lg:col-span-2">
                        {/* Category Manager */}
                        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-ghibli-navy mb-1">Category Manager</h2>
                                    <p className="text-xs text-ghibli-charcoal/60">Add, edit, and reorder your art collections.</p>
                                </div>
                                <div className="flex gap-2">
                                    {showCategoryManager && (
                                        <button
                                            onClick={() => saveCategoryDefinitions(categoryDefinitions)}
                                            disabled={savingCategories}
                                            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ${categoriesSaveSuccess ? 'bg-green-500 text-white' : 'bg-ghibli-wood text-ghibli-cream shadow-sm'}`}
                                        >
                                            {savingCategories ? '⏳ Saving...' : categoriesSaveSuccess ? '✨ Saved!' : '💾 Save Changes'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowCategoryManager(!showCategoryManager)}
                                        className="px-6 py-2.5 bg-ghibli-wood/10 hover:bg-ghibli-wood/20 text-ghibli-wood border border-ghibli-wood/20 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95"
                                    >
                                        {showCategoryManager ? 'Hide Manager' : 'Open Manager'}
                                    </button>
                                </div>
                            </div>

                            {showCategoryManager && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newCategoryLabel}
                                            onChange={(e) => setNewCategoryLabel(e.target.value)}
                                            placeholder="New Category Name (e.g. Sculptures)"
                                            className="flex-grow p-3 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        />
                                        <button
                                            onClick={() => {
                                                if (!newCategoryLabel.trim()) return;
                                                const newId = newCategoryLabel.toLowerCase().replace(/\s+/g, '-');
                                                if (categoryDefinitions.some(c => c.id === newId)) {
                                                    alert('Category ID already exists');
                                                    return;
                                                }
                                                const updated = [...categoryDefinitions, { id: newId, label: newCategoryLabel, subCategories: [] }];
                                                setCategoryDefinitions(updated);
                                                saveCategoryDefinitions(updated);
                                                setNewCategoryLabel('');
                                            }}
                                            className="px-6 py-3 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold hover:bg-[#A0704F] transition-all active:scale-95"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {categoryDefinitions.map((cat, index) => (
                                            <div key={cat.id} className="p-4 rounded-2xl bg-white/30 border border-ghibli-wood/5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-ghibli-wood/40">#{index + 1}</span>
                                                        <input
                                                            type="text"
                                                            value={cat.label}
                                                            onFocus={(e) => {
                                                                e.target.dataset.oldValue = e.target.value;
                                                            }}
                                                            onChange={(e) => {
                                                                const updated = [...categoryDefinitions];
                                                                updated[index].label = e.target.value;
                                                                setCategoryDefinitions(updated);
                                                            }}
                                                            onBlur={async (e) => {
                                                                saveCategoryDefinitions(categoryDefinitions);
                                                                
                                                                const oldLabel = e.target.dataset.oldValue;
                                                                const newLabel = e.target.value;
                                                                
                                                                if (oldLabel && oldLabel !== newLabel) {
                                                                    // Reflect rename in priorities and orders
                                                                    const newPriorities = { ...categoryPriorities };
                                                                    let prioritiesChanged = false;
                                                                    if (newPriorities[oldLabel]) {
                                                                        newPriorities[newLabel] = newPriorities[oldLabel];
                                                                        delete newPriorities[oldLabel];
                                                                        setCategoryPriorities(newPriorities);
                                                                        prioritiesChanged = true;
                                                                    }
                                                                    
                                                                    const newOrders = { ...artworkOrders };
                                                                    let ordersChanged = false;
                                                                    if (newOrders[oldLabel]) {
                                                                        newOrders[newLabel] = newOrders[oldLabel];
                                                                        delete newOrders[oldLabel];
                                                                        setArtworkOrders(newOrders);
                                                                        ordersChanged = true;
                                                                    }

                                                                    if (ordersChanged) saveArtworkOrder(newOrders);
                                                                    // Priority save is manual, but we update state

                                                                    // Update database asynchronously
                                                                    try {
                                                                        await fetch('/api/manage-art', {
                                                                            method: 'PUT',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            credentials: 'include',
                                                                            body: JSON.stringify({ action: 'rename_category', oldCategory: oldLabel, newCategory: newLabel })
                                                                        });
                                                                        fetchArtworks(); // refresh local state
                                                                    } catch (err) {
                                                                        console.error('Failed to rename artworks in DB:', err);
                                                                    }
                                                                }
                                                            }}
                                                            className="bg-transparent border-none font-bold text-ghibli-navy focus:ring-0 p-0 text-lg w-full"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                if (index === 0) return;
                                                                const updated = arrayMove(categoryDefinitions, index, index - 1);
                                                                setCategoryDefinitions(updated);
                                                                saveCategoryDefinitions(updated);
                                                            }}
                                                            disabled={index === 0}
                                                            className="p-3 sm:p-2 text-ghibli-wood/40 hover:text-ghibli-wood disabled:opacity-20 active:scale-90"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (index === categoryDefinitions.length - 1) return;
                                                                const updated = arrayMove(categoryDefinitions, index, index + 1);
                                                                setCategoryDefinitions(updated);
                                                                saveCategoryDefinitions(updated);
                                                            }}
                                                            disabled={index === categoryDefinitions.length - 1}
                                                            className="p-3 sm:p-2 text-ghibli-wood/40 hover:text-ghibli-wood disabled:opacity-20 active:scale-90"
                                                        >
                                                            ↓
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const artworksCount = artworks.filter(a => a.category === cat.label || a.category === cat.id).length;
                                                                let confirmMsg = `Delete "${cat.label}" and all its subcategories?`;
                                                                if (artworksCount > 0) {
                                                                    confirmMsg += `\n\nWARNING: ${artworksCount} artwork(s) currently belong to this category. They will become "Uncategorized" and you will need to manually reassign them!`;
                                                                }
                                                                if (!window.confirm(confirmMsg)) return;
                                                                const updated = categoryDefinitions.filter((_, i) => i !== index);
                                                                setCategoryDefinitions(updated);
                                                                saveCategoryDefinitions(updated);
                                                            }}
                                                            className="p-3 sm:p-2 text-red-500/40 hover:text-red-500 active:scale-90"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Subcategories */}
                                                <div className="pl-6 space-y-2 border-l-2 border-ghibli-wood/10">
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {cat.subCategories?.map((sub, sIndex) => (
                                                            <div key={sub} className="group flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-ghibli-wood/5 text-[10px] sm:text-[9px] font-bold text-ghibli-wood uppercase shadow-sm">
                                                                <span>{sub}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = [...categoryDefinitions];
                                                                        updated[index].subCategories = updated[index].subCategories.filter((_, i) => i !== sIndex);
                                                                        setCategoryDefinitions(updated);
                                                                        saveCategoryDefinitions(updated);
                                                                    }}
                                                                    className="opacity-60 sm:opacity-0 group-hover:opacity-100 text-red-500 transition-opacity p-1"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            placeholder="Add Subcategory..."
                                                            className="flex-grow bg-white/30 border-b-2 border-ghibli-wood/10 text-xs font-bold uppercase tracking-widest p-3 focus:border-ghibli-wood outline-none rounded-t-lg"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                                    const val = e.target.value.trim();
                                                                    const updated = [...categoryDefinitions];
                                                                    if (!updated[index].subCategories) updated[index].subCategories = [];
                                                                    if (updated[index].subCategories.includes(val)) return;
                                                                    updated[index].subCategories.push(val);
                                                                    setCategoryDefinitions(updated);
                                                                    saveCategoryDefinitions(updated);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <div className="sm:hidden text-ghibli-wood/30 text-[9px] font-bold">↵</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[10px] font-bold text-ghibli-wood/40 uppercase tracking-widest text-center py-2">
                                        Tip: Press Enter to add a subcategory. Individual changes save automatically.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Priority Management */}
                        <div className="card-ghibli p-6 sm:p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] mb-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-6 bg-white/30 p-4 -m-4 sm:-m-6 sm:p-6 mb-2 rounded-t-[1.8rem] border-b border-ghibli-wood/10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-ghibli-navy mb-1">Category Priorities</h2>
                                        <p className="text-xs text-ghibli-charcoal/60">Choose a sub-category to show first in each section.</p>
                                    </div>
                                    <button
                                        onClick={handleUpdatePriorities}
                                        disabled={loadingSettings}
                                        className="w-full sm:w-auto px-8 py-4 bg-ghibli-wood text-ghibli-cream rounded-xl font-bold hover:bg-[#A0704F] transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                                    >
                                        {loadingSettings ? (
                                            <span className="animate-spin text-sm">⏳</span>
                                        ) : '✨'}
                                        {loadingSettings ? 'Saving...' : 'Save Priorities'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categoryDefinitions.map(cat => (
                                        <div key={cat.id} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/20 border border-white/40 shadow-sm">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-ghibli-wood/60">
                                                {cat.label} Collection
                                            </label>
                                            <select
                                                value={categoryPriorities[cat.label] || ''}
                                                onChange={(e) => setCategoryPriorities({
                                                    ...categoryPriorities,
                                                    [cat.label]: e.target.value
                                                })}
                                                className="w-full p-2.5 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold cursor-pointer text-sm"
                                            >
                                                <option value="">No Priority (Newest First)</option>
                                                {cat.subCategories?.map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card-ghibli p-8 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem]">
                            <div className="flex items-center justify-between mb-8 border-b border-ghibli-wood/5 pb-6">
                                <h2 className="text-2xl font-bold text-ghibli-navy flex items-center gap-3">
                                    Manage Collection
                                    <span className="px-3 py-1 rounded-full bg-ghibli-wood/10 text-ghibli-wood text-[10px] font-bold uppercase tracking-widest border border-ghibli-wood/5">
                                        {artworks.length} Media Uploaded
                                    </span>
                                </h2>
                            </div>

                            <div className="space-y-12">
                                {artworks.length === 0 ? (
                                    <div className="text-center py-20 bg-white/10 rounded-3xl border border-dashed border-ghibli-wood/10">
                                        <span className="text-6xl block mb-6 animate-pulse opacity-40">🌙</span>
                                        <p className="font-bold tracking-[0.3em] text-sm uppercase text-ghibli-wood/80 font-serif">
                                            The gallery is empty
                                        </p>
                                        <p className="text-[10px] text-ghibli-wood/40 mt-4 uppercase tracking-widest font-bold">
                                            Waiting for your first masterpiece
                                        </p>
                                    </div>
                                ) : (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                        onDragCancel={handleDragCancel}
                                    >
                                        {/* 🖼️ GALLERY SECTION */}
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3 pb-2 border-b-2 border-ghibli-wood/10">
                                                <div className="w-10 h-10 rounded-2xl bg-ghibli-wood text-ghibli-cream flex items-center justify-center text-xl shadow-lg shadow-ghibli-wood/20">🏞️</div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-ghibli-navy leading-none">The Gallery</h3>
                                                    <p className="text-[10px] text-ghibli-wood/50 font-bold uppercase tracking-widest mt-1">Organized by category & subcategory</p>
                                                </div>
                                            </div>

                                            <div className="space-y-10 pl-2">
                                                {categoryDefinitions.map(catDef => {
                                                    const catLabel = catDef.label;
                                                    const isCatCollapsed = collapsedSections[catLabel];
                                                    const catItems = artworks.filter(a => {
                                                        const isMatch = a.category?.trim().toLowerCase() === catLabel?.trim().toLowerCase() ||
                                                            a.category?.trim().toLowerCase() === catDef?.id?.trim().toLowerCase();
                                                        // Only show in Gallery if NOT marked as Featured or Upcoming category
                                                        return isMatch && a.category !== 'Upcoming' && a.category !== 'Featured' && !a.description?.includes('[FEATURED]');
                                                    });

                                                    if (catItems.length === 0) return null;

                                                    // Apply sorting
                                                    const order = artworkOrders[catLabel] || [];
                                                    const sortedItems = [...catItems].sort((a, b) => {
                                                        const indexA = order.indexOf(a.id);
                                                        const indexB = order.indexOf(b.id);
                                                        const posA = indexA === -1 ? -Infinity : indexA;
                                                        const posB = indexB === -1 ? -Infinity : indexB;
                                                        if (posA === posB) return new Date(b.created_at) - new Date(a.created_at);
                                                        return posA - posB;
                                                    });

                                                    // Group by SubCategory
                                                    const subGroups = sortedItems.reduce((acc, art) => {
                                                        const subMatch = art.description?.match(/\[SubCategory:\s*(.*?)\]/);
                                                        const sub = subMatch ? subMatch[1] : 'Main Collection';
                                                        if (!acc[sub]) acc[sub] = [];
                                                        acc[sub].push(art);
                                                        return acc;
                                                    }, {});

                                                    return (
                                                        <div key={catLabel} className="space-y-6">
                                                            <button
                                                                onClick={() => toggleSection(catLabel)}
                                                                className="w-full flex items-center gap-2 text-xs font-black text-ghibli-wood uppercase tracking-[0.3em] bg-ghibli-wood/5 p-3 rounded-xl border border-ghibli-wood/10 hover:bg-ghibli-wood/10 transition-all text-left"
                                                            >
                                                                <span className={`transition-transform duration-300 ${isCatCollapsed ? '-rotate-90' : 'rotate-0'}`}>
                                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M6 9l6 6 6-6" />
                                                                    </svg>
                                                                </span>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-ghibli-wood"></span>
                                                                {catLabel}
                                                                <span className="ml-auto text-[9px] opacity-40">{catItems.length} items</span>
                                                            </button>

                                                            {!isCatCollapsed && (
                                                                <div className="space-y-8 pl-4 border-l border-ghibli-wood/10 transition-all">
                                                                    {Object.entries(subGroups).map(([subLabel, subItems]) => {
                                                                        const subKey = `${catLabel}-${subLabel}`;
                                                                        const isSubCollapsed = collapsedSections[subKey];
                                                                        return (
                                                                            <div key={subLabel}>
                                                                                <button
                                                                                    onClick={() => toggleSection(subKey)}
                                                                                    className="w-full text-[10px] font-bold text-ghibli-wood/40 uppercase tracking-widest mb-4 flex items-center gap-2 hover:text-ghibli-wood/60 transition-colors text-left"
                                                                                >
                                                                                    <span className={`transition-transform duration-300 ${isSubCollapsed ? '-rotate-90' : 'rotate-0'}`}>
                                                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <path d="M6 9l6 6 6-6" />
                                                                                        </svg>
                                                                                    </span>
                                                                                    <span className="w-3 h-[1px] bg-ghibli-wood/20"></span>
                                                                                    {subLabel} ({subItems.length})
                                                                                </button>
                                                                                {!isSubCollapsed && (
                                                                                    <SortableContext
                                                                                        items={subItems.map(a => a.id)}
                                                                                        strategy={verticalListSortingStrategy}
                                                                                    >
                                                                                        <div className="space-y-4">
                                                                                            {subItems.map(art => (
                                                                                                <SortableArtworkRow
                                                                                                    key={art.id}
                                                                                                    art={art}
                                                                                                    isFeatured={false}
                                                                                                    handleEdit={handleEdit}
                                                                                                    handleDelete={handleDelete}
                                                                                                />
                                                                                            ))}
                                                                                        </div>
                                                                                    </SortableContext>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* ⭐ FEATURED SECTION */}
                                        <div className="space-y-8 mt-16 pt-12 border-t-2 border-dashed border-ghibli-wood/10">
                                            <button
                                                onClick={() => toggleSection('Featured')}
                                                className="w-full flex items-center gap-3 pb-2 border-b-2 border-yellow-500/10 hover:bg-yellow-500/5 transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-white flex items-center justify-center text-xl shadow-lg shadow-yellow-400/20">⭐</div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-ghibli-navy leading-none">Featured Artworks</h3>
                                                    <p className="text-[10px] text-yellow-600/60 font-bold uppercase tracking-widest mt-1">Highlighted highlights</p>
                                                </div>
                                                <span className={`ml-auto transition-transform duration-300 ${collapsedSections['Featured'] ? '-rotate-90' : 'rotate-0'}`}>
                                                    <svg className="w-6 h-6 text-yellow-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M6 9l6 6 6-6" />
                                                    </svg>
                                                </span>
                                            </button>

                                            {!collapsedSections['Featured'] && (
                                                <div className="space-y-4 pt-2">
                                                    {(() => {
                                                        const featuredItems = artworks.filter(a => a.category === 'Featured' || a.description?.includes('[FEATURED]'));
                                                        if (featuredItems.length === 0) return (
                                                            <div className="p-8 text-center bg-yellow-500/5 rounded-3xl border border-dashed border-yellow-500/10">
                                                                <p className="text-[10px] font-bold text-yellow-600/40 uppercase tracking-[0.2em]">No featured items yet</p>
                                                            </div>
                                                        );

                                                        const order = artworkOrders['Featured'] || [];
                                                        const sortedItems = [...featuredItems].sort((a, b) => {
                                                            const indexA = order.indexOf(a.id);
                                                            const indexB = order.indexOf(b.id);
                                                            const posA = indexA === -1 ? -Infinity : indexA;
                                                            const posB = indexB === -1 ? -Infinity : indexB;
                                                            if (posA === posB) return new Date(b.created_at) - new Date(a.created_at);
                                                            return posA - posB;
                                                        });

                                                        return (
                                                            <SortableContext
                                                                items={sortedItems.map(a => a.id)}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                <div className="space-y-4">
                                                                    {sortedItems.map(art => (
                                                                        <SortableArtworkRow
                                                                            key={art.id}
                                                                            art={art}
                                                                            isFeatured={true}
                                                                            handleEdit={handleEdit}
                                                                            handleDelete={handleDelete}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </SortableContext>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        {/* ⏳ UPCOMING SECTION */}
                                        <div className="space-y-8 mt-16 pt-12 border-t-2 border-dashed border-ghibli-wood/10">
                                            <button
                                                onClick={() => toggleSection('Upcoming')}
                                                className="w-full flex items-center gap-3 pb-2 border-b-2 border-blue-500/10 hover:bg-blue-500/5 transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 rounded-2xl bg-blue-400 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-400/20">⏳</div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-ghibli-navy leading-none">Upcoming Releases</h3>
                                                    <p className="text-[10px] text-blue-600/60 font-bold uppercase tracking-widest mt-1">Soon to be published</p>
                                                </div>
                                                <span className={`ml-auto transition-transform duration-300 ${collapsedSections['Upcoming'] ? '-rotate-90' : 'rotate-0'}`}>
                                                    <svg className="w-6 h-6 text-blue-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M6 9l6 6 6-6" />
                                                    </svg>
                                                </span>
                                            </button>

                                            {!collapsedSections['Upcoming'] && (
                                                <div className="space-y-4 pt-2">
                                                    {(() => {
                                                        const upcomingItems = artworks.filter(a => a.category === 'Upcoming');
                                                        if (upcomingItems.length === 0) return (
                                                            <div className="p-8 text-center bg-blue-500/5 rounded-3xl border border-dashed border-blue-500/10">
                                                                <p className="text-[10px] font-bold text-blue-600/40 uppercase tracking-[0.2em]">No upcoming items scheduled</p>
                                                            </div>
                                                        );

                                                        const order = artworkOrders['Upcoming'] || [];
                                                        const sortedItems = [...upcomingItems].sort((a, b) => {
                                                            const indexA = order.indexOf(a.id);
                                                            const indexB = order.indexOf(b.id);
                                                            const posA = indexA === -1 ? -Infinity : indexA;
                                                            const posB = indexB === -1 ? -Infinity : indexB;
                                                            if (posA === posB) return new Date(b.created_at) - new Date(a.created_at);
                                                            return posA - posB;
                                                        });

                                                        return (
                                                            <SortableContext
                                                                items={sortedItems.map(a => a.id)}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                <div className="space-y-4">
                                                                    {sortedItems.map(art => (
                                                                        <SortableArtworkRow
                                                                            key={art.id}
                                                                            art={art}
                                                                            isFeatured={false}
                                                                            handleEdit={handleEdit}
                                                                            handleDelete={handleDelete}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </SortableContext>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Uncategorized / Unknown Section */}
                                        {(() => {
                                            const knownLabels = [
                                                ...categoryDefinitions.map(c => c.label?.trim().toLowerCase()),
                                                ...categoryDefinitions.map(c => c.id?.trim().toLowerCase()),
                                                'upcoming',
                                                'featured'
                                            ];
                                            const uncategorizedItems = artworks.filter(a => {
                                                const cat = a.category?.trim().toLowerCase();
                                                const isKnown = knownLabels.includes(cat);
                                                const isTaggedFeatured = a.description?.includes('[FEATURED]');
                                                return !isKnown && !isTaggedFeatured;
                                            });

                                            if (uncategorizedItems.length === 0) return null;

                                            return (
                                                <div className="mt-16 pt-12 border-t-2 border-dashed border-red-500/10">
                                                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl mb-6">
                                                        <h3 className="text-sm font-bold text-red-700 uppercase tracking-widest flex items-center gap-2">
                                                            ⚠️ Action Required: Uncategorized Items ({uncategorizedItems.length})
                                                        </h3>
                                                        <p className="text-[10px] text-red-600/60 font-bold mt-1 uppercase tracking-tight">
                                                            These items have categories that don't match your current definitions. Edit them to correctly assign them.
                                                        </p>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {uncategorizedItems.map(art => (
                                                            <SortableArtworkRow
                                                                key={art.id}
                                                                art={art}
                                                                isFeatured={art.description?.includes('[FEATURED]')}
                                                                handleEdit={handleEdit}
                                                                handleDelete={handleDelete}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        <DragOverlay zIndex={1000}>
                                            {activeId ? (
                                                <div className="w-full max-w-[calc(100vw-2rem)] opacity-90 shadow-2xl">
                                                    <SortableArtworkRow
                                                        art={artworks.find(a => a.id === activeId)}
                                                        isFeatured={(() => {
                                                            const a = artworks.find(i => i.id === activeId);
                                                            return a?.category === 'Featured' || a?.description?.includes('[FEATURED]');
                                                        })()}
                                                        handleEdit={() => { }}
                                                        handleDelete={() => { }}
                                                        isOverlay={true}
                                                    />
                                                </div>
                                            ) : null}
                                        </DragOverlay>
                                    </DndContext>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                {showChangePassword && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative">
                            <button
                                onClick={() => {
                                    setShowChangePassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                }}
                                className="absolute top-6 right-6 text-ghibli-charcoal/40 hover:text-ghibli-charcoal text-2xl transition-colors active:scale-90"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-ghibli-charcoal mb-4">Change Password</h2>
                            <p className="text-ghibli-charcoal/60 mb-6">
                                Update your password. You'll receive a confirmation email.
                            </p>

                            <form onSubmit={async (e) => {
                                e.preventDefault();

                                if (newPassword !== confirmNewPassword) {
                                    alert('New passwords do not match!');
                                    return;
                                }

                                if (newPassword.length < 8) {
                                    alert('New password must be at least 8 characters');
                                    return;
                                }

                                try {
                                    const res = await fetch('/api/change-password', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        credentials: 'include',
                                        body: JSON.stringify({ currentPassword, newPassword }),
                                    });

                                    const data = await res.json();

                                    if (res.ok) {
                                        alert('✅ Password updated successfully! Check your email for confirmation.');
                                        setShowChangePassword(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmNewPassword('');
                                    } else {
                                        alert(`❌ ${data.error || 'Failed to update password'}`);
                                    }
                                } catch (err) {
                                    console.error('Password change error:', err);
                                    alert('Connection error. Please try again.');
                                }
                            }} className="space-y-4">
                                <div className="relative">
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Current Password</label>
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        placeholder="Enter current password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-[42px] w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors"
                                    >
                                        {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">New Password</label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        placeholder="Enter new password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-[42px] w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors"
                                    >
                                        {showNewPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold mb-2 text-ghibli-charcoal/70">Confirm New Password</label>
                                    <input
                                        type={showConfirmNewPassword ? "text" : "password"}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full p-3 pr-12 rounded-xl border border-ghibli-wood/10 bg-white/50 focus:bg-white transition-all text-ghibli-wood font-bold"
                                        placeholder="Confirm new password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        className="absolute right-3 top-[42px] w-8 h-8 flex items-center justify-center text-ghibli-wood/40 hover:text-ghibli-wood transition-colors"
                                    >
                                        {showConfirmNewPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-ghibli-wood text-white rounded-xl font-bold hover:bg-[#A0704F] transition-all mt-6 active:scale-95 shadow-lg"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
