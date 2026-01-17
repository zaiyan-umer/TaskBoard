'use client'
import { useUsers } from '@/hooks/useUsers';
import { useUser } from '@/store/auth.store'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Mail, Shield, Crown, Loader2 } from 'lucide-react'
import { useUpgradeUser } from '@/hooks/useUpgradeUser';

const Profile = () => {
    const user = useUser();
    const { data } = useUsers(user?.role);
    const users = data ?? []
    const { mutateAsync: upgradeUser } = useUpgradeUser();
    const [upgrading, setUpgrading] = useState<string | null>(null);

    const handleUpgradeToAdmin = async (userId: string) => {
        setUpgrading(userId);
        try {
            await upgradeUser(userId);
        } finally {
            setUpgrading(null);
        }
    }

    if (!user) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 p-6">
            {/* Left Side - User Info */}
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name */}
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Name</p>
                            <p className="font-semibold text-lg">{user.username || 'N/A'}</p>
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Email</p>
                            </div>
                            <p className="font-semibold break-all">{user.email || 'N/A'}</p>
                        </div>

                        {/* Role */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Role</p>
                            </div>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="gap-1">
                                {user.role === 'admin' && <Crown className="h-3 w-3" />}
                                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                            </Badge>
                        </div>

                        {/* User ID */}
                        <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">User ID</p>
                            <p className="text-xs font-mono break-all">{user?._id?.toString() || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side - Users List (Admin Only) */}
            {user.role === 'admin' && (
                <div className="md:col-span-2 lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                All Users
                            </CardTitle>
                            <CardDescription>
                                Manage user roles and permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {users && users.length > 0 ? (
                                <div className="space-y-2 max-h-150 overflow-y-auto">
                                    {users.map((u: any) => {
                                        return (
                                            <div key={u._id}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold">{u.username}</p>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={u.role === 'admin' ? 'default' : 'secondary'}
                                                        className="gap-1"
                                                    >
                                                        {u.role === 'admin' && <Crown className="h-3 w-3" />}
                                                        {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'User'}
                                                    </Badge>

                                                    {u.role !== 'admin' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpgradeToAdmin(u._id)}
                                                            disabled={upgrading === u._id}
                                                            className='cursor-pointer'
                                                        >
                                                            {upgrading === u._id ? (
                                                                <>
                                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                                    Upgrading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Crown className="h-3 w-3 mr-1" />
                                                                    Make Admin
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No users found</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Profile