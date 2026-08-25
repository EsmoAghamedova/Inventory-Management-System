import "./AddStock.css";
import { useState } from "react";
import {
  BadgeDollarSign,
  Boxes,
  CloudUpload,
  ImagePlus,
  Info,
  Plus,
} from "lucide-react";

const AddStock = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    sku: "",
    description: "",
    unitCost: "",
    sellingPrice: "",
    quantity: "",
    threshold: "10",
    supplier: "",
  });
  const [imageName, setImageName] = useState("");
  const updateField = (event) =>
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const unitCost = Number(formData.unitCost) || 0;
  const sellingPrice = Number(formData.sellingPrice) || 0;
  const profit = sellingPrice - unitCost;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : null;
  const handleSubmit = (event) => event.preventDefault();

  return (
    <section className="add-stock-page">
      <header className="page-head">
        <h2>New Product Entry</h2>
        <p>
          Fill in the details below to add a new item to your inventory catalog.
        </p>
      </header>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-column">
          <section className="form-card general-info">
            <div className="form-heading">
              <Info size={17} aria-hidden="true" />
              <h3>General Information</h3>
            </div>
            <div className="form-fields">
              <div className="form-group full-width">
                <label htmlFor="product-name">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  id="product-name"
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={updateField}
                  placeholder="e.g. Ergonomic Office Chair"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={updateField}
                  >
                    <option value="">Select category...</option>
                    <option>Furniture</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                    <option>Food</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="sku">
                    SKU / Product ID <span className="required">*</span>
                  </label>
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    value={formData.sku}
                    onChange={updateField}
                    placeholder="E.G. FUR-CHR-001"
                    required
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="description">Product Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={updateField}
                  placeholder="Enter a detailed description of the product features, dimensions, and specifications."
                  rows="4"
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="product-image">Product Images</label>
                <label className="upload-box" htmlFor="product-image">
                  <CloudUpload size={24} aria-hidden="true" />
                  <strong>Click to upload or drag and drop</strong>
                  <span>SVG, PNG, JPG or GIF (max. 5MB)</span>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml"
                    onChange={(event) =>
                      setImageName(event.target.files?.[0]?.name || "")
                    }
                  />
                </label>
                {imageName ? (
                  <div className="image-preview">
                    <ImagePlus size={17} aria-hidden="true" />
                    <span>{imageName}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>

        <aside className="form-column side-sections">
          <section className="form-card setup-card">
            <div className="form-heading">
              <BadgeDollarSign size={18} aria-hidden="true" />
              <h3>Pricing Setup</h3>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="unit-cost">Unit Cost</label>
                <div className="price-input">
                  <span>$</span>
                  <input
                    id="unit-cost"
                    name="unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.unitCost}
                    onChange={updateField}
                  />
                  <strong>{unitCost.toFixed(2)}</strong>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="selling-price">Selling Price</label>
                <div className="price-input">
                  <span>$</span>
                  <input
                    id="selling-price"
                    name="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.sellingPrice}
                    onChange={updateField}
                  />
                  <strong>{sellingPrice.toFixed(2)}</strong>
                </div>
              </div>
              <div className="profit-box">
                <div className="profit-row">
                  <span>Est. Profit Margin</span>
                  <strong>
                    {margin === null ? "--" : `${margin.toFixed(1)}%`}
                  </strong>
                </div>
                <div className="profit-row">
                  <span>Est. Profit per Unit</span>
                  <strong>${profit.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="form-card setup-card">
            <div className="form-heading">
              <Boxes size={18} aria-hidden="true" />
              <h3>Stock Management</h3>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="quantity">Initial Quantity</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={updateField}
                />
              </div>
              <div className="form-group">
                <label htmlFor="threshold">
                  Low Stock Alert Threshold <Info size={13} aria-label="Help" />
                </label>
                <input
                  id="threshold"
                  name="threshold"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={formData.threshold}
                  onChange={updateField}
                />
              </div>
              <div className="form-group">
                <label htmlFor="supplier">Primary Supplier</label>
                <select
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={updateField}
                >
                  <option value="">Select supplier...</option>
                  <option>Supplier One</option>
                  <option>Supplier Two</option>
                  <option>Supplier Three</option>
                </select>
              </div>
              <button className="add-supplier" type="button">
                <Plus size={16} aria-hidden="true" /> Add New Supplier
              </button>
            </div>
          </section>

          <div className="form-actions">
            <button className="button secondary-button" type="button">
              Cancel
            </button>
            <button className="button primary-button" type="submit">
              Save Product
            </button>
          </div>
        </aside>
      </form>
    </section>
  );
};

export default AddStock;
