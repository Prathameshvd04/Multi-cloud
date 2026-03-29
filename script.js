let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/* ================= PRODUCTS ================= */

function getProducts(){
    return JSON.parse(localStorage.getItem("productsData")) || {
        mens: [],
        womens: [],
        kids: []
    };
}

function showProducts(category){

    const section = document.getElementById("products");
    const products = getProducts();

    section.innerHTML = "";

    if(!products[category] || products[category].length === 0){
        section.innerHTML = "<p>No products available.</p>";
        return;
    }

    products[category].forEach((product, index) => {
        section.innerHTML += `
            <div class="product-card">
                <img src="${product.img}">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                <button onclick="addToCart('${category}', ${index})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

/* ================= CART ================= */

function addToCart(category,index){
    const products=getProducts();
    cart.push(products[category][index]);
    localStorage.setItem("cart",JSON.stringify(cart));
    updateCart();
}

function updateCart(){
    document.getElementById("cart-count").innerText=cart.length;

    const cartItems=document.getElementById("cartItems");
    const cartTotal=document.getElementById("cartTotal");

    if(!cartItems) return;

    cartItems.innerHTML="";
    let total=0;

    cart.forEach((item,i)=>{
        total+=item.price;
        cartItems.innerHTML+=`
        <div style="margin-bottom:15px;">
            ${item.name} - ₹${item.price}
            <button onclick="removeItem(${i})"
            style="background:red;color:white;border:none;padding:4px 8px;margin-left:10px;">
            Remove
            </button>
        </div>
        `;
    });

    cartTotal.innerText="Total: ₹"+total;
}

function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem("cart",JSON.stringify(cart));
    updateCart();
}

function toggleCart(){
    document.getElementById("cartSidebar").classList.toggle("active");
}

/* ================= BILL ================= */

function proceedToPay(){

    if(cart.length===0){
        alert("Cart is empty!");
        return;
    }

    let total=0;
    let bill="----- BILL -----\n\n";

    cart.forEach(item=>{
        bill+=`${item.name} - ₹${item.price}\n`;
        total+=item.price;
    });

    bill+=`\nTotal: ₹${total}\n\n`;

    if(currentUser){
        bill+=`Deliver To:\n${currentUser.name}\n${currentUser.address}\nPhone: ${currentUser.phone}\n`;
    }

    alert(bill);

    cart=[];
    localStorage.removeItem("cart");
    updateCart();
    toggleCart();
}

/* ================= PROFILE SYSTEM ================= */

function toggleProfile(){
    const modal = document.getElementById("profileModal");
    modal.style.display = "flex";

    if(currentUser){
        showUserDetails();
    } else {
        showAuthOptions();
    }
}

function closeProfile(){
    document.getElementById("profileModal").style.display = "none";
}

function showAuthOptions(){
    document.getElementById("profileArea").innerHTML = `
        <button onclick="showLogin()">Login</button>
        <button onclick="showSignup()">Sign Up</button>
    `;
}

/* ---------- SIGN UP ---------- */

function showSignup(){
    document.getElementById("profileArea").innerHTML = `
        <h3>Sign Up</h3>
        <input id="name" placeholder="Name">
        <input id="age" placeholder="Age">
        <input id="phone" placeholder="Phone">
        <input id="address" placeholder="Address">
        <input id="password" type="password" placeholder="Password">
        <button onclick="signup()">Submit</button>
    `;
}

function signup(){

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!name || !age || !phone || !address || !password){
        alert("Please fill all fields");
        return;
    }

    users = JSON.parse(localStorage.getItem("users")) || [];

    if(users.find(u => u.phone === phone)){
        alert("User already exists");
        return;
    }

    const user = { name, age, phone, address, password };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup Successful!");

    showAuthOptions(); // refresh to login/signup buttons
}

/* ---------- LOGIN ---------- */

function showLogin(){
    document.getElementById("profileArea").innerHTML = `
        <h3>Login</h3>
        <input id="loginPhone" placeholder="Phone">
        <input id="loginPass" type="password" placeholder="Password">
        <button onclick="login()">Submit</button>
    `;
}

function login(){

    const phone = document.getElementById("loginPhone").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.phone === phone && u.password === password
    );

    if(user){
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login Successful!");
        showUserDetails();
    } else {
        alert("Invalid Phone or Password");
    }
}

/* ---------- SHOW USER DETAILS ---------- */

function showUserDetails(){
    document.getElementById("profileArea").innerHTML = `
        <h3>My Profile</h3>
        <p><strong>Name:</strong> ${currentUser.name}</p>
        <p><strong>Age:</strong> ${currentUser.age}</p>
        <p><strong>Phone:</strong> ${currentUser.phone}</p>
        <p><strong>Address:</strong> ${currentUser.address}</p>
        <button onclick="logout()">Logout</button>
    `;
}

/* ---------- LOGOUT ---------- */

function logout(){
    currentUser = null;
    localStorage.removeItem("currentUser");
    alert("Logged Out Successfully");
    showAuthOptions();
}

/* ================= INIT ================= */

updateCart();