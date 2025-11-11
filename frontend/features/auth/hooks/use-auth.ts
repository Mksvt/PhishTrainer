import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetProfileQuery,
    apiSlice,
} from "@/lib/api/apiSlice";
import type { LoginRequest, RegisterRequest } from "@/lib/api/types";

export const useAuth = () => {
    const router = useRouter();
    const dispatch = useDispatch();
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
            dispatch(apiSlice.util.resetApiState());
            router.push("/");
        } catch {
            dispatch(apiSlice.util.resetApiState());
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
