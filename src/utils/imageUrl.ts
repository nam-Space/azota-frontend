import defaultAvatar from "@/images/header/user/default-avatar.png";

export const getUserAvatar = (name: string | undefined) => {
    return name
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/user/${name}`
        : defaultAvatar.src;
};
