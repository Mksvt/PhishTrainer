import { useRouter } from "next/navigation";
import {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetProfileQuery,
} from "@/lib/api/apiSlice";
import type { LoginRequest, RegisterRequest } from "@/lib/api/types";

export const useAuth = () => {
    const router = useRouter();
    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    const { data: profileData, isLoading: isLoadingProfile } =
        useGetProfileQuery();

    const handleLogin = async (credentials: LoginRequest) => {
        const response = await login(credentials).unwrap();
        router.push("/dashboard");
        return response;
    };

    const handleRegister = async (credentials: RegisterRequest) => {
        const response = await register(credentials).unwrap();
        router.push("/dashboard");
        return response;
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            router.push("/");
        } catch {
            router.push("/");
        }
    };

    return {
        user: profileData?.user,
        isAuthenticated: !!profileData?.user,
        isLoadingAuth: isLoadingProfile,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isLoggingIn,
        isRegistering,
        isLoggingOut,
    };
};
