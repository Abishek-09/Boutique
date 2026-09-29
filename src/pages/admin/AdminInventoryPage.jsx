import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Plus, Minus, Search, Save, Check, AlertTriangle } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useApp } from '../../context/AppContext';
import { ProductFormModal } from '../../components/product/ProductFormModal';

export const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockEdits, setStockEdits] = useState({});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { showToast } = useApp();

  const categories = categoryService.getAllCategories();

  const loadProducts = () => {
    const list = productService.getAllProducts();
    setProducts(list);
    const initialEdits = {};
    list.forEach((p) => {
      initialEdits[p.id] = p.stock;
    });
    setStockEdits(initialEdits);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (id, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setStockEdits((prev) => ({ ...prev, [id]: num }));
  };

  const handleStepDelta = (id, delta) => {
    setStockEdits((prev) => {
      const current = prev[id] !== undefined ? prev[id] : 0;
      return { ...prev, [id]: Math.max(0, current + delta) };
    });
  };

  const handleSaveStock = (id, name) => {
    const newStock = stockEdits[id];
    productService.updateStock(id, newStock);
    loadProducts();
    showToast(`Updated "${name}" stock to ${newStock}`, 'success');
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '0.04em', margin: '0 0 4px' }}>Inventory & Stock Control</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Quickly adjust stock quantities, monitor low inventory, and maintain atelier supply.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Add New Piece
          </button>
        </div>
      </div>

      {/* Search toolbar */}
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: 1, maxWidth: '640px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search inventory by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '36px', fontSize: '13px' }}
            />
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-light)' }} />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '150px', fontSize: '13px' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.name.toLowerCase()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing <strong>{filtered.length}</strong> inventory records
        </span>
      </div>

      {/* Table Card */}
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
                <th style={{ padding: '12px 16px', width: '56px' }}>Image</th>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>SKU</th>
                <th style={{ padding: '12px 16px' }}>Available Sizes</th>
                <th style={{ padding: '12px 16px' }}>Status Indicator</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Stock Adjustment</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Save</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const currentStock = stockEdits[item.id] !== undefined ? stockEdits[item.id] : item.stock;
                const isChanged = currentStock !== item.stock;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        style={{ width: '44px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-espresso)' }}>
                        {item.name}
                      </strong>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        className="badge badge-sand"
                        style={{
                          textTransform: 'capitalize',
                          fontWeight: 600,
                          fontSize: '11px',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {item.sku}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {item.sizes?.map((s) => (
                          <span key={s} className="badge badge-sand" style={{ fontSize: '10px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {currentStock === 0 ? (
                        <span className="badge badge-danger">OUT OF STOCK</span>
                      ) : currentStock <= 3 ? (
                        <span className="badge badge-warning">LOW STOCK ({currentStock})</span>
                      ) : (
                        <span className="badge badge-success">IN STOCK ({currentStock})</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', backgroundColor: '#FFFFFF' }}>
                        <button
                          type="button"
                          onClick={() => handleStepDelta(item.id, -1)}
                          style={{ padding: '4px 10px', color: 'var(--text-espresso)' }}
                          aria-label="Decrease stock"
                        >
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) => handleStockChange(item.id, e.target.value)}
                          style={{
                            width: '56px',
                            textAlign: 'center',
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '4px 0',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleStepDelta(item.id, 1)}
                          style={{ padding: '4px 10px', color: 'var(--text-espresso)' }}
                          aria-label="Increase stock"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleSaveStock(item.id, item.name)}
                        className={`btn ${isChanged ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                        disabled={!isChanged}
                      >
                        <Save size={13} /> {isChanged ? 'Save' : 'Saved'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Creation Modal Dialog with Background Blur & Scroll Lock */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={loadProducts}
      />
    </div>
  );
};
