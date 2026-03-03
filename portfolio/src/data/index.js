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
      id: "megflix",
      category: "Fullstack Application",
      title: "MegFlix",
      description:
        "A fullstack Netflix-inspired library for movies, series and anime. Users can register, log in, build personal watchlists and leave reviews. Built with ASP.NET Core Web API and React, powered by TMDB and Jikan APIs for real content data. Features full JWT authentication, user-specific data, and clean layered backend architecture. Deployed with backend on Render and frontend on Vercel.",
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
      title: "Auth API",
      description:
        "Secure authentication API designed to handle user registration and login with password hashing and JWT-ready architecture. Built with a clear layered structure to ensure maintainability and scalability.",
      visual: "flow", // system flow visualization
      tags: ["ASP.NET Core", "C#", "SQL", "JWT", "Password Hashing"],
      link: "https://github.com/Megjafari/Auth-API",
      // Flow diagram data
      flow: {
        register: ["Client", "POST /register", "Validate Input", "Hash Password", "Save to DB", "200 OK"],
        login: ["Client", "POST /login", "Find User", "Verify Hash", "Issue JWT", "200 + Token"],
      },
    },

    {
      id: "todo-api",
      
      category: "REST API",
      title: "Todo API",
      description:
        "RESTful task management API with full CRUD functionality, designed using a layered architecture to ensure clean data flow, maintainability, and scalable backend structure.",
      visual: "architecture", // architecture | code | flow
      tags: ["ASP.NET Core", "C#", "Entity Framework", "SQL", "Swagger"],
      link: "https://github.com/Megjafari/TodoAPIApp",
      // Architecture diagram data
      arch: {
        layers: ["Client / Swagger UI", "Controllers", "Services", "Data Access"],
        entities: ["TodoItem", "TodoContext"],
        endpoints: ["GET /api/todos", "POST /api/todos", "PUT /api/todos/{id}", "DELETE /api/todos/{id}"],
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
