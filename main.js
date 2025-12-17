let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
// العناصر
const openBookingBtn = document.getElementById('addBookingBtn');
const bookingPopup = document.getElementById('bookingPopup');
const closePopup = document.getElementById('closePopup');
const bookingForm = document.getElementById('bookingForm');
const custName = document.getElementById('custName');
const phone = document.getElementById('phone');
const submitBtn = document.getElementById('submitBtn');
const bookingList = document.getElementById('bookingList');
const searchInput = document.getElementById('search');

let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let editIndex = null;

// فتح وإغلاق الـ modal
openBookingBtn.addEventListener('click', () => {
    bookingPopup.style.display = 'flex';
});

closePopup.addEventListener('click', () => {
    bookingPopup.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if(e.target === bookingPopup) bookingPopup.style.display = 'none';
});

// إضافة / تعديل حجز
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = custName.value.trim();
    const phoneNum = phone.value.trim();
    if(!name || !phoneNum) return;

    const booking = { name, phone: phoneNum };

    if(editIndex === null){
        bookings.push(booking);
    } else {
        bookings[editIndex] = booking;
        editIndex = null;
        submitBtn.textContent = '➕ إضافة';
    }

    custName.value = '';
    phone.value = '';

    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderBookings();
});

// عرض الحجوزات
function renderBookings(){
    const filter = searchInput.value.toLowerCase();
    bookingList.innerHTML = '';

    bookings.forEach((b, i) => {
        if(!b.name.toLowerCase().includes(filter) && !b.phone.includes(filter)) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${b.name}</strong><br>${b.phone}</span>
            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;

        li.querySelector('.edit').addEventListener('click', () => {
            custName.value = b.name;
            phone.value = b.phone;
            editIndex = i;
            submitBtn.textContent = '🔄 تعديل';
        });

        li.querySelector('.delete').addEventListener('click', () => {
            bookings.splice(i, 1);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            renderBookings();
        });

        bookingList.appendChild(li);
    });
}

// البحث الفوري
searchInput.addEventListener('input', renderBookings);

// عرض عند التحميل
renderBookings();
