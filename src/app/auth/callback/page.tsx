import AuthCallbackHandler from "./init"

export const metadata = {
    title: 'Authenticating...',
    description: 'Bakey is a service designed to connect people. Create your own personalized profile page and share it.',
}

export default async function AuthCallback() {
    await AuthCallbackHandler();
}