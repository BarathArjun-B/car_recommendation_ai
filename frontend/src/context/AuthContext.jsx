import { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useLocalStorage('bavh_users', []);
  const [user, setUser] = useLocalStorage('bavh_user', null);
  const [wishlist, setWishlist] = useLocalStorage('bavh_wishlist', []);
  const [compare, setCompare] = useLocalStorage('bavh_compare', []);

  const register = ({ name, email, password }) => {
    if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Account already exists.' };
    }
    const nextUser = { id: crypto.randomUUID(), name, email, password };
    setUsers((current) => [...current, nextUser]);
    setUser({ id: nextUser.id, name, email });
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const match = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
    );
    if (!match) return { ok: false, message: 'Invalid email or password.' };
    setUser({ id: match.id, name: match.name, email: match.email });
    return { ok: true };
  };

  const logout = () => setUser(null);

  const toggleWishlist = (carId) =>
    setWishlist((current) => (current.includes(carId) ? current.filter((id) => id !== carId) : [...current, carId]));

  const toggleCompare = (carId) =>
    setCompare((current) => (current.includes(carId) ? current.filter((id) => id !== carId) : [...current.slice(-2), carId]));

  const value = useMemo(
    () => ({
      user,
      users,
      wishlist,
      compare,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
      toggleWishlist,
      toggleCompare,
    }),
    [user, users, wishlist, compare],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
