export interface AdminAuthDefinition {
  isAuthenticated(): boolean | Promise<boolean>;
}

export interface AdminLoginPageProps {
  onAuthenticated(): void;
}
