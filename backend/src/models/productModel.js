import { mongoose } from 'mongoose'

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
        },
        barcode: {
            type: String,
            required: [true, 'Barcode is required'],
        },
        brand: {
            type: String,
            required: [true, 'Brand name is required'],
        },
        import_price: {
            type: String,
            required: [true, 'Import price is required'],
        },
        retail_price: {
            type: String,
            required: [true, 'Retail price is required'],
        },
        category: {
            type: String,
            required: [true, 'Category name is required'],
        },
    },
    { timestamps: true },
)

const Product = mongoose.model('Product', productSchema)

export { Product }
