import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
};

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const completeOnboarding = async (onboardingData) => {
    const response = await axiosInstance.post("/auth/onboarding", onboardingData);
    return response.data;
};

export const getAuthUser = async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
};

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
};

export const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
};

export const sendFriendRequest = async (recipientId) => {
    const response = await axiosInstance.post(`/users/friend-request/${recipientId}`);
    return response.data;
};

export const acceptFriendRequest = async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
};

export const getFriendRequests = async () => {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
};

export const getOutgoingFriendReqs = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
};

export const getStreamToken = async () => {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
};