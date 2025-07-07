import { NavFooter } from '@/components/shared/nav-footer';
import { NavMain } from '@/components/shared/nav-main';
import { NavUser } from '@/components/shared/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types/shared';
import { LayoutGrid } from 'lucide-react';
import { Link } from 'react-router';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Institutions',
    //     href: '/institutions',
    //     icon: Building2,
    // },
    // {
    //     title: 'Users',
    //     href: '/users',
    //     icon: User,
    // },
    // {
    //     title: 'Notices',
    //     href: '/notices',
    //     icon: Bell,
    // },
    // {
    //     title: 'Sliders',
    //     href: '/sliders',
    //     icon: Sliders,
    // },
    // {
    //     title: 'Static Contents',   
    //     href: '/static-contents',
    //     icon: FileText,
    // },
    // {
    //     title: 'Teachers',
    //     href: '/teachers',
    //     icon: User,
    // },
    // {
    //     title: 'Levels',
    //     href: '/levels',
    //     icon: Triangle,
    // },
    // {
    //     title: 'Subjects',
    //     href: '/subjects',
    //     icon: Book,
    // },
    
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
