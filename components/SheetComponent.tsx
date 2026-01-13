import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User, Settings } from "lucide-react"
import { Dialog } from "./ui/dialog"
import DialogComponent from "./DialogComponent"
import { Separator } from "@/components/ui/separator"
import { useGetRole } from "@/hooks/useGetRole"
import { useLogout } from "@/hooks/useAuth"

export function SheetComponent() {
    const { role, loading } = useGetRole();
    const { logout } = useLogout();

    const logoutHandler = async () => {
        await logout();
    }
    
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
                        <DialogComponent role={role ?? undefined} />

                        <Separator />

                        {/* User Profile Section */}
                        <div className="grid gap-2">
                            <Button variant="ghost" className="justify-start cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                            <Button variant="ghost" className="justify-start cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
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
