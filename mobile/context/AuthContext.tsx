import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(
    async (token: string) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          await logout();
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.log("USER FETCH ERROR", error);
      }
    },
    [logout],
  );

  const login = useCallback(
    async (token: string) => {
      await AsyncStorage.setItem("token", token);
      setToken(token);
      await fetchUser(token);
    },
    [fetchUser],
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          setToken(storedToken);
          await fetchUser(storedToken);
        }
      } catch (error) {
        console.log("AUTH INIT ERROR", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
