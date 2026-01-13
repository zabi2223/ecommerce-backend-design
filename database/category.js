import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual populate
categorySchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'category',
});

const Category = mongoose.model("category", categorySchema);
export default Category;
