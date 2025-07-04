// jQuery for Social Media Boosting Dashboard

// Sample data
const orders = [
    {
        id: '#BOOST001',
        platform: 'Instagram',
        service: 'Followers',
        username: 'user123',
        status: 'In Progress',
        price: '15,000 MMK',
        booster: '1000'
    },
    {
        id: '#BOOST002',
        platform: 'Facebook',
        service: 'Page Likes',
        username: 'page456',
        status: 'Completed',
        price: '25,000 MMK',
        booster: '2500'
    },
    {
        id: '#BOOST003',
        platform: 'TikTok',
        service: 'Followers',
        username: 'tiktok_user',
        status: 'Pending',
        price: '12,000 MMK',
        booster: '1000'
    },
    {
        id: '#BOOST004',
        platform: 'Instagram',
        service: 'Likes',
        username: 'insta_user',
        status: 'Completed',
        price: '18,000 MMK',
        booster: '3000'
    },
    {
        id: '#BOOST005',
        platform: 'Facebook',
        service: 'Post Likes',
        username: 'fb_user',
        status: 'In Progress',
        price: '20,000 MMK',
        booster: '2000'
    }
];

// Services data for different platforms
const services = {
    instagram: [
        { name: 'Instagram Followers', price: 5000, unit: 'per 1000', description: 'Real Instagram followers' },
        { name: 'Instagram Likes', price: 3000, unit: 'per 1000', description: 'High-quality Instagram likes' },
        { name: 'Instagram Comments', price: 8000, unit: 'per 100', description: 'Engaging Instagram comments' },
        { name: 'Instagram Views', price: 2000, unit: 'per 1000', description: 'Video views for Instagram' },
        { name: 'Instagram Story Views', price: 1500, unit: 'per 1000', description: 'Reels views and engagement' }
    ],
    facebook: [
        { name: 'Facebook Page Likes', price: 4000, unit: 'per 1000', description: 'Real Facebook page likes' },
        { name: 'Facebook Post Likes', price: 2500, unit: 'per 1000', description: 'Post engagement likes' },
        { name: 'Facebook Shares', price: 6000, unit: 'per 100', description: 'Post sharing service' },
        { name: 'Facebook Comments', price: 7000, unit: 'per 100', description: 'Engaging comments' }
    ],
    tiktok: [
        { name: 'TikTok Followers', price: 6000, unit: 'per 1000', description: 'Real TikTok followers' },
        { name: 'TikTok Likes', price: 3500, unit: 'per 1000', description: 'TikTok video likes' },
        { name: 'TikTok Views', price: 1500, unit: 'per 1000', description: 'Video view count' },
        { name: 'TikTok Comments', price: 9000, unit: 'per 100', description: 'Engaging comments' }
    ]
};

// Order state
let currentOrder = {
    selectedPlatform: null,
    selectedService: null,
    quantity: 1000,
    deliverySpeed: 'normal',
    price: 0
};

// DOM elements using jQuery
const $loginPage = $('#loginPage');
const $dashboardPage = $('#dashboardPage');
const $loginForm = $('#loginForm');
const $logoutBtn = $('#logoutBtn');
const $mobileMenuBtn = $('#mobileMenuBtn');
const $sidebar = $('#sidebar');
const $sidebarLinks = $('.sidebar-link');
const $ordersTableBody = $('#ordersTableBody');

// Place Order elements
const $platformOptions = $('.platform-option');
const $serviceOptions = $('#serviceOptions');
const $orderSummary = $('#orderSummary');
const $orderForm = $('#orderForm');
const $quantity = $('#quantity');
const $decreaseQuantity = $('#decreaseQuantity');
const $increaseQuantity = $('#increaseQuantity');
const $deliverySpeed = $('#deliverySpeed');
const $placeOrderBtn = $('#placeOrderBtn');

// Settings elements
const $settingsNavBtns = $('.settings-nav-btn');
const $settingsSections = $('.settings-section');
const $profileForm = $('#profileForm');
const $passwordForm = $('#passwordForm');

// Login functionality
$loginForm.on('submit', function(e) {
    e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    
    if (username && password) {
        // Simple validation - in real app, you'd check against backend
        $loginPage.addClass('hidden');
        $dashboardPage.removeClass('hidden');
        populateOrdersTable();
    } else {
        alert('Please enter both username and password');
    }
});

// Logout functionality
$logoutBtn.on('click', function() {
    $dashboardPage.addClass('hidden');
    $loginPage.removeClass('hidden');
    $('#username').val('');
    $('#password').val('');
});

