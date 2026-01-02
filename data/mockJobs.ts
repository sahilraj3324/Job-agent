import { Job } from '../types';

export const mockJobs: Job[] = [
    {
        id: '1',
        title: 'Senior Frontend Engineer',
        company: 'TechFlow',
        location: 'Remote',
        type: 'Full-time',
        salary: '$120k - $160k',
        postedAt: '2h ago',
        description: 'We are looking for a Senior Frontend Engineer to lead our core product team. You will be building modern web applications using Next.js and React.',
        requirements: [
            '5+ years of experience with React and TypeScript',
            'Deep understanding of web performance and accessibility',
            'Experience with modern state management (Zustand, Redux Toolkit)',
            'Strong communication skills and ability to mentor juniors'
        ],
        logo: 'https://ui-avatars.com/api/?name=Tech+Flow&background=0D8ABC&color=fff',
        tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
        applyUrl: 'https://example.com/apply/1',
        source: 'Company Website',
        experience: '5+ Years'
    },
    {
        id: '2',
        title: 'Product Designer',
        company: 'Creative Studio',
        location: 'New York, NY',
        type: 'Hybrid',
        salary: '$90k - $130k',
        postedAt: '5h ago',
        description: 'Join our award-winning design team. We craft beautiful and intuitive digital experiences for global brands.',
        requirements: [
            'Portfolio demonstrating strong UI/UX skills',
            'Proficiency in Figma and prototyping tools',
            'Experience working closely with engineers',
            'Passion for micro-interactions and motion design'
        ],
        logo: 'https://ui-avatars.com/api/?name=Creative+Studio&background=FF5722&color=fff',
        tags: ['Figma', 'UI/UX', 'Design System'],
        applyUrl: 'https://example.com/apply/2',
        source: 'Google Jobs',
        experience: '3+ Years'
    },
    {
        id: '3',
        title: 'Backend Developer (Go)',
        company: 'CloudScale',
        location: 'San Francisco, CA',
        type: 'Onsite',
        salary: '$80/hr',
        postedAt: '1d ago',
        description: 'Help us scale our high-throughput distributed systems. You will be working on critical infrastructure handling millions of requests.',
        requirements: [
            'Strong experience with Go (Golang)',
            'Knowledge of gRPC and microservices architecture',
            'Experience with Kubernetes and Docker',
            'Familiarity with distributed databases (Cassandra, DynamoDB)'
        ],
        logo: 'https://ui-avatars.com/api/?name=Cloud+Scale&background=673AB7&color=fff',
        tags: ['Go', 'Kubernetes', 'Microservices'],
        applyUrl: 'https://example.com/apply/3',
        source: 'Company Website',
        experience: '4+ Years'
    },
    {
        id: '4',
        title: 'Marketing Manager',
        company: 'GrowthRocket',
        location: 'London, UK',
        type: 'Remote',
        salary: '£40k - £50k (Pro-rata)',
        postedAt: '2d ago',
        description: 'We need a strategic thinker to drive our growth marketing initiatives. You will oversee paid acquisition and content strategy.',
        requirements: [
            'Proven track record in B2B SaaS marketing',
            'Experience with Google Ads and LinkedIn Ads',
            'Strong analytical skills (GA4, Mixpanel)',
            'Excellent copywriting abilities'
        ],
        logo: 'https://ui-avatars.com/api/?name=Growth+Rocket&background=4CAF50&color=fff',
        tags: ['Marketing', 'SEO', 'Growth'],
        applyUrl: 'https://example.com/apply/4',
        source: 'Company Website',
        experience: '2+ Years'
    },
    {
        id: '5',
        title: 'Full Stack Engineer',
        company: 'StartUp Inc',
        location: 'Berlin, Germany',
        type: 'Hybrid',
        salary: '€70k - €90k',
        postedAt: '3d ago',
        description: 'Early-stage startup looking for a generalist who can wear many hats. You will build features from database to frontend.',
        requirements: [
            'Experience with Node.js and React',
            'Comfortable with SQL (PostgreSQL)',
            'Ability to move fast and iterate',
            'Interest in product ownership'
        ],
        logo: 'https://ui-avatars.com/api/?name=StartUp+Inc&background=E91E63&color=fff',
        tags: ['Node.js', 'PostgreSQL', 'React'],
        applyUrl: 'https://example.com/apply/5',
        source: 'Google Jobs',
        experience: '1-3 Years'
    }
];
