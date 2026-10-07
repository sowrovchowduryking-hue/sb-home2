let currentUser = JSON.parse(localStorage.getItem("sbUser")) || null;
let homes = JSON.parse(localStorage.getItem("sbHomes")) || [];
let bookings = JSON.parse(localStorage.getItem("sbBookings")) || [];

let authMode = "login";

const defaultAvatar =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function hideAll() {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
}

function showScreen(id) {
  hideAll();
  document.getElementById(id).classList.add("active");
}

function goWelcome() {
  showScreen("welcome");
}

function showAuth(mode) {
  authMode = mode;
  showScreen("auth");

  document.getElementById("authTitle").textContent =
    mode === "login" ? "Login" : "Create Account";

  document.getElementById("registerFields").style.display =
    mode === "register" ? "block" : "none";

  document.getElementById("authSwitch").innerHTML =
    mode === "login"
      ? `<p>নতুন account নেই?</p>
         <button onclick="showAuth('register')">CREATE ACCOUNT</button>`
      : `<p>আগে account আছে?</p>
         <button onclick="showAuth('login')">LOGIN</button>`;
}

function submitAuth() {

  const phone = document.getElementById("authPhone").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  if (!phone || !password) {
    alert("Phone এবং Password দিন।");
    return;
  }

  if (authMode === "register") {

    const name = document.getElementById("regName").value.trim();

    if (!name) {
      alert("আপনার নাম দিন।");
      return;
    }

    currentUser = {
      name,
      phone,
      password,
      photo: defaultAvatar
    };

    localStorage.setItem("sbUser", JSON.stringify(currentUser));

    alert("Account তৈরি হয়েছে!");
    loadDashboard();

  } else {

    const saved = JSON.parse(localStorage.getItem("sbUser"));

    if (!saved) {
      alert("আগে Create Account করুন।");
      return;
    }

    if (saved.phone !== phone || saved.password !== password) {
      alert("Phone অথবা Password ভুল।");
      return;
    }

    currentUser = saved;
    loadDashboard();
  }
}

function facebookLogin() {
  alert(
    "Facebook Login-এর আসল OAuth চালু করতে Meta Developer App ID প্রয়োজন। এই prototype-এ button রাখা হয়েছে।"
  );
}

function loadDashboard() {

  if (!currentUser) {
    goWelcome();
    return;
  }

  document.getElementById("userName").textContent =
    currentUser.name;

  document.getElementById("userPhone").textContent =
    currentUser.phone;

  const photo = currentUser.photo || defaultAvatar;

  document.getElementById("miniAvatar").src = photo;
  document.getElementById("profileAvatar").src = photo;

  document.getElementById("profileName").value =
    currentUser.name;

  document.getElementById("profilePhone").value =
    currentUser.phone;

  showScreen("dashboard");
}

function logout() {
  currentUser = null;
  showScreen("welcome");
}

function openPage(id) {

  showScreen(id);

  if (id === "findHome") renderHomes();
  if (id === "myHomes") renderMyHomes();
  if (id === "bookings") renderBookings();

  if (id === "profile") {
    document.getElementById("profileName").value =
      currentUser.name;

    document.getElementById("profilePhone").value =
      currentUser.phone;

    document.getElementById("profileAvatar").src =
      currentUser.photo || defaultAvatar;
  }
}

function saveHome() {

  const title = document.getElementById("homeTitle").value.trim();
  const district = document.getElementById("district").value.trim();
  const upazila = document.getElementById("upazila").value.trim();
  const ward = document.getElementById("ward").value.trim();
  const area = document.getElementById("area").value.trim();
  const homeNumber = document.getElementById("homeNumber").value.trim();
  const rooms = document.getElementById("rooms").value.trim();
  const rent = document.getElementById("rent").value.trim();
  const ownerPhone = document.getElementById("ownerPhone").value.trim();
  const details = document.getElementById("homeDetails").value.trim();

  const photoInput = document.getElementById("homePhoto");

  if (!title || !district || !area || !rent || !ownerPhone) {
    alert("বাড়ির নাম, জেলা, এলাকা, ভাড়া এবং ফোন নম্বর দিন।");
    return;
  }

  function save(photo) {

    homes.push({
      id: Date.now(),
      owner: currentUser.phone,
      title,
      district,
      upazila,
      ward,
      area,
      homeNumber,
      rooms,
      rent,
      ownerPhone,
      details,
      photo
    });

    localStorage.setItem("sbHomes", JSON.stringify(homes));

    alert("🏠 বাড়ি সফলভাবে Save হয়েছে!");

    clearHomeForm();
    openPage("myHomes");
  }

  if (photoInput.files.length) {

    const reader = new FileReader();

    reader.onload = e => save(e.target.result);

    reader.readAsDataURL(photoInput.files[0]);

  } else {
    save("");
  }
}

function clearHomeForm() {

  [
    "homeTitle",
    "district",
    "upazila",
    "ward",
    "area",
    "homeNumber",
    "rooms",
    "rent",
    "ownerPhone",
    "homeDetails"
  ].forEach(id => {
    document.getElementById(id).value = "";
  });

  document.getElementById("homePhoto").value = "";
}

