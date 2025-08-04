/**
 * Tipos para el módulo de autenticación
 */

export interface LoginInput {
   username: string;
   password: string;
}

export interface RefreshTokenInput {
   refreshToken: string;
}

export interface User {
   id: number;
   firstName: string;
   lastName: string;
   email?: string;
   phone?: string;
   isActive: boolean;
   lastLogin?: string; // ISO string format for dates in frontend
   isTechnician: boolean;
   profile?: Profile;
   userRoles?: UserRole[];
   technicianProfile?: TechnicianProfile;
}

export interface Profile {
   id: number;
   avatarUrl?: string;
   bio?: string;
}

export interface UserRole {
   id: number;
   role: Role;
   scopes?: string[];
}

export interface Role {
   id: number;
   name: string;
   description?: string;
   isSystem: boolean;
   permissions?: RolePermission[];
}

export interface RolePermission {
   id: number;
   permission: Permission;
}

export interface Permission {
   id: number;
   name: string;
   description?: string;
   resource: string;
   actions: string[];
}

export interface AuthCredential {
   id: number;
   username: string;
}

export interface LoginResponse {
   accessToken: string;
   refreshToken: string;
   user: User;
   authCredential: AuthCredential;
}

export interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (credentials: LoginInput) => Promise<LoginResponse>;
   logout: () => void;
   refreshToken: () => Promise<void>;
   hasPermission: (resource: string, action: string) => boolean;
   hasRole: (roleName: string) => boolean;
}

export interface TechnicianSpeciality {
   id: number;
   name: string;
   description: string;
}

export interface TechnicianProfile {
   id: number;
   isActive: boolean;
   specialization?: TechnicianSpeciality;
}

export interface AuthState {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
}