// Mobile menu toggle
$mobileMenuBtn.on('click', function() {
    $sidebar.toggleClass('show');
    if ($sidebar.hasClass('show')) {
        $sidebar.removeClass('-translate-x-full');
        $('#sidebarOverlay').removeClass('hidden');
    } else {
        $sidebar.addClass('-translate-x-full');
        $('#sidebarOverlay').addClass('hidden');
    }
});

// Close sidebar when clicking overlay or close button
$('#sidebarOverlay, #closeSidebarBtn').on('click', function() {
    $sidebar.removeClass('show').addClass('-translate-x-full');
    $('#sidebarOverlay').addClass('hidden');
});

// Close mobile menu when clicking outside (except sidebar and menu button)
$(document).on('click', function(e) {
    if (!$(e.target).closest('#sidebar, #mobileMenuBtn').length && $sidebar.hasClass('show') && window.innerWidth < 1024) {
        $sidebar.removeClass('show').addClass('-translate-x-full');
        $('#sidebarOverlay').addClass('hidden');
    }
});

// Close mobile menu when clicking on a sidebar link
$sidebarLinks.on('click', function() {
    if (window.innerWidth < 1024) {
        $sidebar.removeClass('show').addClass('-translate-x-full');
        $('#sidebarOverlay').addClass('hidden');
    }
});

// Sidebar navigation
$sidebarLinks.on('click', function(e) {
    e.preventDefault();
    // Remove active class from all links
    $sidebarLinks.removeClass('active');
    // Add active class to clicked link
    $(this).addClass('active');
    // Hide all content sections
    $('#dashboardContent').addClass('hidden');
    $('#ordersContent').addClass('hidden');
    $('#placeOrderContent').addClass('hidden');
    $('#helpContent').addClass('hidden');
    $('#settingsContent').addClass('hidden');
    // Show the selected section
    const page = $(this).data('page');
    if (page === 'dashboard') {
        $('#dashboardContent').removeClass('hidden');
    } else if (page === 'orders') {
        $('#ordersContent').removeClass('hidden');
    } else if (page === 'place-order') {
        $('#placeOrderContent').removeClass('hidden');
        initializeOrderPage();
    } else if (page === 'help') {
        $('#helpContent').removeClass('hidden');
    } else if (page === 'settings') {
        $('#settingsContent').removeClass('hidden');
        initializeSettingsPage();
    }
    // Always show sidebar (remove -translate-x-full)
    $sidebar.removeClass('-translate-x-full');
});

// Initialize order page
function initializeOrderPage() {
    // Reset order state
    currentOrder = {
        selectedPlatform: null,
        selectedService: null,
        quantity: 1000,
        deliverySpeed: 'normal',
        price: 0
    };
    
    // Reset UI
    $platformOptions.removeClass('border-indigo-500 bg-indigo-50').addClass('border-gray-200');
    $serviceOptions.empty();
    updateOrderSummary();
    $quantity.val(1000);
    $deliverySpeed.val('normal');
    $orderForm[0].reset();
}

// Platform selection
$platformOptions.on('click', function() {
    const selectedPlatform = $(this).data('platform');
    
    // Update UI
    $platformOptions.removeClass('border-indigo-500 bg-indigo-50').addClass('border-gray-200');
    $(this).removeClass('border-gray-200').addClass('border-indigo-500 bg-indigo-50');
    
    // Update order state
    currentOrder.selectedPlatform = selectedPlatform;
    currentOrder.selectedService = null;
    
    // Populate services
    populateServices(selectedPlatform);
    
    // Update summary
    updateOrderSummary();
});

// Populate services based on selected platform
function populateServices(platform) {
    $serviceOptions.empty();
    
    if (services[platform]) {
        services[platform].forEach((service, index) => {
            const serviceElement = $(`
                <div class="service-option cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors" data-service-index="${index}">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-medium text-gray-900">${service.name}</h3>
                            <p class="text-sm text-gray-600">${service.description}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold text-indigo-600">${service.price.toLocaleString()} MMK</div>
                            <div class="text-xs text-gray-500">${service.unit}</div>
                        </div>
                    </div>
                </div>
            `);
            $serviceOptions.append(serviceElement);
        });
        
        // Add click handlers
        $('.service-option').on('click', function() {
            $('.service-option').removeClass('border-indigo-500 bg-indigo-50').addClass('border-gray-200');
            $(this).removeClass('border-gray-200').addClass('border-indigo-500 bg-indigo-50');
            
            const serviceIndex = $(this).data('service-index');
            currentOrder.selectedService = services[platform][serviceIndex];
            updateOrderSummary();
        });
    }
}

// Quantity controls
$decreaseQuantity.on('click', function() {
    let currentQty = parseInt($quantity.val());
    if (currentQty > 100) {
        $quantity.val(currentQty - 100);
        currentOrder.quantity = currentQty - 100;
        updateOrderSummary();
    }
});