function renderHomes() {

  const container = document.getElementById("homeResults");

  const search =
    document.getElementById("searchBox").value.toLowerCase();

  const results = homes.filter(home => {

    const text =
      `${home.title} ${home.district} ${home.upazila}
       ${home.area} ${home.homeNumber}`.toLowerCase();

    return text.includes(search);
  });

  if (!results.length) {
    container.innerHTML =
      `<div class="empty">কোনো বাড়ি পাওয়া যায়নি।</div>`;
    return;
  }

  container.innerHTML =
    results.map(homeCard).join("");
}

function homeCard(home) {

  return `
    <div class="home-card">

      ${home.photo ? `<img src="${home.photo}">` : ""}

      <h3>🏠 ${home.title}</h3>

      <p>📍 ${home.district}, ${home.upazila || ""}
      , ${home.area}</p>

      <p>🏠 বাড়ি নম্বর:
      ${home.homeNumber || "দেওয়া হয়নি"}</p>

      <p>🛏️ রুম:
      ${home.rooms || "দেওয়া হয়নি"}</p>

      <p class="price">৳ ${home.rent} / মাস</p>

      <p>📞 ${home.ownerPhone}</p>

      <p>${home.details || ""}</p>

      <button class="book"
        onclick="bookHome(${home.id})">
        BOOK HOME
      </button>

    </div>
  `;
}

function renderMyHomes() {

  const container =
    document.getElementById("myHomeResults");

  const mine = homes.filter(
    home => home.owner === currentUser.phone
  );

  if (!mine.length) {
    container.innerHTML =
      `<div class="empty">
       আপনি এখনও কোনো বাড়ি Add করেননি।
       </div>`;
    return;
  }

  container.innerHTML = mine.map(home => `
    <div class="home-card">

      ${home.photo ? `<img src="${home.photo}">` : ""}

      <h3>🏠 ${home.title}</h3>

      <p>📍 ${home.district}, ${home.area}</p>

      <p class="price">
        ৳ ${home.rent} / মাস
      </p>

      <button class="delete"
        onclick="deleteHome(${home.id})">
        DELETE
      </button>

    </div>
  `).join("");
}

function deleteHome(id) {

  if (!confirm("এই বাড়িটি Delete করতে চান?")) return;

  homes = homes.filter(home => home.id !== id);

  localStorage.setItem("sbHomes", JSON.stringify(homes));

  renderMyHomes();
}

function bookHome(id) {

  const home = homes.find(h => h.id === id);

  if (!home) return;

  bookings.push({
    id: Date.now(),
    homeId: home.id,
    homeTitle: home.title,
    user: currentUser.name,
    phone: currentUser.phone,
    date: new Date().toLocaleDateString("bn-BD"),
    status: "Pending"
  });

  localStorage.setItem(
    "sbBookings",
    JSON.stringify(bookings)
  );

  alert("📋 Booking request পাঠানো হয়েছে!");

  openPage("bookings");
}

function renderBookings() {

  const container =
    document.getElementById("bookingResults");

  const mine = bookings.filter(
    booking => booking.phone === currentUser.phone
  );

  if (!mine.length) {
    container.innerHTML =
      `<div class="empty">
       আপনার কোনো Booking নেই।
       </div>`;
    return;
  }

  container.innerHTML = mine.map(booking => `
    <div class="home-card">

      <h3>🏠 ${booking.homeTitle}</h3>

      <p>👤 ${booking.user}</p>
      <p>📞 ${booking.phone}</p>
      <p>📅 ${booking.date}</p>
      <p>📌 Status:
        <b>${booking.status}</b>
      </p>

      <button class="delete"
        onclick="cancelBooking(${booking.id})">
        CANCEL
      </button>

    </div>
  `).join("");
}

function cancelBooking(id) {

  if (!confirm("Booking Cancel করতে চান?")) return;

  bookings = bookings.filter(
    booking => booking.id !== id
  );

  localStorage.setItem(
    "sbBookings",
    JSON.stringify(bookings)
  );

  renderBookings();
}

function updateProfile() {

  const name =
    document.getElementById("profileName").value.trim();

  const phone =
    document.getElementById("profilePhone").value.trim();

  const photoInput =
    document.getElementById("profilePhoto");

  if (!name || !phone) {
    alert("Name এবং Phone দিন।");
    return;
  }

  function finish(photo) {

    currentUser.name = name;
    currentUser.phone = phone;
    currentUser.photo = photo ||
      currentUser.photo ||
      defaultAvatar;

    localStorage.setItem(
      "sbUser",
      JSON.stringify(currentUser)
    );

    alert("✅ Profile update হয়েছে!");

    loadDashboard();
  }

  if (photoInput.files.length) {

    const reader = new FileReader();

    reader.onload = e =>
      finish(e.target.result);

    reader.readAsDataURL(photoInput.files[0]);

  } else {
    finish("");
  }
}

if (currentUser) {
  loadDashboard();
} else {
  goWelcome();
}
