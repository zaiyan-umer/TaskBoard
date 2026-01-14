'use client'
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User, Settings, LayoutDashboard } from "lucide-react"
import { Dialog } from "./ui/dialog"
import DialogComponent from "./tasks/DialogComponent"
import { Separator } from "@/components/ui/separator"
import { useLogout } from "@/hooks/useAuth"
import { useUser } from "@/store/auth.store"
import { useRouter } from "next/navigation"

export function SheetComponent() {
    const { logout } = useLogout();
    const router = useRouter();

    const logoutHandler = async () => {
        await logout();
    }

    const user = useUser();

    return (
        <Sheet>
            <Dialog>
                <SheetTrigger asChild className="cursor-pointer">
                    <Button variant="outline" size="icon"><Menu /></Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>
                            Manage your tasks and account settings
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-4 py-4">
                        {/* Create Task Button */}
                        <DialogComponent />
                        <Separator />

                        {/* User Profile Section */}
                        <div className="grid gap-2">
                            <Button variant="ghost" className="justify-start cursor-pointer" onClick={() => router.push('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                            <Button variant="ghost" className="justify-start cursor-pointer" onClick={() => router.push('/')}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                            {user?.role === "admin" &&
                                <Button variant="ghost" className="justify-start cursor-pointer" onClick={() => router.push('/admin-panel')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Admin Panel
                                </Button>
                            }
                        </div>

                        <Separator />

                        {/* Logout Button */}
                        <Button
                            variant="destructive"
                            className="justify-start max-w-80 mx-8 rounded-sm cursor-pointer"
                            onClick={logoutHandler}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline" className="cursor-pointer">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Dialog>
        </Sheet>
    )
}
