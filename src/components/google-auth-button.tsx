import React, { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export interface PopupProps {
  url: string;
  title: string;
  width: number;
  height: number;
}

function popupWindow({ url, title, width, height }: PopupProps): Window | null {
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  return window.open(
    url,
    title,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
    scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
    height=${height}, top=${top}, left=${left}`
  );
}

export default function GoogleAuthButton() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const popupRef = useRef<Window | null>(null);

  const handleGoogleLogin = useCallback(() => {
    setIsAuthenticating(true);
    const popup = popupWindow({
      url: "/api/auth/google",
      title: "googleAuthPopup",
      width: 600,
      height: 600,
    });

    popupRef.current = popup;

    if (!popup) {
      setIsAuthenticating(false);
      return;
    }

    const checkPopupClosed = setInterval(() => {
      if (popupRef.current?.closed) {
        setIsAuthenticating(false);
        clearInterval(checkPopupClosed);
      }
    }, 500);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.token) {
        popup?.close();
        setIsAuthenticating(false);
        router.push("/dashboard");
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      clearInterval(checkPopupClosed);
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full flex items-center gap-2"
      disabled={isAuthenticating}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-5 w-5"
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      {isAuthenticating ? "Authenticating..." : "Login with Google"}
    </Button>
  );
}
