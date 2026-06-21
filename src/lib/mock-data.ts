import { Project, Roadmap } from "@/types";

export const mockRoadmap: Roadmap = {
    project_name: 'foodDash',
    description: 'a mobile app for browsing resturant and placing order',
    estimated_weeks: 8,
    tracks:['auth', 'menu', 'orders', 'payment', 'deploy'],
    milestones:[
        {
            id: 'M1',
            title: 'Authentication',
            description: 'user signup, login and jwt session managemant.',
            week_start: 1,
            week_end: 2,
            completion_percentage: 0,
            depends_on:[],
            signals:[
                {
                   type: 'file_exists', 
                   pattern: 'src/auth/**'
                },
                {
                    type:'dependency',
                    pattern: "package.json has 'jsonwebtoken'"
                },
                {
                    type: "manual",
                    pattern:'auth flow tested end-to-end'
                }
            ],
            status:'not_started',
            notes:'',
            ai_notes:['consider OAuth 2.0 for social login', 'add rate limiting on login endpoint'],
            
        },
         {
            id: 'M2',
            title: 'Restaurant Menu',
            description: 'Menu browsing, item listing, and search by category.',
            week_start: 2,
            week_end: 3,
            completion_percentage: 0,
            depends_on:['M1'],
            signals:[
                {
                   type: 'file_exists', 
                   pattern: 'src/menu/**'
                },
                {
                   type: 'file_exists', 
                   pattern: 'src/routes/menu.js'
                },
            ],
            status:'not_started',
            notes:'',
            ai_notes:['Add image optimization for menu photo', 'implement category filters'],
        },
         {
            id: 'M3',
            title: 'Order System',
            description: 'Cart management, order placement, and history.',
            week_start: 3,
            week_end: 4,
            completion_percentage: 0,
            depends_on:['M2'],
            signals:[
                {
                   type: 'file_exists', 
                   pattern: 'src/orders/**'
                },
                {
                   type: 'file_exists', 
                   pattern: 'src/cart/**'
                },
            ],
            status:'not_started',
            notes:'',
            ai_notes:['add order confirmation email','Impliment cart persistence'],
        },
         {
            id: 'M4',
            title: 'payment',
            description: 'stripe integration and paymnent processing.',
            week_start: 5,
            week_end: 6,
            completion_percentage: 0,
            depends_on:['M3'],
            signals:[
                {
                   type: 'dependency', 
                   pattern: "package.json has 'stripe' "
                },
                {
                   type: 'file_exists', 
                   pattern: 'src/payment/**'
                },
            ],
            status:'not_started',
            notes:'',
            ai_notes:['set up stripe webhook handling','add payment retry logic'],
            
        },
         {
            id: 'M5',
            title: 'deployment',
            description: 'production deployment and CI/CD setup.',
            week_start: 6,
            week_end: 8,
            completion_percentage: 0,
            depends_on:['M4'],
            signals:[
                {
                   type: 'file_exists', 
                   pattern: 'vercel.json'
                },
                {
                   type: 'file_exists', 
                   pattern: '.github/workflow/**'
                },
            ],
            status:'not_started',
            notes:'',
            ai_notes:['set up monitoring with sentry','configure auto-scaling'],
            
        }
    ]
};

export const mockProject: Project[] =[
    {
        id: 'proj-1',
        name: 'foodDash',
        description:'Food delivery mobile app',
        created_at:'2026-06-15T10:00:00Z',
        roadmap: mockRoadmap
    }
];

export function calculateProgress(roadmap:Roadmap): number{
    const completed = roadmap.milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed/roadmap.milestones.length)*100)
}

export function getStatusColor(staus:string):string{
    switch (staus){
        case 'completed' : return '#22c55e';
        case 'in_progress' : return '#3b82f6';
        case 'blocked' : return '#ef4444';
        default: return '9ca3af';
    }
}

export function getStatusLabel(staus:string):string{
    switch (staus){
        case 'completed' : return 'Completed';
        case 'in_progress' : return 'In progress';
        case 'blocked' : return 'Blocked';
        default: return 'Not Started';
    }
}
