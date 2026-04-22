import { LoginRequest } from "@/src/types";


export async function loginAdmin(loginData: LoginRequest) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    if (!res.ok) {
        throw new Error("Failed to login");
    }

    const data = await res.json();

    // Store token so NavbarWrapper can detect auth state
    localStorage.setItem("user_token", data.access_token);

    // Notify all listeners (NavbarWrapper) that auth state changed
    window.dispatchEvent(new Event("auth-change"));

    return data;
}

export async function getAdminData(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();
    return data;
}