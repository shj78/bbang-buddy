export const setCookie = (name: string, value: string, days: number = 7) => {
    // 브라우저 환경이 아니면 아무것도 하지 않음
    if (typeof window === "undefined") {
        return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
    //브라우저 환경이 아니면 null 반환
    if (typeof window === "undefined") {
        return null;
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
};

// 쿠키 삭제
export const deleteCookie = (name: string) => {
    //브라우저 환경이 아니면 null 반환
    if (typeof window === "undefined") {
        return null;
    }

    document.cookie = `${name}=;max-age=0;path=/`;
};
