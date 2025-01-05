import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
export default function LoginPage({ signIn, signUp}: { signIn: () => void, signUp: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Login or sign up with your Google account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button variant="outline" className="w-full" onClick={signIn}>
                        <Image
                            src="https://w7.pngwing.com/pngs/882/225/png-transparent-google-logo-google-logo-google-search-icon-google-text-logo-business-thumbnail.png"
                            width={24}
                            height={24}
                            alt="Google logo"
                            className="mr-2"
                        />
                        Login with Google {"       "}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={signUp}>
                        <Image
                            src="https://w7.pngwing.com/pngs/882/225/png-transparent-google-logo-google-logo-google-search-icon-google-text-logo-business-thumbnail.png"
                            width={24}
                            height={24}
                            alt="Google logo"
                            className="mr-2"
                        />
                        Sign up with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <p className="mt-2 text-xs text-center text-gray-700">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

