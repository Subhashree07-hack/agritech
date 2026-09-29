# 🌾 AgriLink - Direct Farm & Agro-Ecosystem Platform

AgriLink is a modern full-stack web application designed for farmers, buyers, cow shelters, and food processors.

---

## ✨ Features Implemented

### 1. 📦 Categorized Produce Stock Browsing
- **Vegetables Stock**: Click "Vegetables" to view all available vegetable stock (Tomatoes, Carrots, Beetroot, Sweet Potato, Gourds, Broccoli, etc.) with real stock weights, freshness times, and prices.
- **Greens Stock (Keerai)**: Click "Greens" to view all leafy greens stock (Palak, Moringa/Drumstick leaves, Curry leaves, Mint, Methi, Coriander) with bunch availability.
- **Fruits Stock**: Click "Fruits" to view all fruit stock (Papaya, Nendran Banana, Oranges, Pineapple, Amla, Guava, Watermelon, etc.).
- **Live Stock Indicators**: Shows in-stock quantities, farmer names, villages, and discount tags.

### 2. 🧬 Shop by Researched Health Benefits
Scientific evidence-based nutrition with high-resolution realistic crop photography:
1. **💇 Hair Growth & Scalp Strength**:
   - **Research**: Rich in Beta-carotene, Iron, Biotin, and dietary sulfur which fuel keratin synthesis, nourish dormant hair roots, and stop hair thinning.
   - **Produce**: Curry Leaves (Kariveppilai), Wild Amla (Nellikai), Fresh Spinach (Palak), Ooty Carrots, Sweet Potato, Allahabad Guava.
2. **✨ Glowing Skin & Anti-Aging**:
   - **Research**: High concentrations of Lycopene, Vitamin C, Silica, and Papain enzymes for collagen boosting, UV protection, natural hydration, and natural pink blush.
   - **Produce**: Country Tomatoes, Red Lady Papaya, Nagpur Oranges, Crisp Cucumber, Pollachi Beetroot, Bell Peppers.
3. **🛡️ Immunity Boost & Infection Defense**:
   - **Research**: Bioactive Allicin, Gingerol, and concentrated Vitamin C that supercharge white blood cell activity and fight seasonal infections.
   - **Produce**: Drumstick Leaves (Moringa), Fresh Ginger, Hill Garlic, Wild Amla, Lemons, Broccoli, Pomegranate.
4. **⚡ Fast Digestion & Gut Health**:
   - **Research**: Proteolytic enzymes (Papain & Bromelain), rich soluble prebiotic fibers, and natural menthol eliminate bloating, accelerate protein breakdown, and nourish gut flora.
   - **Produce**: Giant Pineapple, Ripe Papaya, Fresh Mint (Pudina), Bottle Gourd (Sorakkai), Nendran Bananas, Ginger.
- **⚡ Instant Buy Now**: Quick 1-click modal with quantity counter, address input, cash/UPI choice, and instant order confirmation without checkout friction.

### 3. 🐄 Waste Listing & Cow Shelters (Gaushalas)
- **Zero Food Waste Ecosystem**: Farmers and vendors can sell or donate vegetable trimmings, rejected greens, fruit peels/pulp, and crop residues to registered Cow Shelters.
- **Realistic Cow Farm Imagery**: Real photographic images of cow sanctuaries, healthy Gir & Kangeyam cows, and green feeding pastures.
- **Shelter Metrics**: Cattle herd capacity, daily green fodder demand, current intake progress, and buying payout rate (e.g. ₹4.50/kg).
- **Free Doorstep Pickup**: Free collection vehicle dispatched for farm loads above 60-80 kg.
- **Interactive Offer Modal**: Farmers select residue type, enter weight in kg, view calculated payout, and schedule pickup.

### 4. 🗺️ Farmlands & Mandis Interactive Map
- **Location Search**: Type any location (e.g., Salem, Coimbatore, Theni, Ooty, Erode, Madurai, Hosur...) or click "GPS Near Me".
- **🌾 Contract Farmlands Locator**: Finds fertile farmlands open for contract farming or forward purchase of vegetables, greens, and fruits. Displays realistic farmland photos, available acreage, soil type, water source, suitable crops, seasonal rate per acre, and contract inquiry modal.
- **🏛️ Nearby Mandis & Marketplaces**: Farmers can find nearby APMC wholesale mandis, Uzhavar Sandhais (0% commission direct bazaars), and collection hubs with operating hours, top commodities, and contact details.
- **👨‍🌾 Local Farmers**: View nearby verified farmers and active stock.

### 5. 🥤 Surplus Fruits -> Direct to Juice Shop
- Heavy, ripe, sweet, or surplus fruits are tagged with **⭐ Juice Shop Grade**.
- **🥤 Send Directly to Juice Shop**: 1-click dispatch modal allowing farmers to route 25 kg, 50 kg, or 100 kg crates directly to partner juice bars (Green Sip Fresh Juice Bar, Nectar Pure Juices, Tropical Pulp Express) at wholesale rates before spoilage occurs.

---

## 🚀 How to Run in VS Code

### Step 1: Start MongoDB
Ensure MongoDB is running locally (default: `mongodb://127.0.0.1:27017/agrilink`).

### Step 2: Seed the Database
In VS Code terminal:
```bash
npm run seed
```
*(Populates 27 fresh products with realistic images and health benefits, 6 cow shelters, 5 farmlands, and 6 mandis)*

### Step 3: Start the Backend Server (Port 5000)
Open a terminal in VS Code:
```bash
npm run server
```
*API running at `http://localhost:5000`*

### Step 4: Start the Frontend Client (Port 5173)
Open a second terminal in VS Code:
```bash
npm run client
```
*Vite web application running at `http://localhost:5173`*

---

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Leaflet, React-Leaflet, React Router v7, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer
