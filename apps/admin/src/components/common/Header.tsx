import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/common/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';

import { removeTokens } from '@/model/auth/tokenStorage';
import { useIsLoggedInState } from '@/model/auth/useIsLoggedIn';
import { ROUTE } from '@/constants/route';

export function Header() {
  const navigate = useNavigate();
  const [, setLoggedIn] = useIsLoggedInState();

  const handleLogout = () => {
    removeTokens();
    setLoggedIn(false);
    navigate(ROUTE.LOGIN, { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            U
          </span>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-muted-foreground text-xs leading-none">user@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ChevronsUpDown className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
