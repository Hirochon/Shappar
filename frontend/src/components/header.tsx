import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { auth, signOut } from '@/lib/firebase-auth';
import { useAuthStore } from '@/stores/auth-store';

function getAvatarFallback(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'U';
  }

  return trimmedName.slice(0, 1).toUpperCase();
}

export function Header() {
  const authUser = useAuthStore((state) => state.authUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const userName = authUser?.name?.trim() || 'ユーザー';
  const iconImage = authUser?.iconimage?.trim() || undefined;

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOut(auth);
      clearUser();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header
      className="border-b border-slate-200 bg-white/90 backdrop-blur"
      role="banner"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          className="text-lg font-semibold tracking-tight text-slate-950 transition-colors hover:text-sky-700"
          to="/"
        >
          Shappar
        </Link>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-slate-700">{userName}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="ユーザーメニュー"
                className="rounded-full p-0"
                size="icon"
                variant="ghost"
              >
                <Avatar className="size-10 border border-slate-200">
                  {iconImage ? (
                    <img
                      alt={userName}
                      className="aspect-square h-full w-full object-cover"
                      src={iconImage}
                    />
                  ) : (
                    <AvatarFallback>
                      {getAvatarFallback(userName)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p>{userName}</p>
                  <p className="truncate text-xs font-normal text-slate-500">
                    {authUser?.user_id ?? 'user'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">マイページ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isSigningOut}
                onSelect={() => void handleSignOut()}
              >
                {isSigningOut ? 'ログアウト中...' : 'ログアウト'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
