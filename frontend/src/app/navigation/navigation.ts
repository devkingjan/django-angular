import {FuseNavigation} from '@fuse/types';

export const adminNavigation: FuseNavigation[] = [
    {
        id: '',
        title: '',
        translate: '',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type: 'item',
                icon: 'dashboard',
                url: '/pages/dashboard',
            },
            {
                id: 'experiments',
                title: 'Experiments',
                translate: 'NAV.EXPERIMENTS.TITLE',
                type: 'item',
                icon: 'web_asset',
                url: '/pages/experiments',
            },
            {
                id: 'inventories',
                title: 'Inventories',
                translate: 'NAV.INVENTORIES.TITLE',
                type: 'item',
                icon: 'rate_review',
                url: '/pages/inventories',
            },
            {
                id: 'calendar',
                title: 'Calendar',
                translate: 'NAV.CALENDAR.TITLE',
                type: 'item',
                icon: 'calendar_today',
                url: '/pages/calendar',
            },
            {
                id: 'task-manager',
                title: 'Task Manager',
                translate: 'NAV.TASK_MANAGER.TITLE',
                type: 'item',
                icon: 'assignment',
                url: '/pages/task-manager',
            },
            {
                id: 'file-manager',
                title: 'File Manager',
                translate: 'NAV.FILE_MANAGER.TITLE',
                type: 'item',
                icon: 'library_books',
                url: '/pages/file-manager',
            },
            {
                id: 'molarity-calculator',
                title: 'Molarity Calculator',
                translate: 'NAV.CALCULATOR.TITLE',
                type: 'item',
                icon: 'laptop_mac',
                url: '/pages/molarity-calculator',
            },
            {
                id: 'mission-control',
                title: 'Mission Control',
                translate: 'NAV.MISSION_CONTROL.TITLE',
                type: 'item',
                icon: 'control_camera',
                url: '/pages/mission-control',
            },
            {
                id: 'lab-notebook',
                title: 'Lab Notebook',
                translate: 'NAV.LAB_NOTEBOOK.TITLE',
                type: 'collapsable',
                icon: 'equalizer',
                children: [
                    {
                        id: 'view-notebook',
                        title: 'View Notebook',
                        type: 'item',
                        translate: 'NAV.VIEW_NOTEBOOK.TITLE',
                        icon: 'dvr',
                        url: '/pages/lab/view-notebook',
                        exactMatch: true
                    },
                    {
                        id: 'write-notebook',
                        title: 'Write-Up Area',
                        type: 'item',
                        translate: 'NAV.WRITE_NOTEBOOK.TITLE',
                        icon: 'insert_comment',
                        url: '/pages/lab/write-notebook',
                        exactMatch: true
                    },
                    {
                        id: 'cell-culture-history',
                        title: 'Cell Culture History',
                        translate: 'NAV.HISTORY.TITLE',
                        type: 'item',
                        icon: 'control_camera',
                        url: '/pages/cell-culture-history',
                    },
                ]
            },
            {
                id: 'project-manager',
                title: 'Project Manager',
                translate: 'NAV.PROJECT_MANAGER.TITLE',
                type: 'item',
                icon: 'group_work',
                url: '/pages/project-manager',
            },
        ]
    }
];

export const regularNavigation: FuseNavigation[] = [
    {
        id: '',
        title: '',
        translate: '',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type: 'item',
                icon: 'dashboard',
                url: '/pages/dashboard',
            },
            {
                id: 'experiments',
                title: 'Experiments',
                translate: 'NAV.EXPERIMENTS.TITLE',
                type: 'item',
                icon: 'web_asset',
                url: '/pages/experiments',
            },
            {
                id: 'inventories',
                title: 'Inventories',
                translate: 'NAV.INVENTORIES.TITLE',
                type: 'item',
                icon: 'rate_review',
                url: '/pages/inventories',
            },
            {
                id: 'calendar',
                title: 'Calendar',
                translate: 'NAV.CALENDAR.TITLE',
                type: 'item',
                icon: 'calendar_today',
                url: '/pages/calendar',
            },
            {
                id: 'task-manager',
                title: 'Task Manager',
                translate: 'NAV.TASK_MANAGER.TITLE',
                type: 'item',
                icon: 'assignment',
                url: '/pages/task-manager',
            },
            {
                id: 'file-manager',
                title: 'File Manager',
                translate: 'NAV.FILE_MANAGER.TITLE',
                type: 'item',
                icon: 'library_books',
                url: '/pages/file-manager',
            },
            {
                id: 'molarity-calculator',
                title: 'Molarity Calculator',
                translate: 'NAV.CALCULATOR.TITLE',
                type: 'item',
                icon: 'laptop_mac',
                url: '/pages/molarity-calculator',
            },
            {
                id: 'mission-control',
                title: 'Mission Control',
                translate: 'NAV.MISSION_CONTROL.TITLE',
                type: 'item',
                icon: 'control_camera',
                url: '/pages/mission-control',
            },
            {
                id: 'cell-culture-history',
                title: 'Cell Culture History',
                translate: 'NAV.HISTORY.TITLE',
                type: 'item',
                icon: 'control_camera',
                url: '/pages/cell-culture-history',
            },
            {
                id: 'lab-notebook',
                title: 'Lab Notebook',
                translate: 'NAV.LAB_NOTEBOOK.TITLE',
                type: 'collapsable',
                icon: 'equalizer',
                children: [
                    {
                        id: 'view-notebook',
                        title: 'View Notebook',
                        type: 'item',
                        translate: 'NAV.VIEW_NOTEBOOK.TITLE',
                        icon: 'dvr',
                        url: '/pages/lab/view-notebook',
                        exactMatch: true
                    },
                    {
                        id: 'write-notebook',
                        title: 'Write-Up Area',
                        type: 'item',
                        translate: 'NAV.WRITE_NOTEBOOK.TITLE',
                        icon: 'insert_comment',
                        url: '/pages/lab/write-notebook',
                        exactMatch: true
                    },
                    {
                        id: 'cell-culture-history',
                        title: 'Cell Culture History',
                        translate: 'NAV.HISTORY.TITLE',
                        type: 'item',
                        icon: 'control_camera',
                        url: '/pages/cell-culture-history',
                    },
                ]
            },
            {
                id: 'project-manager',
                title: 'Project Manager',
                translate: 'NAV.PROJECT_MANAGER.TITLE',
                type: 'item',
                icon: 'group_work',
                url: '/pages/project-manager',
            },
        ]
    }
];


export const navigation: FuseNavigation[] = [
    {
        id: '',
        title: '',
        translate: '',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type: 'item',
                icon: 'email',
                url: '/pages/dashboard',
                badge: {
                    title: '25',
                    translate: 'NAV.DASHBOARD.BADGE',
                    bg: '#F44336',
                    fg: '#FFFFFF'
                }
            }
        ]
    }
];
