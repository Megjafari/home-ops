// ============================================
// PORTFOLIO DATA — Edit this file with your info
// ============================================

export const siteData = {
  name: "Meghdad Jafari",
  handle: ".meg",
  tagline: "Open for LIA / Internship",
roles: [
  "Building reliable Web APIs with C# and .NET.",
  "Designing clean backend architecture and data flow.",
  "Creating fullstack applications from database to deployment.",
],
  email: "megberserker@gmail.com",
  footer: ".meg",

  social: {
    github: "https://github.com/Megjafari",
    linkedin: "https://linkedin.com/in/meghdad-jafari",
  },

  about: {
    bio:
  "Backend developer specializing in C# and .NET, with growing fullstack experience using React. Passionate about building reliable Web APIs, clean architecture, and scalable systems. From database to deployment.",
  description:
  "I'm a backend-focused developer specializing in C# and .NET, with growing fullstack experience using React. I work mainly with ASP.NET Core Web APIs, SQL databases, and clean architecture principles like layered design and dependency injection. I enjoy solving real backend challenges like authentication, data handling, and building scalable APIs that go all the way from database to deployment. Currently studying Backend and Cloud Development at NBI/Handelsakademin and seeking an internship (LIA) for Autumn 2026.",
image: "/images/profile.jpg",
  },

  projects: [

        {
      id: "liahub",
      category: "Fullstack Application",
      year: "2026",
      title: "LIAHub",
      description:
        "Fullstack job and internship discovery platform for Swedish YH tech students. Provides real-time listings, smart filtering, application tracking, and a mobile-first UI. Built solo with ASP.NET Core Web API and React (TypeScript + Tailwind). Deployed on Railway and Vercel.",
      visual: "architecture",
      tags: ["ASP.NET Core", "C#", "React", "TypeScript", "Tailwind CSS", "Railway", "Vercel"],
      link: "https://github.com/Megjafari/liahub-backend",
      demo: "https://liahub.meghdadjafari.dev",
      arch: {
        layers: ["React / TypeScript Frontend (Vercel)", "ASP.NET Core Web API (Railway)", "Entity Framework Core", "PostgreSQL"],
        entities: ["JobListing", "User", "Notification"],
        endpoints: [
          "GET /api/jobs",
          "GET /api/jobs/{id}",
          "POST /api/jobs",
          "GET /api/notifications",
        ],
      },
    },
  
        {
      id: "shiptrack",
      category: "Fullstack Dashboard",
      year: "2026",
      title: "ShipTrack",
      description:
        "Shipment tracking system simulating how logistics platforms manage shipment flows, carriers, and delivery statuses. Inspired by platforms used by logistics companies like Centiro. Features status filtering, shipment search, carrier recommendation logic based on weight, and detailed tracking event history.",
      visual: "architecture",
      tags: ["ASP.NET Core", "C#", "React", "TypeScript", "Docker", "Render", "Vercel"],
      link: "https://github.com/Megjafari/shiptrack-api",
      demo: "https://shiptrack.meghdadjafari.dev",
      arch: {
        layers: [
          "React / TypeScript Frontend (Vercel)",
          "ASP.NET Core Web API (Render)",
          "Controller-based REST API",
          "In-memory mock data",
        ],
        entities: ["Shipment", "TrackingEvent", "Carrier"],
        endpoints: [
          "GET /api/shipments",
          "GET /api/shipments/{id}",
          "POST /api/shipments",
          "GET /api/shipments/stats",
        ],
      },
    },

            {
      id: "megflix",
      category: "Fullstack Application",
      year: "2026",
      title: "MegFlix",
      description:
        "Fullstack streaming-style platform for discovering movies, series, and anime. Users can create accounts, manage personal watchlists, and leave reviews. Built with ASP.NET Core Web API and React, integrating TMDB and Jikan APIs for live data. Includes JWT authentication, user-specific data handling, and a clean layered backend architecture. Deployed on Render and Vercel.",
      visual: "architecture",
      tags: ["ASP.NET Core", "C#", "PostgreSQL", "React", "Docker", "Supabase", "TMDB API", "Render", "Vercel"],
      link: "https://github.com/Megjafari/MegFlixAPI",
      demo: "https://megflix.meghdadjafari.dev",
      arch: {
        layers: ["React Frontend (Vercel)", "ASP.NET Core Web API (Render)", "Entity Framework Core", "PostgreSQL (Supabase)"],
        entities: ["Movie", "Review"],
        endpoints: [
          "GET /api/movies",
          "POST /api/movies",
          "PUT /api/movies/{id}",
          "DELETE /api/movies/{id}",
          "GET /api/reviews",
          "POST /api/reviews",
        ],
      },
    },

    {
      id: "auth-api",
      
      category: "Authentication API",
      year: "2025",
      title: "Auth API",
      description:
        "Secure authentication API supporting user registration and login with password hashing and JWT-based authentication. Designed with a clean layered architecture to ensure maintainability, separation of concerns, and scalability.",
      visual: "flow", // system flow visualization
      tags: ["ASP.NET Core", "C#", "SQL", "JWT", "Password Hashing"],
      link: "https://github.com/Megjafari/Auth-API",
      // Flow diagram data
      flow: {
        register: ["Client", "POST /register", "Validate Input", "Hash Password", "Save to DB", "200 OK"],
        login: ["Client", "POST /login", "Find User", "Verify Hash", "Issue JWT", "200 + Token"],
      },
    },
    
  ],


   skills: [
    "C# / .NET",
    "ASP.NET Core Web API",
    "SQL & Relational Databases",
    "Clean Architecture & Dependency Injection",
    "REST API Design",
  
  ],
};
