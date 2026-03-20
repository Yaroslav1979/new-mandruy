import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

type AuthContextType = {
  token: string | null;
  user: UserType | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  });

  const initAuth = async () => {
    const storedToken = await AsyncStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      await fetchUser(storedToken);
    }

    setLoading(false);
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.log("USER FETCH ERROR", error);
    }
  };

  const login = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    setToken(token);
    await fetchUser(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
