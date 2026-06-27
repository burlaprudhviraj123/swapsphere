# 🌐 SwapSphere - Modern Peer-to-Peer Marketplace Platform

SwapSphere is a sleek, full-stack peer-to-peer marketplace application built for seamless item discovery, trading, buying, and selling. Designed with modern Apple-inspired Liquid Glass aesthetics, fluid animations, and robust backend micro-architecture, SwapSphere provides an effortless marketplace experience for desktop and mobile users alike.

---

## ✨ Features

- **🔒 Secure Authentication & Authorization**: Full JWT (JSON Web Token) stateless authentication flow with password hashing and protected API routes.
- **🛍️ Comprehensive Product Marketplace**: Browse, search, filter, and view detailed listings for items across diverse categories.
- **📸 Multi-Image Cloud Uploads**: Integrated with Cloudinary for automatic image optimization, multi-file uploads, and secure asset hosting.
- **❤️ Interactive Wishlist**: Bookmark items of interest to your personalized wishlist capsule for quick tracking.
- **💬 "I'm Interested" Workflow**: Express interest directly to sellers and initiate conversation flows for seamless trading.
- **🔄 Complete Product Lifecycle & Soft Delete**: Sellers can easily list new items, update product details, mark items as SOLD/AVAILABLE, or perform soft deletions.
- **🔍 Advanced Search & Filtering**: Instant keyword searching, multi-criteria filtering (category, price range, condition), and server-side pagination.
- **🎨 Modern Liquid Glass UI**: Responsive React interface featuring frosted glassmorphism, fluid Framer Motion micro-interactions, dark mode aesthetics, and clean typography.

---

## 🛠️ Tech Stack

### **Backend**
- **Language & Framework**: Java 17, Spring Boot 3.x
- **Security**: Spring Security 6, JWT (io.jsonwebtoken)
- **Persistence & ORM**: Spring Data JPA, Hibernate, PostgreSQL
- **Asset Storage**: Cloudinary Java SDK
- **Utilities**: Lombok, Jakarta Validation

### **Frontend**
- **Core Library**: React 18
- **Build Tool**: Vite
- **Styling & Motion**: Vanilla CSS modules, Tailwind CSS utilities, Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6

---

## 📁 Project Structure

```text
swapsphere/
├── src/                            # Spring Boot Backend Application
│   ├── main/
│   │   ├── java/com/prudhvi/swapsphere/
│   │   │   ├── config/             # Security & Application Configs
│   │   │   ├── controller/         # REST API Endpoints
│   │   │   ├── dto/                # Data Transfer Objects (Requests/Responses)
│   │   │   ├── exception/          # Global Exception Handling
│   │   │   ├── model/              # JPA Entities & Enums
│   │   │   ├── repository/         # Spring Data JPA Repositories
│   │   │   └── service/            # Business Logic Services
│   │   └── resources/
│   │       └── application.properties # Environment Configs & Placeholders
├── swapsphere-frontend/            # React + Vite Frontend Application
│   ├── public/                     # Static Public Assets
│   ├── src/
│   │   ├── assets/                 # SVGs and Images
│   │   ├── components/             # Reusable Glass UI Components
│   │   ├── context/                # React Context (Auth Context)
│   │   ├── layout/                 # Main App Layout Shells
│   │   ├── pages/                  # Views (Marketplace, Detail, Wishlist, etc.)
│   │   ├── services/               # Axios API Services
│   │   └── theme/                  # Design Tokens & Styling Constants
│   ├── package.json
│   └── vite.config.js
├── pom.xml                         # Maven Dependencies Configuration
└── README.md                       # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- **JDK 17** or higher
- **Node.js** (v18+ recommended) & **npm**
- **PostgreSQL** database instance
- **Cloudinary** free account for image uploads

---

### 1. Database Setup
Create a PostgreSQL database named `swapsphere_db`:
```sql
CREATE DATABASE swapsphere_db;
```

---

### 2. Backend Setup
1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/your-username/swapsphere.git
   cd swapsphere
   ```
2. Configure Environment Variables or update `src/main/resources/application.properties`:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/swapsphere_db
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_password
   JWT_SECRET=your_base64_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
3. Build and run the backend server:
   ```bash
   ./mvnw clean spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`.*

---

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd swapsphere-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

## 📡 API Architecture Summary

SwapSphere exposes a clean RESTful API contract:

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register a new user account | No |
| `/api/auth/login` | `POST` | Authenticate and retrieve JWT token | No |
| `/api/products` | `GET` | Get paginated list of active products | No |
| `/api/products/{id}` | `GET` | Get detailed product information | No |
| `/api/products` | `POST` | Create a new listing with multipart image files | Yes |
| `/api/products/{id}` | `PUT` | Update an existing listing | Yes |
| `/api/products/{id}` | `DELETE` | Soft-delete a product listing | Yes |
| `/api/wishlist` | `GET` | Get current user's saved wishlist items | Yes |
| `/api/wishlist/{productId}` | `POST` | Toggle item in user's wishlist | Yes |

---

## 📸 Screenshots

*(Add your UI application screenshots here before launching on GitHub)*

| Marketplace Grid | Product Detail & Glass Design |
|---|---|
| `![Marketplace Grid](docs/screenshots/marketplace.png)` | `![Product Detail](docs/screenshots/detail.png)` |

---

## 🔮 Future Enhancements

We are actively planning upcoming capabilities for SwapSphere:
- ⚡ **Real-Time Messaging**: WebSocket integration (STOMP/SockJS) for live buyer-seller chat.
- 📍 **Location-Based Discovery**: Distance calculation and localized item filtering.
- 🔔 **In-App & Push Notifications**: Instant alerts for trade updates and buyer inquiries.
- 🛡️ **User Trust & Reporting System**: Community reporting, seller ratings, and review feedback loops.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
