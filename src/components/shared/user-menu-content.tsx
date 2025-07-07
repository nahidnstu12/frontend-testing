import { UserInfo } from '@/components/shared/user-info';
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { type User } from '@/types/shared';
import { LogOut, Settings } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '@/store/features/auth/authSlice';
import Cookies from 'js-cookie';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <a className="block w-full cursor-pointer" href="/profile/edit">
                        <Settings className="mr-2" />
                        Settings
                    </a>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2" />
                Log out
            </DropdownMenuItem>
        </>
    );
}