$increaseQuantity.on('click', function() {
    let currentQty = parseInt($quantity.val());
    $quantity.val(currentQty + 100);
    currentOrder.quantity = currentQty + 100;
    updateOrderSummary();
});

$quantity.on('input', function() {
    currentOrder.quantity = parseInt($(this).val()) || 0;
    updateOrderSummary();
});

// Delivery speed change
$deliverySpeed.on('change', function() {
    currentOrder.deliverySpeed = $(this).val();
    updateOrderSummary();
});

// Update order summary
function updateOrderSummary() {
    if (!currentOrder.selectedPlatform || !currentOrder.selectedService) {
        $orderSummary.html(`
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-2">📋</div>
                <p>Select a service to see order details</p>
            </div>
        `);
        return;
    }
    
    // Calculate price
    const basePrice = currentOrder.selectedService.price;
    const quantity = currentOrder.quantity;
    const unit = currentOrder.selectedService.unit;
    
    let priceMultiplier = 1;
    if (unit.includes('1000')) {
        priceMultiplier = quantity / 1000;
    } else if (unit.includes('100')) {
        priceMultiplier = quantity / 100;
    }
    
    let deliveryMultiplier = 1;
    if (currentOrder.deliverySpeed === 'fast') {
        deliveryMultiplier = 1.2;
    } else if (currentOrder.deliverySpeed === 'express') {
        deliveryMultiplier = 1.5;
    }
    
    const totalPrice = Math.round(basePrice * priceMultiplier * deliveryMultiplier);
    currentOrder.price = totalPrice;
    
    // Update summary display
    $orderSummary.html(`
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Platform:</span>
                <span class="font-medium">${currentOrder.selectedPlatform.charAt(0).toUpperCase() + currentOrder.selectedPlatform.slice(1)}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Service:</span>
                <span class="font-medium">${currentOrder.selectedService.name}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Quantity:</span>
                <span class="font-medium">${quantity.toLocaleString()}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Delivery:</span>
                <span class="font-medium">${$deliverySpeed.find('option:selected').text()}</span>
            </div>
            <hr class="border-gray-200">
            <div class="flex justify-between items-center">
                <span class="text-lg font-semibold">Total Price:</span>
                <span class="text-2xl font-bold text-indigo-600">${totalPrice.toLocaleString()} MMK</span>
            </div>
        </div>
    `);
}

// Order form submission
$orderForm.on('submit', function(e) {
    e.preventDefault();
    
    if (!currentOrder.selectedPlatform || !currentOrder.selectedService) {
        alert('Please select a platform and service first.');
        return;
    }
    
    // Validate required fields
    const username = $('#accountUsername').val();
    const contactNumber = $('#contactNumber').val();
    const agreeTerms = $('#agreeTerms').is(':checked');
    
    if (!username || !contactNumber || !agreeTerms) {
        alert('Please fill in all required fields and agree to terms.');
        return;
    }
    
    // Collect order data
    const orderData = {
        ...currentOrder,
        username: username,
        password: $('#accountPassword').val(),
        contactNumber: contactNumber,
        email: $('#contactEmail').val(),
        additionalNotes: $('#additionalNotes').val(),
        orderId: 'BOOST' + Date.now(),
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    // Show success message
    showOrderSuccess(orderData);
    
    // Reset form
    $orderForm[0].reset();
    initializeOrderPage();
});

// Show order success
function showOrderSuccess(orderData) {
    const successHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                    <p class="text-gray-600 mb-6">Your order has been submitted and will be processed soon.</p>
                    
                    <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <div class="space-y-2 text-sm">
                            <div><strong>Order ID:</strong> ${orderData.orderId}</div>
                            <div><strong>Service:</strong> ${orderData.selectedService.name}</div>
                            <div><strong>Quantity:</strong> ${orderData.quantity.toLocaleString()}</div>
                            <div><strong>Total:</strong> ${orderData.price.toLocaleString()} MMK</div>
                        </div>
                    </div>
                    
                    <button id="closeSuccessModal" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(successHtml);
    
    $('#closeSuccessModal').on('click', function() {
        $('.fixed.inset-0').remove();
    });
}

// Populate orders table
function populateOrdersTable() {
    $ordersTableBody.empty();
    
    $.each(orders, function(index, order) {
        let statusClass = 'status-btn';
        if (order.status === 'Pending') statusClass += ' pending';
        else if (order.status === 'In Progress') statusClass += ' in-progress';
        else if (order.status === 'Completed') statusClass += ' completed';
        
        const row = $(`
            <tr class="hover: transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium">${order.id}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm">${order.platform}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm">${order.service}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm">${order.username}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${statusClass}">${order.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium">${order.price}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm">${order.booster}</span>
                </td>
            </tr>
        `);
        $ordersTableBody.append(row);
    });
}

// Initialize when document is ready
$(document).ready(function() {
    // Set first sidebar link as active
    if ($sidebarLinks.length > 0) {
        $sidebarLinks.first().addClass('active');
    }
});

// Initialize settings page
function initializeSettingsPage() {
    // Show profile section by default
    showSettingsSection('profile');
    
    // Set first nav button as active
    $settingsNavBtns.removeClass('active');
    $settingsNavBtns.first().addClass('active');
}

// Settings navigation
$settingsNavBtns.on('click', function() {
    const section = $(this).data('section');
    
    // Update navigation buttons
    $settingsNavBtns.removeClass('active');
    $(this).addClass('active');
    
    // Show selected section
    showSettingsSection(section);
});

// Show settings section
function showSettingsSection(section) {
    $settingsSections.addClass('hidden');
    $(`#${section}Section`).removeClass('hidden');
}

// Profile form submission
$profileForm.on('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        fullName: $('#fullName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        bio: $('#bio').val()
    };
    
    // Show success message
    showSettingsSuccess('Profile updated successfully!');
});

