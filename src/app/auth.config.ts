import { AuthConfig } from "angular-oauth2-oidc"

export const auth: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin,
    clientId: '279315336012-qsprdud1djkob46sp8avlu8uhcv75lkd.apps.googleusercontent.com',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false,
    requireHttps: false, 
}