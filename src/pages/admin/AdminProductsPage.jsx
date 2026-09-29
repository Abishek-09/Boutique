import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Plus, Search, Edit2, Eye, ToggleLeft, ToggleRight, Trash2, Filter } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useApp } from '../../context/AppContext';
import { ProductFormModal } from '../../components/product/ProductFormModal';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeProductId } = useParams();

  const loadProducts = () => {
    setProducts(productService.getAllProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Detect direct URL navigation to /admin/products/new or /admin/products/:id/edit
  useEffect(() => {
    if (location.pathname.endsWith('/new')) {
      setEditingProduct(null);
      setIsProductModalOpen(true);
    } else if (routeProductId || location.pathname.includes('/edit')) {
      const targetId = routeProductId || location.pathname.split('/products/')[1]?.split('/')[0];
      if (targetId) {
        const prod = productService.getProductById(targetId);
        if (prod) {
          setEditingProduct(prod);
          setIsProductModalOpen(true);
        }
      }
    }
  }, [location.pathname, routeProductId]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingProduct(item);
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    if (location.pathname.includes('/new') || location.pathname.includes('/edit')) {
      navigate('/admin/products', { replace: true });
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    productService.toggleStatus(id);
    loadProducts();
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    showToast(`Product status changed to ${newStatus}`, 'info');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the boutique catalog?`)) {
      productService.deleteProduct(id);
      loadProducts();
      showToast(`Removed "${name}"`, 'info');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Products Management</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Catalog inventory of {products.length} handwoven sarees, kurtis, dresses, and jewellery
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '440px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by product name, SKU, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '36px', fontSize: '13px' }}
          />
          <Search size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-light)' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '13px' }}
          >
            <option value="all">All Categories</option>
            {categoryService.getAllCategories().map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '13px' }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', width: '60px' }}>Image</th>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>SKU</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Price</th>
                <th style={{ padding: '12px 16px' }}>Stock</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products matching your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        style={{ width: '48px', height: '62px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-espresso)' }}>
                        {item.name}
                      </strong>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        {item.featured && <span className="badge badge-sand" style={{ fontSize: '9px' }}>Featured</span>}
                        {item.newArrival && <span className="badge badge-new" style={{ fontSize: '9px' }}>New</span>}
                        {item.bestSeller && <span className="badge badge-sale" style={{ fontSize: '9px' }}>Best Seller</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-sand">{item.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
                        ₹{(item.salePrice || item.price).toLocaleString('en-IN')}
                      </strong>
                      {item.salePrice && item.salePrice < item.price && (
                        <span style={{ display: 'block', fontSize: '11px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: item.stock === 0 ? 'var(--danger-bg)' : item.stock <= 3 ? 'var(--warning-bg)' : 'var(--success-bg)',
                          color: item.stock === 0 ? 'var(--danger)' : item.stock <= 3 ? 'var(--warning)' : 'var(--success)',
                          borderColor: item.stock === 0 ? 'rgba(153, 27, 27, 0.25)' : item.stock <= 3 ? 'rgba(180, 105, 14, 0.25)' : 'rgba(27, 94, 58, 0.25)',
                          fontSize: '10.5px',
                        }}
                      >
                        <span className="badge-dot" />
                        {item.stock === 0 ? 'Out of Stock' : `${item.stock} in stock`}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          color: item.status === 'published' ? 'var(--success)' : 'var(--text-light)',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                        title="Click to toggle status"
                      >
                        {item.status === 'published' ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        <span style={{ textTransform: 'capitalize' }}>{item.status}</span>
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          to={`/product/${item.id}`}
                          target="_blank"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="View on Customer Store"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="btn btn-sand btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px', color: 'var(--danger)' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Creation / Edit Modal Dialog with Background Blur & Scroll Lock */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={handleCloseModal}
        initialProduct={editingProduct}
        onSuccess={loadProducts}
      />
    </div>
  );
};
