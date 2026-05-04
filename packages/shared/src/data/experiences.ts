import type { Experience } from '../types/index.js';

export const experiences: Experience[] = [
  {
    id: 'novacomp-tl-gamification',
    company: 'Novacomp',
    role: 'Technical Lead',
    period: '2024',
    duration: '3 months',
    summary:
      'Led design, evolution, and stabilization of a gamification and loyalty module within a core banking ecosystem.',
    bullets: [
      'Defined architectural decisions (ADR/HLD) for high-volume transactional microservices',
      'Designed async workflows using AWS SQS and EventBridge',
      'Ensured scalability and reliability of distributed processes on Kubernetes EKS',
      'Coordinated QA, cloud teams, and client stakeholders through release quality gates',
      'Contributed to secure service-to-service communication strategies',
    ],
    technologies: [
      'Node.js', 'NestJS', 'Microservices', 'AWS SQS', 'EventBridge',
      'Kubernetes (EKS)', 'GitHub Actions', 'CI/CD', 'Agile/Scrum',
    ],
    highlight: 'Core Banking · AWS · Distributed Systems',
  },
  {
    id: 'novacomp-tl-evaluation',
    company: 'Novacomp',
    role: 'Technical Lead — Architecture Evaluation',
    period: '2024',
    duration: '1 month',
    summary:
      'Led comprehensive evaluation of a core banking system to identify improvement opportunities across quality attributes.',
    bullets: [
      'Analyzed architecture focusing on performance, scalability, security, maintainability, and reliability',
      'Produced technical recommendations and architectural guidelines',
      'Coordinated stakeholders and guided analysis activities',
    ],
    technologies: [
      'Software Architecture Evaluation', 'Quality Attributes',
      'Performance Analysis', 'Technical Leadership', 'Documentation',
    ],
    highlight: 'Architecture · Quality Attributes',
  },
  {
    id: 'spring-ai-agent',
    company: 'Spring',
    role: 'Automation / AI Agent Developer',
    period: '2024',
    duration: '3 months',
    summary:
      'Designed and developed an automated sales agent for maritime experience rentals, orchestrated with n8n.',
    bullets: [
      'Architected end-to-end solution for customer interactions, lead qualification, and booking workflows',
      'Integrated external services and APIs for automated communication and sales processes',
      'Improved response times and sales efficiency through automation',
    ],
    technologies: ['n8n', 'Node.js', 'APIs', 'Workflow Automation', 'Webhooks', 'CRM', 'Kommo'],
    highlight: 'AI Agents · Automation',
  },
  {
    id: 'okorum-tl',
    company: 'Okorum SA',
    role: 'Technical Lead',
    period: '2022–2024',
    duration: '27 months',
    summary:
      'Led design and evolution of a scalable healthcare platform for providers and insurers (EPS), processing high-volume RIPS records.',
    bullets: [
      'Designed microservices architecture with Node.js and NestJS improving scalability and deployment independence',
      'Implemented enterprise-grade SSO with OAuth 2.0, JWT, and OIDC across multiple SaaS applications',
      'Architected file ingestion component supporting SFTP, FTP, Amazon S3, and REST APIs at high throughput',
      'Validated microfrontend architectures for reuse across multiple products',
      'Implemented CI/CD governance using GitHub Actions including controlled code delivery to third-party partners',
      'Responsible for sprint planning, architectural reviews, and direct client coordination',
    ],
    technologies: [
      'Node.js', 'NestJS', 'Microservices', 'OAuth 2.0', 'JWT', 'OIDC', 'SSO',
      'AWS', 'Amazon S3', 'SFTP', 'MongoDB', 'React.js', 'Microfrontends',
      'GitHub Actions', 'CI/CD', 'Agile/Scrum',
    ],
    highlight: 'Healthcare · Microfrontends · SSO',
  },
  {
    id: 'okorum-fullstack',
    company: 'Okorum SA',
    role: 'Full Stack Developer',
    period: '2021–2022',
    duration: '13 months',
    summary:
      'Developed a solution for healthcare insurers focused on management of core business processes.',
    bullets: [
      'Built and refactored the system throughout the development cycle',
    ],
    technologies: ['MongoDB', 'Node.js', 'React.js', 'Meteor.js', 'OAuth 2.0', 'JWT', 'Amazon S3'],
    highlight: 'Healthcare · Full Stack',
  },
  {
    id: 'akimad',
    company: 'Akimad',
    role: 'Full Stack Developer',
    period: '2021',
    duration: '2 months',
    summary:
      'Developed MVP for a mobile betting video game with real-time bidirectional communication.',
    bullets: [
      'Built React Native app and Node.js microservices backend with PostgreSQL',
      'Implemented WebSockets for live game interactions and betting events',
    ],
    technologies: ['React Native', 'Node.js', 'Microservices', 'WebSockets', 'PostgreSQL', 'OAuth 2.0'],
    highlight: 'Real-Time · Mobile',
  },
  {
    id: 'global66',
    company: 'Global66',
    role: 'Frontend Developer',
    period: '2020',
    duration: '4 months',
    summary:
      'Maintained and improved a fintech system, performing code refactoring and defining coding standards.',
    bullets: [
      'Refactored legacy code improving performance and maintainability',
      'Defined coding standards ensuring higher software quality and scalability',
    ],
    technologies: ['Vue.js', 'GitLab'],
    highlight: 'Fintech · Vue.js',
  },
  {
    id: 'infinivirt-lead',
    company: 'Infinivirt',
    role: 'Project Manager, Development Lead & Frontend Developer',
    period: '2020',
    duration: '3 months',
    summary:
      'Led full development of a web system for telecommunications statistics visualization.',
    bullets: [
      'Owned budget, negotiation, team hiring, and full frontend implementation',
      'Designed frontend and backend architecture independently',
    ],
    technologies: ['Node.js', 'Vue.js', 'PostgreSQL', 'OAuth 2.0'],
    highlight: 'Full Ownership · Telecom',
  },
];
