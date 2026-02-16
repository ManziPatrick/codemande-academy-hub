import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@apollo/client/react';
import { gql } from "@apollo/client";
import { toast } from 'sonner';
import { env } from '@/lib/env';

const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($idToken: String!) {
    googleLogin(idToken: $idToken) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

interface GoogleLoginData {
    googleLogin: {
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: string;
        };
    };
}

export function GoogleOneTap() {
    const { user, loginWithToken } = useAuth();
    const [googleLogin] = useMutation<GoogleLoginData>(GOOGLE_LOGIN);

    useEffect(() => {
        if (user) return; // Don't show if already logged in

        const handleCredentialResponse = async (response: any) => {
            try {
                const { data } = await googleLogin({
                    variables: { idToken: response.credential }
                });

                if (data?.googleLogin) {
                    loginWithToken(data.googleLogin.token, data.googleLogin.user);
                    toast.success('Successfully logged in with Google');
                }
            } catch (error: any) {
                console.error('Google login error:', error);
                toast.error('Google login failed');
            }
        };

        // Initialize Google One Tap
        const initializeGoogleOneTap = () => {
            if (!(window as any).google) {
                console.error('Google script not loaded');
                return;
            }

            (window as any).google.accounts.id.initialize({
                client_id: env.GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                cancel_on_tap_outside: false,
                auto_select: false,
            });

            console.log('Google One Tap initialized for origin:', window.location.origin);

            (window as any).google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed()) {
                    console.warn('One Tap prompt not displayed:', notification.getNotDisplayedReason());
                } else if (notification.isSkippedMoment()) {
                    console.log('One Tap prompt skipped:', notification.getSkippedReason());
                } else if (notification.isDismissedMoment()) {
                    console.log('One Tap prompt dismissed:', notification.getDismissedReason());
                }
            });
        };

        // Load Google script if not present
        if (!(window as any).google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleOneTap;
            document.head.appendChild(script);
        } else {
            initializeGoogleOneTap();
        }
    }, [user, googleLogin, loginWithToken]);

    return null;
}
