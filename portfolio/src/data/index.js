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
  "Creating scalable and maintainable backend systems.",
],
  email: "megberserker@gmail.com",
  footer: ".meg",

  social: {
    github: "https://github.com/Megjafari",
    linkedin: "https://linkedin.com/in/meghdad-jafari",
  },

  about: {
    bio:
  "Backend-focused developer specializing in C# and .NET, passionate about building reliable Web APIs and well-structured backend systems using clean architecture, dependency injection, and solid SQL data handling.",
  description:
  "I’m a backend-focused developer specializing in C# and .NET, passionate about building reliable and well-structured systems. I work mainly with ASP.NET Core Web APIs, SQL databases, and clean architecture principles such as layered design and dependency injection. I enjoy solving real backend challenges like authentication, data handling, and creating scalable APIs. Currently studying Backend & Cloud Development at NBI/Handelsakademin and seeking an internship (LIA) for Autumn 2026.",
image: "/images/profile.jpg",
  },

  projects: [
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
