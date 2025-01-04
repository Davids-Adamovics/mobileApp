
export interface UserLoginRequest {
    /**
     * User email JSDoc
     */
    email: string,
    password: string,
    device?: string // iOS, Android
}
