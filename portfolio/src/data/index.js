export const siteData = {
  name: "Meghdad Jafari",
  handle: ".meg",
  tagline: "Open for LIA / Internship",

  roles: [
    "Building fullstack applications with C#/.NET and React.",
    "Designing reliable backend systems and Web APIs.",
    "Running Kubernetes infrastructure with GitOps and Argo CD.",
    "Building across development, deployment and infrastructure.",
  ],

  email: "megberserker@gmail.com",
  footer: ".meg",

  social: {
    github: "https://github.com/Megjafari",
    linkedin: "https://linkedin.com/in/meghdad-jafari",
  },

  about: {
    bio: "Fullstack developer with a strong backend focus in C#/.NET and a specialization in Cloud. Building applications while exploring DevOps through Kubernetes, Docker, GitOps and self-hosted infrastructure.",

    description:
      "I'm a fullstack developer with a strong backend focus in C# and .NET, currently studying Backend Development with a specialization in Cloud. I build applications using ASP.NET Core, React and PostgreSQL, and enjoy working across the entire journey from code and databases to deployment. Alongside development, I run a self-hosted homelab where I work hands-on with Kubernetes, Docker, GitOps, Linux and networking. I'm currently looking for LIA 2 opportunities within DevOps, Cloud, Platform Engineering or backend development.",

    image: "/images/profile.jpg",
  },

  projects: [
    {
      id: "kubernetes-homelab",
      year: "2026",
      category: "DevOps / Platform Engineering",
      title: "Kubernetes Homelab",
      description:
        "Self-hosted Kubernetes environment for running and managing containerized workloads with GitOps, persistent storage, networking and GPU-enabled services. Built and maintained as a hands-on platform engineering project.",
      visual: null,
      image: "/images/network-diagram.png",
      tags: [
        "Kubernetes",
        "Argo CD",
        "GitOps",
        "Containerd",
        "Linux",
        "NFS",
        "Networking",
        "VLAN",
      ],
      //link: "https://github.com/Megjafari/home-ops",
    },

    {
      id: "liahub",
      year: "2026",
      category: "Fullstack Application",
      title: "LIAHub",
      description:
        "Fullstack job and internship discovery platform for Swedish tech students. Provides real-time listings, smart filtering, application tracking, and a mobile-first UI. Built solo with ASP.NET Core Web API and React. Deployed on Railway and Vercel.",
      visual: "architecture",
      tags: [
        "ASP.NET Core",
        "C#",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Railway",
        "Vercel",
      ],
      link: "https://github.com/Megjafari/liahub-backend",
      demo: "https://liahub.meghdadjafari.dev",
      arch: {
        layers: [
          "React / TypeScript Frontend (Vercel)",
          "ASP.NET Core Web API (Railway)",
          "Entity Framework Core",
          "PostgreSQL",
        ],
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
      id: "proxmox-dash",
      year: "2026",
      category: "Fullstack Dashboard",
      title: "ProxmoxDash",
      description:
        "Self-hosted dashboard for Proxmox homelabs. Provides real-time monitoring of nodes, VMs and LXCs with management controls and a built-in SSH web terminal. Built with ASP.NET Core, SignalR and React, and deployed through Docker and Coolify.",
      visual: "flow",
      tags: [
        "ASP.NET Core",
        "C#",
        "SignalR",
        "React",
        "TypeScript",
        "JWT",
        "Docker",
        "Cloudflare",
      ],
      link: "https://github.com/Megjafari/_ProxmoxDash",
      flow: {
        register: [
          "React Frontend",
          "SignalR Hub",
          "Proxmox API",
          "Real-time Data",
          "Dashboard UI",
        ],
        login: [
          "JWT Auth",
          "Validate Token",
          "Authorize Request",
          "Node Access",
          "200 OK",
        ],
      },
    },

    {
      id: "debugged-api",
      year: "2026",
      category: "REST API",
      title: "Debugged API",
      description:
        "Bug knowledge base API that archives resolved issues and surfaces similar past solutions when a new bug is logged. Built with Clean Architecture, CQRS via MediatR, JWT authentication and role-based access control.",
      visual: "architecture",
      tags: [
        "ASP.NET Core",
        "C#",
        "Clean Architecture",
        "CQRS",
        "PostgreSQL",
        "JWT",
        "Docker",
      ],
      link: "https://github.com/Megjafari/debugged-api",
      arch: {
        layers: [
          "API Layer (Controllers, Middleware)",
          "Application (CQRS / MediatR / FluentValidation)",
          "Domain (Entities, zero dependencies)",
          "Infrastructure (EF Core, Identity, JWT)",
        ],
        entities: ["Issue", "Project", "Tag", "ApplicationUser"],
        endpoints: [
          "GET /api/issues/{id}/similar",
          "POST /api/projects/{id}/issues",
          "PUT /api/issues/{id}",
          "DELETE /api/issues/{id}",
        ],
      },
    },

    {
      id: "kaizen",
      year: "2026",
      category: "Fullstack PWA",
      title: "Kaizen",
      description:
        "Fullstack fitness tracking PWA built as a solo school project. Users can log workouts, track weight history and monitor progress over time. Includes Auth0 authentication and PWA support for installability. Deployed on Railway and Vercel.",
      visual: "architecture",
      tags: [
        "ASP.NET Core",
        "C#",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Auth0",
        "PWA",
        "Railway",
        "Vercel",
      ],
      link: "https://github.com/Megjafari/kaizen-API",
      demo: "https://kaizen.meghdadjafari.dev",
      arch: {
        layers: [
          "React / TypeScript PWA (Vercel)",
          "ASP.NET Core Web API (Railway)",
          "Entity Framework Core",
          "PostgreSQL",
        ],
        entities: ["Workout", "WeightEntry", "User"],
        endpoints: [
          "GET /api/workouts",
          "POST /api/workouts",
          "DELETE /api/workouts/{id}",
          "GET /api/weight",
          "POST /api/weight",
        ],
      },
    },

    {
      id: "shiptrack",
      year: "2026",
      category: "Fullstack Dashboard",
      title: "ShipTrack",
      description:
        "Shipment tracking system simulating how logistics platforms manage shipment flows, carriers and delivery statuses. Features status filtering, shipment search, carrier recommendation logic based on weight and detailed tracking event history.",
      visual: "architecture",
      tags: [
        "ASP.NET Core",
        "C#",
        "React",
        "TypeScript",
        "Docker",
        "Render",
        "Vercel",
      ],
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
      year: "2026",
      category: "Fullstack Application",
      title: "MegFlix",
      description:
        "Fullstack streaming-style platform for discovering movies, series and anime. Users can sign in with Google or email, manage personal watchlists and leave reviews. Integrates TMDB and Jikan APIs for live data.",
      visual: "architecture",
      tags: [
        "ASP.NET Core",
        "C#",
        "PostgreSQL",
        "React",
        "Docker",
        "Supabase",
        "TMDB API",
        "Railway",
        "Vercel",
      ],
      link: "https://github.com/Megjafari/MegFlixAPI",
      demo: "https://megflix.meghdadjafari.dev",
      arch: {
        layers: [
          "React Frontend (Vercel)",
          "ASP.NET Core Web API (Railway)",
          "Entity Framework Core",
          "PostgreSQL (Supabase)",
        ],
        entities: ["Movie", "Review", "WatchList"],
        endpoints: [
          "GET /api/movies",
          "POST /api/movies",
          "GET /api/reviews",
          "POST /api/reviews",
          "GET /api/watchlist",
          "POST /api/watchlist/{movieId}",
        ],
      },
    },

    {
      id: "auth-api",
      year: "2025",
      category: "Authentication API",
      title: "Auth API",
      description:
        "Secure authentication API supporting user registration and login with password hashing and JWT-based authentication. Designed with a clean layered architecture for maintainability, separation of concerns and scalability.",
      visual: "flow",
      tags: ["ASP.NET Core", "C#", "SQL", "JWT", "Password Hashing"],
      link: "https://github.com/Megjafari/Auth-API",
      flow: {
        register: [
          "Client",
          "POST /register",
          "Validate Input",
          "Hash Password",
          "Save to DB",
          "200 OK",
        ],
        login: [
          "Client",
          "POST /login",
          "Find User",
          "Verify Hash",
          "Issue JWT",
          "200 + Token",
        ],
      },
    },
  ],

  skills: [
    "C# / .NET",
    "ASP.NET Core Web API",
    "React / TypeScript",
    "SQL & Relational Databases",
    "Clean Architecture & Dependency Injection",
    "REST API Design",
    "Entity Framework Core",
    "Docker",
    "Kubernetes",
    "GitOps & Argo CD",
    "Linux",
    "Proxmox & Self-Hosting",
    "Networking & VLAN",
    "Git & GitHub",
  ],
};