// Password form submission
$passwordForm.on('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
        showSettingsError('Please fill in all password fields.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showSettingsError('New passwords do not match.');
        return;
    }
    
    if (newPassword.length < 8) {
        showSettingsError('Password must be at least 8 characters long.');
        return;
    }
    
    // Show success message
    showSettingsSuccess('Password updated successfully!');
    
    // Clear form
    $passwordForm[0].reset();
});

// Show settings success message
function showSettingsSuccess(message) {
    const successHtml = `
        <div class="fixed top-4 right-4 bg-green-100 border border-green-400 text-black px-4 py-3 rounded-lg shadow-lg z-50">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    $('body').append(successHtml);
    
    // Remove after 3 seconds
    setTimeout(() => {
        $('.fixed.top-4.right-4').remove();
    }, 3000);
}

// Show settings error message
function showSettingsError(message) {
    const errorHtml = `
        <div class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    $('body').append(errorHtml);
    
    // Remove after 3 seconds
    setTimeout(() => {
        $('.fixed.top-4.right-4').remove();
    }, 3000);
}

// Handle toggle switches
$(document).on('change', 'input[type="checkbox"]', function() {
    const isChecked = $(this).is(':checked');
    const toggleDiv = $(this).siblings('div');
    
    if (isChecked) {
        toggleDiv.addClass('peer-checked:bg-indigo-600');
    } else {
        toggleDiv.removeClass('peer-checked:bg-indigo-600');
    }
});

// Handle session termination
$(document).on('click', '.text-red-600', function() {
    if ($(this).text() === 'Terminate') {
        if (confirm('Are you sure you want to terminate this session?')) {
            $(this).closest('.flex.items-center.justify-between').fadeOut();
            showSettingsSuccess('Session terminated successfully!');
        }
    }
});

// Handle payment method removal
$(document).on('click', '.text-red-600', function() {
    if ($(this).text() === 'Remove') {
        if (confirm('Are you sure you want to remove this payment method?')) {
            $(this).closest('.flex.items-center.justify-between').fadeOut();
            showSettingsSuccess('Payment method removed successfully!');
        }
    }
});

// Handle add funds button
$(document).on('click', 'button:contains("Add Funds")', function() {
    showAddFundsModal();
});

// Handle export data button
$(document).on('click', 'button:contains("Export")', function() {
    showSettingsSuccess('Data export started. You will receive an email shortly.');
});

// Handle delete account button
$(document).on('click', 'button:contains("Delete")', function() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        showSettingsError('Account deletion requires additional verification. Please contact support.');
    }
});

// Show add funds modal
function showAddFundsModal() {
    const modalHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Add Funds</h2>
                    <p class="text-gray-600 mb-6">Choose your payment method and amount</p>
                    
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Amount (MMK)</label>
                            <input type="number" id="fundAmount" min="1000" step="1000" value="10000"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select id="paymentMethod"
                                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                                <option>KBZ Pay</option>
                                <option>Wave Pay</option>
                                <option>AYA Pay</option>
                                <option>CB Pay</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button id="cancelAddFunds" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button id="confirmAddFunds" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            Add Funds
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHtml);
    
    $('#cancelAddFunds, #confirmAddFunds').on('click', function() {
        if ($(this).attr('id') === 'confirmAddFunds') {
            const amount = $('#fundAmount').val();
            const method = $('#paymentMethod').val();
            showSettingsSuccess(`Fund request sent for ${amount} MMK via ${method}`);
        }
        $('.fixed.inset-0').remove();
    });
}