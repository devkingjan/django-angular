import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : '',
        title    : '',
        translate: '',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.DASHBOARD.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/admin/dashboard',
            },
            {
                id       : 'companies',
                title    : 'Companies',
                translate: 'NAV.COMPANIES.TITLE',
                type     : 'item',
                icon     : 'people',
                url      : '/admin/companies',
            }
        ]
    }
];
