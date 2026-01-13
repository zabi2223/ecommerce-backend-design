// ================= Messages Auto-Hide =================
const msg = document.getElementById('message');
if (msg) {
    setTimeout(() => {
        msg.style.transition = "opacity 0.5s";
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 500);
    }, 5000);
}

// ================= Password Validation =================
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

let confirmTouched = false;

function validatePassword() {
    if (!password) return true;
    const value = password.value;
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    if (!regex.test(value)) {
        passwordError?.classList.remove('hidden');
        return false;
    } else {
        passwordError?.classList.add('hidden');
        return true;
    }
}

function validateConfirmPassword() {
    if (!confirmPassword || !confirmTouched) return true;
    if (confirmPassword.value !== password.value) {
        confirmPasswordError?.classList.remove('hidden');
        return false;
    } else {
        confirmPasswordError?.classList.add('hidden');
        return true;
    }
}

if (password) {
    password.addEventListener('input', () => {
        validatePassword();
        validateConfirmPassword();
    });
}
if (confirmPassword) {
    confirmPassword.addEventListener('input', () => {
        confirmTouched = true;
        validateConfirmPassword();
    });
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        if (!validatePassword() || !validateConfirmPassword()) e.preventDefault();
    });
}

// ================= Profile Dropdown =================
document.addEventListener('DOMContentLoaded', () => {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target)) profileDropdown.classList.add('hidden');
        });
    }
});

// ================= Search =================
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('search-results');

if (searchInput) {
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (!query) {
            resultsDiv.innerHTML = '';
            resultsDiv.style.display = 'none';
            return;
        }

        try {
            const res = await fetch(`/user/search?q=${encodeURIComponent(query)}`);
            const products = await res.json();

            if (products.length === 0) {
                resultsDiv.innerHTML = '<div class="p-2 text-gray-500">No products found</div>';
            } else {
                resultsDiv.innerHTML = products.map(p => `
                    <div class="p-2 hover:bg-gray-100 cursor-pointer"
                         onclick="window.location='/user/product/${p.category}'">
                        <strong>${p.name}</strong> - ${p.brand}
                    </div>
                `).join('');
            }

            resultsDiv.style.display = 'block';
        } catch (err) {
            console.error('Search fetch error:', err);
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
            resultsDiv.style.display = 'none';
        }
    });
}

// ================= Products Filtering =================
let allProducts = window.allProducts || [];
let filteredProducts = [...allProducts];

function applyFilters() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    // Only run if the filter inputs exist on the page
    if (!minPriceInput || !maxPriceInput) return;

    const selectedBrands = Array.from(document.querySelectorAll('.brand-checkbox:checked'))
        .map(cb => cb.value);

    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    filteredProducts = allProducts.filter(p => {
        const matchBrand = selectedBrands.length ? selectedBrands.includes(p.brand) : true;
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;
        return matchBrand && matchPrice;
    });

    // Directly render filtered products
    renderProducts(filteredProducts);
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return; // safety check

    // optional empty state div
    let emptyState = document.getElementById('empty-state');
    if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = "empty-state";
        emptyState.className = "col-span-full text-center py-8 hidden";
        container.parentElement.insertBefore(emptyState, container.nextSibling);
        emptyState.innerHTML = `
            <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 text-lg">No products found</p>
            <p class="text-gray-500">Try adjusting your filters</p>
        `;
    }

    container.innerHTML = "";

    if (!products.length) {
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    products.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('border', 'p-4', 'rounded-lg', 'flex', 'flex-col');
        div.innerHTML = `
            <img src="/user/product/image/${p._id}" alt="${p.name}" class="mb-2 w-full h-48 object-cover rounded" />
            <h3 class="text-lg font-semibold">${p.name}</h3>
            <p class="text-sm text-gray-500">${p.brand}</p>
            <p class="text-gray-900 font-semibold">$${p.price}</p>
            <button class="mt-2 bg-blue-600 text-white py-1.5 rounded add-to-cart-btn" data-id="${p._id}">Add to Cart</button>
        `;
        container.appendChild(div);
    });

    const productCount = document.getElementById('product-count');
    if (productCount) productCount.innerText = products.length;
}

// ================= Event Listeners =================
document.addEventListener('DOMContentLoaded', () => {
    const brandCheckboxes = document.querySelectorAll('.brand-checkbox');
    brandCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    if (minPriceInput) minPriceInput.addEventListener('change', applyFilters);
    if (maxPriceInput) maxPriceInput.addEventListener('change', applyFilters);

    // initial render
    applyFilters();
});
